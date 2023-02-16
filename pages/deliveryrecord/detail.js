// pages/deliveryrecord/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    item: null,
    tabs: ["基本信息", "规格", "轨迹信息", "费用明细", "待跟进问题"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    width: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          width: sliderWidth
        });
      }
    });
    wx.showLoading({
      title: '请稍后',
      mask: true
    });
    var id = options.id
    this.data.id = id;
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/DeliveryRecord/Detail',
      method: "GET",
      data: {
        id: id
      },
      success: function (res) {
        let packageTracks = null;
        if (res.IsShowPackageTracks) {
          packageTracks = JSON.parse(res.PackageTracksJsonString);
          packageTracks.forEach(element => {
            element.open = false;
          });
        }
        wx.hideLoading();
        main.setData({
          item: res,
          packageTracks: packageTracks
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  addProblem: function () {
    var main = this;
    wx.showModal({
      title: '警告',
      content: '确定暂扣货物吗？\n (警告：货物暂扣后，将暂停所有操作流程，由于此操作造成的时效问题，一律由客户自身承担)',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          });
          var data = {
            url: app.globalData.serverAddress + '/Problem/AddProblem1',
            type: "POST",
            data: {
              rgdId: parseInt(main.data.id)
            },
            success: function (res) {
              wx.hideLoading();
              if (res.Success) {
                wx.showModal({
                  title: '提示',
                  content: '操作成功！',
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '操作失败',
                  content: '错误消息：' + res.Message,
                  showCancel: false
                })
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '操作失败',
                content: res.data.message + "：" + res.data.exceptionMessage,
                showCancel: false
              })
            }
          }
          app.NetRequest(data);
        }
      }
    })
  },
  trackToggle: function (e) {
    var id = e.currentTarget.id,
      packageTracks = this.data.packageTracks;
    console.log(id);
    for (var i = 0, len = packageTracks.length; i < len; ++i) {
      if (packageTracks[i].PackageId == parseInt(id)) {
        packageTracks[i].open = !packageTracks[i].open
      } else {
        packageTracks[i].open = false
      }
    }
    this.setData({
      packageTracks: packageTracks
    });
  }
})