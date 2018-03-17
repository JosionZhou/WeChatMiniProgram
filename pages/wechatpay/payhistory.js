var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],
    pageIndex:1,
    isShowLoading:false,
    isShowNoDataMark:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    var main=this;
    var data = {
      url: app.globalData.serverAddress + '/WeChatPay/History?pageIndex='+this.data.pageIndex,
      method: "GET",
      success: function (res) {
        if(res.length>0){
          var result=main.data.result;
          for(var index in res){
            result.push(res[index]);
          }
          main.setData({
            isShowNoDataMark:false,
            result:result
          });
        } else {
          main.setData({
            isShowNoDataMark: true
          });
        }
        main.setData({
          isShowLoading:false
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
    if (this.data.isShowNoDataMark){
      return;
    }
    this.setData({
      isShowLoading: true,
      pageIndex:this.data.pageIndex+1
    });
    this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})