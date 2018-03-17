// pages/mybills/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    years:null,
    yearIndex:null,
    months:[1,2,3,4,5,6,7,8,9,10,11,12],
    monthIndex:null,
    isLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date=new Date();
    var years=new Array();
    for(var i=2016;i<=date.getFullYear();i++){
      years.push(i);
    }
    var monthIndex=this.data.months.indexOf(date.getMonth());
    this.setData({
      years:years,
      yearIndex:years.indexOf(date.getFullYear()),
      monthIndex:monthIndex
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
  yearChange:function(e){
    this.setData({
      yearIndex:e.detail.value
    });
  },
  monthChange:function(e){
      this.setData({
        monthIndex:e.detail.value
      });
  },
  search:function(e){
    this.setData({
      isLoading:true
    });
    var main = this;
    var data = {
      url: getApp().globalData.serverAddress + '/MyBill/GetData',
      data: {
        Year: main.data.years[e.detail.value.year],
        Month: main.data.months[e.detail.value.month]
      },
      success: function (res) {
        main.setData({
          isLoading: false
        });
        getApp().Bills = res;
        wx.navigateTo({
          url: 'result',
        })
      }
    }
    getApp().NetRequest(data);
  }
})