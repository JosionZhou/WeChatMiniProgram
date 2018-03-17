// pages/confirm/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filtResult:{},
    result: {},
    showText: false,
    checkedList:[],
    checkAllText:"全选",
    isLoading:false,
    isCheckAll: false,
    inputShowed: false,
    inputVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Confirmation/GetReceiveGoodsDetailList',
      method:'GET',
      success: function (res) {
        if (res.length == 0) {
          main.setData({
            showText: true
          });
        } else {
          for(var i=0;i<res.length;i++){
            res[i].Selected=false;
            res[i].hide=false;
          }
          main.setData({
            result: res,
            filtResult:res
          });
        }
        wx.hideLoading();
      }
    }
    getApp().NetRequest(data);
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
  bindConfirmCheck: function (event) {
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    var filtResult = this.data.filtResult;
    if (this.data.checkedList.indexOf(id) == -1) {
      this.data.checkedList.push(id);
      filtResult[index].Selected = true;
    }
    else {
      this.data.checkedList.splice(this.data.checkedList.indexOf(id), 1);
      filtResult[index].Selected = false;
    }
    this.setData({
      filtResult: filtResult
    });
  },
  checkAll:function(){
    if (this.data.filtResult.length == 0) return;
    var filtResult = this.data.filtResult;
    var text="";
    var checkedList=[];
    if (this.data.checkAllText=="全选"){
      for (var i = 0; i < filtResult.length;i++){
        filtResult[i].Selected = true;
        checkedList.push(filtResult[i].Id);
      }
      text="反选";
      this.setData({
        isCheckAll:true
      });
    } else {
      for (var i = 0; i < filtResult.length; i++) {
        filtResult[i].Selected = false;
      }
      this.setData({
        isCheckAll:false
      });
      text = "全选";
    }
    this.setData({
      filtResult: filtResult,
      checkAllText:text,
      checkedList:checkedList
    });
  },
  remove:function(){
    if (this.data.checkedList.length == 0) return;
    var filtResult = this.data.filtResult;
    var checkList = this.data.checkedList;
    var otherCheck=new Array();
    for (var i = 0; i < filtResult.length;i++){
      if (checkList.indexOf(filtResult[i].Id)!=-1){
        filtResult[i].hide=true;
      }
    }
    var result = this.data.result;
    for (var i = 0; i < result.length; i++) {
      if (checkList.indexOf(result[i].Id) != -1) {
        result[i].hide = true;
      }
    }
    for(var i=0;i<filtResult.length;i++){
      if (!filtResult[i].hide && filtResult[i].Selected){
        otherCheck.push(filtResult[i].Id);
      }
    }
    this.setData({
      checkedList: otherCheck,
      result:result,
      filtResult: filtResult
    });
  },
  confirmSingle:function(event){
    this.confirmSelected(event.currentTarget.dataset.id);
  },
  inputReferenceNumber:function(e){
    var filtResult = new Array();
    var result = this.data.result;
    for (var i = 0; i < result.length; i++) {
      if (result[i].ReferenceNumber.toLowerCase().indexOf(e.detail.value.toLowerCase())!=-1){
        filtResult.push(result[i]);
      }
    }
    this.setData({
      inputVal: e.detail.value,
      filtResult: filtResult
    });
  },
  clearInput: function () {
    var result=this.data.result;
    this.setData({
      inputVal: "",
      filtResult:result
    });
  },
  confirmSelected: function (data) {
    if (data != null && data.type==null) {
      this.data.checkedList=[];
      this.data.checkedList.push(data);
    }
    if (this.data.checkedList.length==0)return;
    var main=this;
    wx.showModal({
      title: '提示',
      content: '确认所选运单委托项后，我司将严格遵循所选委托下一步运转货件，不得再改',
      success: function (res) {
        if (!res.confirm) return;
        main.setData({
          isLoading: true
        });
        var data={
          url: app.globalData.serverAddress + '/Confirmation/Confirm',
          data:{
            SelectIdList: main.data.checkedList.toString()
          },
          method:"POST",
          success:function(res){
            main.setData({
              isLoading:false
            });
            wx.showToast({
              title: '成功',  
              icon: 'success'
            });
            main.remove();
          },
          fail:function(res){
            wx.showModal({
              title: '操作失败',
              content: '确认运单失败，请刷新页面后重试，如多次失败，请联系业务',
              showCancel:false
            })
          }
        }
        getApp().NetRequest(data);
      }
    });
  }
})