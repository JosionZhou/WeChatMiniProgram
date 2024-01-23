// pages/select-wechat-record-file/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rgdProblemId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.data.rgdProblemId=options.rgdProblemId;
    that.selectFile();
  },

  selectFile(){
    let that = this;
    console.log("Start Select File");
    wx.chooseMessageFile({
      count: 1,
      success: function (res) {
        let attachment = new Object();
        console.log(res);
        attachment.Path = res.tempFiles[0].path;
        attachment.Size = res.tempFiles[0].size;
        attachment.Type = res.tempFiles[0].type;
        attachment.ObjectName = attachment.Path.split("//")[1].replace("/", "");
        wx.showLoading({
          title: '文件上传中...',
        });
        wx.uploadFile({
          filePath: attachment.Path,
          name: attachment.ObjectName,
          url: app.globalData.serverAddress + "/Problem/UploadWeAppFile?rgdProblemId="+that.data.rgdProblemId+"&fileName="+attachment.ObjectName,
          success: res => {
            wx.hideLoading();
            if (res.statusCode != 200) {
              wx.showModal({
                title: "上传失败，是否重试？",
                content: res.data,
                complete: (res) => {
                  if (res.cancel) {
                    wx.exitMiniProgram();
                  }
                  if (res.confirm) {
                    that.selectFile()
                  }
                }
              });
            } else {
              //返回上传成功结果之后，直接关闭小程序（正常情况下会当前小程序退出后会回退到公众号处理问题件页面，后续操作在公众号页面进行）
              wx.showModal({
                title: '提示',
                content: '文件上传成功',
                showCancel:false,
                complete: (res) => {
                  if (res.confirm) {
                    wx.exitMiniProgram();
                  }
                }
              })
            }
          },
          fail: function (res) {
            console.log("fail:",res);
            wx.hideLoading();
            wx.showModal({
              showCancel: false,
              title: "附件上传失败",
              content: res.data
            });
          }
        });
      },
      fail:function(err){
        console.log("ChooseFileFail:",err);
        //取消选择文件，则直接退出小程序，返回公众号页面
        if(err.errMsg=="chooseMessageFile:fail cancel")
        {
          console.log("用户取消文件选择");
          wx.showModal({
            title: '操作取消',
            content: '您已取消选择文件',
            showCancel:false,
            complete: (res) => {
              if (res.confirm) {
                wx.exitMiniProgram();
              }
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})