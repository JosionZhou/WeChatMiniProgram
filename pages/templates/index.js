// pages/templates/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    downloadTemplates: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var main = this;
    wx.showLoading({
      title: '请稍后',
      mask: true
    });
    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
      }
    });
    var downloadTemplates = wx.getStorageSync("downloadTemplates");
    if (downloadTemplates != null && downloadTemplates != "") {
      this.setData({
        downloadTemplates: downloadTemplates
      });
    }
    console.log(downloadTemplates);
    var data = {
      url: app.globalData.serverAddress + '/Template/GetList?pageIndex=',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        var result = res;
        for (var i = 0; i < result.length; i++) {
          if (result[i].Name.toLowerCase().indexOf(".pdf") != -1) {
            result[i].type = "pdf";
          } else {
            result[i].type = "excel"
          }
          result[i].isDownloaded = false
          if (main.data.downloadTemplates != null) {
            var items = main.data.downloadTemplates;
            for (var index in items) {
              if (items[index].Id == result[i].Id && items[index].Path != "") {
                result[i].isDownloaded = true;
                result[i].path = items[index].Path;
              }
            }
          }
        }
        main.setData({
          result: result
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
  download: function (e) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var main = this;
    var id = e.currentTarget.dataset.id;
    wx.downloadFile({
      url: app.globalData.serverAddress + '/Template/Download?id=' + id,
      header: app.globalData.header,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          wx.showToast({
            title: '下载完成',
            icon: 'none'
          });
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function (res) {
              var result = main.data.result;
              var downloadTemplates = main.data.downloadTemplates;
              if (downloadTemplates == null) {
                downloadTemplates = new Array();
              }
              for (var i = 0; i < result.length; i++) {
                if (result[i].Id == id) {
                  result[i].isDownloaded = true;
                  result[i].path = res.savedFilePath;//返回文件保存路径
                  var downloadItem = null;
                  for (var index in downloadTemplates) {
                    if (downloadTemplates[index].Id == id) {
                      downloadItem = downloadTemplates[index];
                      downloadItem.Path = res.savedFilePath;
                    }
                  }
                  if (downloadItem == null) {
                    downloadItem = {
                      Id: id,
                      Path: res.savedFilePath
                    }
                    downloadTemplates.push(downloadItem);
                  }
                  wx.setStorageSync('downloadTemplates', downloadTemplates);
                  // wx.setStorageSync('template_file_id_' + id,res.tempFilePath);
                }
              }
              main.setData({
                result: result
              });
            },
            fail: function (res) {
              wx.showToast({
                title: '保存文件失败',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },
  open: function (e) {
    var path = e.currentTarget.dataset.path;
    var id = e.currentTarget.dataset.id;
    var main=this;
    wx.openDocument({
      filePath: path,
      fail: function (res) {
        wx.showToast({
          title: '该文件已失效，请重新下载',
          icon:'none'
        });
        var result = main.data.result;
        for (var index in result) {
          if (result[index].Id == id) {
            result[index].isDownloaded = false;
            result[index].path = "";
          }
        }
        var downloadTemplates = main.data.downloadTemplates;
        for(var index in downloadTemplates){
          if(downloadTemplates[index].Id==id){
            downloadTemplates[index].Path = "";//如果文件已经不存在则清空保存对象的Path
          }
        }
        wx.setStorageSync('downloadTemplates', downloadTemplates);
        main.setData({
          result: result
        });
      }
    })
  }
})