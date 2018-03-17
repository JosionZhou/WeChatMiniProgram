// pages/wechatpay/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountShow: "0.00",
    amountInput: "0.00",
    items:[],
    isCheckAll:true,
    checkAllText:"反选",
    selectedIds:[],
    selectedItems:[],
    tradeNo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var main = this;
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    var data = {
      url: app.globalData.serverAddress + '/WeChatPay/Query',
      method: "GET",
      success: function (res) {
        main.setData({
          items: res.ReceiveGoodsDetailList,
          amountShow: res.TotalAmount,
          amountInput: res.TotalAmount
        });
        wx.hideLoading();
      }
    }
    app.NetRequest(data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  inputAmount: function (e) {
    var text = e.detail.value.trim();
    if (text.indexOf(".") != -1) {
      text = text.substr(0, text.indexOf(".") + 3);
    }
    var amount = this.data.amountInput;
    var result = text.replace(amount, "");
    var chars = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (chars.indexOf(result) == -1 && text.length > amount.length) {
      this.setData({
        amountInput: amount
      });
    } else {
      if (parseFloat(text) >= 0.01 || parseFloat(text) >= 0 || text == "") {
        this.setData({
          amountInput: text
        });
      } else {
        this.setData({
          amountInput: amount
        });
      }
    }
    if (this.data.amountInput.indexOf(".") != -1) {
      var amountLength = this.data.amountInput.length
      var pointIndex = this.data.amountInput.indexOf(".");
      var appendStr = "";
      if (amountLength - pointIndex == 1) {
        appendStr = "00"
      }
      if (amountLength - pointIndex == 2) {
        appendStr = "0"
      }
      this.setData({
        amountShow: this.data.amountInput + appendStr
      });
    } else {
      if (this.data.amountInput != "") {
        this.setData({
          amountShow: this.data.amountInput + ".00"
        });
      } else {
        this.setData({
          amountShow: "0.00"
        });
      }
    }
  },
  clickItem:function(e){
    var id = e.currentTarget.dataset.id;
    var items = this.data.items;
    var checkedCount=0;
    var amount=0.00;
    var selectedIds=new Array();
    var selectedItems=new Array();
    for(var i=0;i<items.length;i++){
      if(items[i].Id==id){
        items[i].Selected = !items[i].Selected;
      }
      if(items[i].Selected){
        checkedCount++;
        amount += parseFloat(items[i].Amount);
        selectedIds.push(items[i].Id);
        selectedItems.push(items[i]);
      }
    }
    this.setData({
      items:items,
      amountShow: amount.toFixed(2),
      amountInput: amount.toFixed(2),
      selectedIds:selectedIds,
      selectedItems:selectedItems
    });
    if(checkedCount==items.length){
      this.setData({
        isCheckAll:true,
        checkAllText:"反选"
      })
    }else{
      this.setData({
        isCheckAll: false,
        checkAllText: "全选"
      })
    }
  },
  checkAll:function(){
    var items = this.data.items;
    var text="";
    var amount = 0.00;
    var selectedIds = new Array();
    var selectedItems = new Array();
    if(this.data.isCheckAll){
      for (var i = 0; i < items.length; i++) {
        items[i].Selected = false;
      }
      text="全选";
    } else {
      for (var i = 0; i < items.length; i++) {
        items[i].Selected = true;
        amount += parseFloat(items[i].Amount);
        selectedIds.push(items[i].Id);
        selectedItems.push(items[i]);
      }
      text = "反选";
    }    
    this.setData({
      items:items,
      isCheckAll:!this.data.isCheckAll,
      checkAllText:text,
      amountShow: amount.toFixed(2),
      amountInput: amount.toFixed(2),
      selectedIds: selectedIds,
      selectedItems: selectedItems
    });
  },
  pay:function(){
    var main=this;
    if(this.data.amountShow<=0){
      wx.showModal({
        title: '请求失败',
        content: '支付金额必须大于0',
        showCancel:false
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask:true
    });
    var data = {
      url: app.globalData.serverAddress + '/WeChatPay/Pay',
      data: {
        openid: app.globalData.openId,
        Amount:this.data.amountShow,
        Commission:0,
        ReceiveGoodsDetailList:this.data.selectedItems,
        SelectIdList:this.data.selectedIds.toString(),
        TotalAmount:this.data.amountShow,
        TradeType:"MAPP",
        WXPaymentCommission:false
      },
      success: function (res) {
        wx.hideLoading();
        var data = JSON.parse(res.Data);
        main.data.tradeNo=res.TradeNo;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: 'MD5',
          paySign: data.paySign,
          success:function(){
            wx.showToast({
              title: "支付成功",
              icon:"none"
            });
            wx.showLoading({
              title: "请稍后",
            })
            var intervalId = setInterval(function(){
              var data = {
                url: app.globalData.serverAddress + '/WeChatPay/History?pageIndex=1',
                method: "GET",
                success: function (res) {
                  for(var i in res){
                    if (res[0].Status=="支付成功"){
                      wx.hideLoading();
                      clearInterval(intervalId);
                      wx.navigateTo({
                        url: "payhistory",
                      });
                      break;
                    }
                  }
                }
              }
              app.NetRequest(data);
            },500);
          },
          fail:function(res){
            if (res.errMsg =="requestPayment:fail cancel"){
              wx.showToast({
                title: '已取消支付',
                icon:'none'
              });
            }
          }
        })
      },
      fail:function(res){
        wx.hideLoading();
        wx.showModal({
          title: "支付请求失败",
          content: res.data.message + " " + res.data.exceptionMessage,
          showCancel:false
        })
      }
    }
    app.NetRequest(data);
    
  },
})