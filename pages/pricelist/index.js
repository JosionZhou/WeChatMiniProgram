var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    pageIndex: 1,
    isAllowDownloadPrice: false,
    priceFilePath:"",
    isShowLoading:false,
    isShowNoDataMark:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var filePath = wx.getStorageSync("priceFilePath");
    if(filePath!=null && filePath!=""){
      this.setData({
        priceFilePath:filePath
      });
    }
    this.getList();
  },
  getList:function(){
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Price/GetList?pageIndex=' + this.data.pageIndex,
      method: "GET",
      success: function (res) {
        var result=main.data.result;
        for(var i in res.Items){
          result.push(res.Items[i])
        }
        main.setData({
          result: result,
          isAllowDownloadPrice: res.AllowDownloadPrice,
          isShowLoading:false
        });
        if(res.Items==0){
          main.setData({
            isShowNoDataMark:true
          });
        }
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
      pageIndex:this.data.pageIndex+1,
      isShowLoading:true
    });
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  download: function () {
    var main=this;
    wx.downloadFile({
      url: app.globalData.serverAddress + '/Price/Download',
      header: app.globalData.header,
      success: function (res) {
        if (res.statusCode == 200) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success:function(res){
              wx.setStorageSync("priceFilePath",res.savedFilePath);
              main.setData({
                priceFilePath:res.savedFilePath
              });
              wx.showModal({
                title: '下载完成',
                content: '文件已成功下载，是否打开',
                cancelText:'否',
                confirmText:'是',
                success:function(res){
                  if(res.confirm)
                    main.open();
                }
              })
            },
            fail:function(res){
              wx.showToast({
                title: '保存临时文件失败',
                icon:'none'
              })
            }
          });
        }else{
          wx.showToast({
            title: '下载失败，错误代码：'+res.statusCode,
            icon:'none'
          })
        }
      }
    })
  },
  doPrice: function () {
    var main=this;
    wx.showActionSheet({
      itemList: ['下载最新', '打开已下载'],
      success: function (res) {
        if (!res.cancel) {
          switch(res.tapIndex){
            case 0:
              main.download();
            break;
            case 1:
              main.open();
            break;
          }
        }
      }
    });
  },
  open: function () {
    var main=this;
    wx.openDocument({
      filePath: this.data.priceFilePath,
      fail:function(res){
        wx.showToast({
          title: '文件已失效或未下载，请重新下载',
          icon:'none'
        });
        wx.setStorageSync("priceFilePath", "");
      }
    })
  }
})