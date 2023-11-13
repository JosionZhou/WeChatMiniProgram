// pages/forgotpassword/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errMsg: "",
    userName: "",
    code:"",
    code1:"",
    isSendCode:false,
    showResetPassword:false,
    newPassword1:"",
    newPassword2:"",
    customerId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },
  setErrMsg(errMsg) {
    let main = this;
    main.setData({
      errMsg: errMsg
    });
    setTimeout(() => {
      main.setData({
        errMsg: ""
      });
    }, 3000);
  },
  sendCode() {
    let main = this;
    if(main.data.userName==null || main.data.userName.trim().length==0){
      main.setErrMsg("请输入手机或邮箱！");
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask:true
    });
    let data = {
      url: app.globalData.serverAddress + "/Account/SendCode",
      data: {
        Mobile: main.data.userName
      },
      success: function (res) {
        wx.hideLoading();
        if (res.Success) {
          main.setData({
            code1:res.Code,
            isSendCode:true,
            customerId:res.CustomerId
          });
          wx.showToast({
            title: '验证码已发送',
          });
        } else {
          main.setErrMsg(res.ErrMsg);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '验证码发送失败，请重试',
          icon:"none"
        });
      },
    };
    app.NetRequest(data);
  },
  next(){
    let main=this;
    if(main.data.userName==null || main.data.userName.trim().length==0){
      main.setErrMsg("请输入手机或邮箱！");
      return;
    }
    if(main.data.code==null || main.data.code.trim().length==0){
      main.setErrMsg("请输入验证码！");
      return;
    }
    if(main.data.code.toString()!=main.data.code1){
      main.setErrMsg("验证码不正确");
      return;
    }
    main.setData({
      showResetPassword:true
    });
  },
  submit(){
    let main = this;
    if(main.data.newPassword1.length==0 || main.data.newPassword2.length==0){
      this.setErrMsg("请输入两次密码");
      return;
    }
    if(main.data.newPassword1!=main.data.newPassword2){
      this.setErrMsg("两次输入的密码不一致");
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask:true
    });
    let data = {
      url: app.globalData.serverAddress + "/Account/ForgotPassword2",
      data: {
        Mobile: main.data.userName,
        NewPassword1:main.data.newPassword1,
        NewPassword2:main.data.newPassword2,
        CustomerId:main.data.customerId
      },
      success: function (res) {
        wx.hideLoading();
        if (res.Success) {
          wx.showModal({
            title: '提示',
            content: '密码重置成功，即将跳转登录页面',
            showCancel:false,
            complete: (res) => {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          });
        } else {
          main.setErrMsg(res.ErrMsg);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '操作失败，请重试',
          icon:"none"
        });
      },
    };
    app.NetRequest(data);
  }
})