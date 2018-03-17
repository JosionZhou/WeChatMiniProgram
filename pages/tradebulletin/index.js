// pages/tradebulletin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    dateStart: null,
    dateEnd: null,
    keyword: "",
    isLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dateStart = getApp().dateProcess(-30);
    var dateEnd = getApp().dateProcess(1);
    this.setData({
      dateStart: dateStart,
      dateEnd: dateEnd
    });
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
  bindDateStartChange: function (e) {
    this.setData({
      dateStart: e.detail.value
    })
  },
  bindDateEndChange: function (e) {
    this.setData({
      dateEnd: e.detail.value
    });
  },
  search: function () {
    this.setData({
      isLoading: true
    });
    var main = this;
    var data = {
      url: getApp().globalData.serverAddress + '/TradeBulletin/GetData',
      data: {
        startDate: this.data.dateStart,
        endDate: this.data.dateEnd,
        keyword: this.data.keyword
      },
      success: function (res) {
        main.setData({
          isLoading: false
        });
        getApp().TradeBulletinList = res;
        wx.navigateTo({
          url: 'result',
        })
      }
    }
    getApp().NetRequest(data);
  },
  bindInput: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  }
})