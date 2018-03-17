// pages/wechatbinding/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/WeChatBind/GetData',
      method: "GET",
      success: function (res) {
        main.setData({
          result: res,
        });
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
  unbind:function(e){
    var id = e.target.dataset.id;
    var main = this;
    wx.showModal({
      title: '解除微信账号绑定',
      content: '解除微信绑定后您将无法使用微信快捷登录，除非您再次绑定',
      success:function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          });
          var data = {
            url: app.globalData.serverAddress + '/WeChatBind/Delete?id='+id,
            method: "GET",
            success: function (res) {
              wx.hideLoading();
              main.setData({
                result: res,
              });
            },
            fail:function(){
              wx.hideLoading();
              wx.showToast({
                title: "解除绑定失败",
                icon:"none"
              })
            }
          }
          app.NetRequest(data);
        }
      }
    })
  }
})