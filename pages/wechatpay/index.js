// pages/wechatpay/index.js
var app=getApp();
const initData={
  amountShow: 0.00,//总费用
  amountInput: 0.00,//输入框费用
  amount:0.00,//运费
  amount1:0.00,//历史欠款
  commission:0.00,//手续费
  wxPaymentCommissionRate:0.00,//手续费率
  items:[],
  isCheckAll:true,
  isAutoShipment:false,//是否自动放货
  isEnableAutoShipment:false,
  autoShipmentTextColor:"#ccc",
  isWXPaymentCommission:false,//是否收手续费
  checkAllText:"反选",
  selectedIds:[],
  selectedItems:[],
  tradeNo:"",
  productTypes:null,
  productTypeIndex:0,
  productTypeNames:[],
  originalCurrencyId:null,//原币id
  originalAmount:0.00,//原币金额
  originalCurrencyRate:0.00,//原币汇率
  payMessage:"",
  otherCurrencyAmounts:[],
  cid:1,
  currencyName:""
}
Page({

  /**
   * 页面的初始数据
   */
  data: initData,

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
      url: app.globalData.serverAddress + '/WeChatPay/Query?openId=1&cid='+main.data.cid,
      method: "GET",
      success: function (res) {
        var items = res.ReceiveGoodsDetailList;
        var selectedIds = new Array();
        //支付外币时，默认不勾选单号
        if(main.data.cid!=1)
        {
          for(let i=0;i<items.length;i++){
            items[i].Selected=false;
          }
          main.setData({
            checkAllText:"全选",
            isCheckAll:false
          });
          main.enableAutoShipment();
        }
        else{
          for (var i = 0; i < items.length; i++) {
            selectedIds.push(items[i].Id);
          }
        }
        main.setData({
          items: items,
          amountShow: res.TotalAmount,
          amountInput: res.Amount,
          amount1:res.Amount1,
          amount:res.Amount,
          isWXPaymentCommission: res.WXPaymentCommission,
          commission:res.Commission,
          wxPaymentCommissionRate:res.WXPaymentCommissionRate,
          selectedItems: items,
          selectedIds: selectedIds,
          originalCurrencyId:res.OriginalCurrencyId,
          originalCurrencyRate:res.OriginalCurrencyRate,
          originalAmount:res.OriginalAmount,
          payMessage:res.PayMessage,
          currencyName:res.CurrencyName==null?"人民币":res.CurrencyName
        });
        wx.hideLoading();
        main.getAmountSummary(res.OriginalCurrencyId);
      }
    }

    let data1 = {
      url:app.globalData.serverAddress+'/WeChatPay/GetPrductTypes',
      method:"GET",
      success:function(res){
        let productTypeNames=res.map(p=>p.Value);
        main.setData({
          productTypes:res,
          productTypeNames:productTypeNames
        });
      }
    }
    app.NetRequest(data);
    app.NetRequest(data1);
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
        amount: this.data.amountInput + appendStr
      });
    } else {
      if (this.data.amountInput != "") {
        this.setData({
          amount: this.data.amountInput + ".00"
        });
      } else {
        this.setData({
          amount: "0.00"
        });
      }
    }
    amount =parseFloat(this.data.amount);
    let commissionRate = (amount > 0 &&(amount* this.data.wxPaymentCommissionRate).toFixed(2)==0)?0.01:(amount* this.data.wxPaymentCommissionRate).toFixed(2);
    console.log("amount:",amount)
    this.setData({
      amountShow: (amount + parseFloat(commissionRate)).toFixed(2),
      commission: parseFloat(commissionRate),
      amount:amount
    });
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
    var freightAmount = parseFloat((amount + this.data.amount1).toFixed(2));
    var commission = parseFloat(this.data.isWXPaymentCommission ? (freightAmount * this.data.wxPaymentCommissionRate).toFixed(2) : 0);
    this.setData({
      items: items,
      amount: freightAmount,
      commission: commission,
      amountShow: (freightAmount + commission).toFixed(2),
      amountInput: (freightAmount + commission).toFixed(2),
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
    if(selectedItems.length>0){
      this.setData({
        isEnableAutoShipment:false,
        isAutoShipment:false,
        autoShipmentTextColor:"#ccc"
      });
    }else
    {
      this.enableAutoShipment();
    }
  },
  enableAutoShipment:function(){
    this.setData({
      isEnableAutoShipment: true,
      isAutoShipment: true,
      autoShipmentTextColor: "black"
    });
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
    if (selectedItems.length > 0) {
      this.setData({
        isEnableAutoShipment: false,
        isAutoShipment: false,
        autoShipmentTextColor: "#ccc"
      });
    } else {
      this.setData({
        isEnableAutoShipment: true,
        isAutoShipment: true,
        autoShipmentTextColor: "balck"
      });
    }
    var freightAmount = parseFloat((amount + this.data.amount1).toFixed(2));
    var commission = parseFloat(this.data.isWXPaymentCommission ? (freightAmount * this.data.wxPaymentCommissionRate).toFixed(2) : 0);
    this.setData({
      items:items,
      isCheckAll:!this.data.isCheckAll,
      checkAllText: text,
      amount: freightAmount,
      commission: commission,
      amountShow: (freightAmount + commission).toFixed(2),
      amountInput: (freightAmount + commission).toFixed(2),
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
    let productType = this.data.productTypes[this.data.productTypeIndex].Key
    var data = {
      url: app.globalData.serverAddress + '/WeChatPay/Pay',
      data: {
        openid: app.globalData.openId,
        Amount:this.data.amount,
        Commission:0,
        ReceiveGoodsDetailList:this.data.selectedItems,
        SelectIdList:this.data.selectedIds.toString(),
        TotalAmount:this.data.amountShow,
        TradeType:"MAPP",
        // TradeType: "MAPP1",
        // TradeType: "MAPP2",
        WXPaymentCommission:this.data.isWXPaymentCommission,
        IsRelease:this.data.isAutoShipment,
        ProductType:productType,
        OriginalCurrencyId:this.data.originalCurrencyId,
        OriginalAmount:this.data.amountInput,
        OriginalCurrencyRate:this.data.originalCurrencyRate
      },
      success: function (res) {
        wx.hideLoading();
        var data = JSON.parse(res.Data);
        if(!res.Success){
          wx.showModal({
            title: '请求失败',
            content: res.ErrMsg,
            showCancel:false
          });
          return;
        }
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
  tapAutoShipment:function(){
    if(!this.data.isEnableAutoShipment)
    {
      this.setData({
        isAutoShipment:false
      });
    }else
    {
      this.setData({
        isAutoShipment: !this.data.isAutoShipment
      });
    }
  },
  productTypeChange:function(e){
    let that = this;
    this.setData({
      productTypeIndex:e.detail.value
    });
  },
  getAmountSummary(originalCurrencyId){
    let that=this;
    wx.showLoading({
      title: '请稍后',
    })
    var data = {
      url: app.globalData.serverAddress + '/UserHome/Load',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        let otherCurrencyAmounts = res.CurrencyAmount.filter(p=>{
          return p.Id!=originalCurrencyId;
        });
        that.setData({
          otherCurrencyAmounts:otherCurrencyAmounts
        });
      }
    }
    app.NetRequest(data);
  },
  payOtherAmount(){
    let that = this;
    let items = this.data.otherCurrencyAmounts.map(p=>p.Name+"："+p.Amount)
    wx.showActionSheet({
        itemList: items,
        success: function(res) {
            if (!res.cancel) {
                let item = that.data.otherCurrencyAmounts[res.tapIndex];
                initData.cid=item.Id;
                that.setData(initData);
                that.onLoad();
            }
        }
    });
  }
})