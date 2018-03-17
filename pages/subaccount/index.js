// pages/subaccount/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],
    isShowNoDataMark:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    wx.showLoading({
      title: '请稍后',
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/SubAccount/GetList',
      method: "GET",
      success: function (res) {
        main.setData({
          result: res
        });
        if (res.length == 0) {
          main.setData({
            isShowNoDataMark: true
          })
        }
        wx.hideLoading();
      }
    }
    app.NetRequest(data);
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
  add:function(){
    wx.navigateTo({
      url: 'detail',
    });
  }
})