// pages/subaccount/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwdplaceholder: "登录本系统的密码，区分大小写",
    showErrorTips: false,
    errorTips: "",
    subaccount:null,
    userName:"",
    account:"",
    discount:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id!=null){
      this.setData({
        pwdplaceholder:"密码已隐藏，更改请直接输入",
        id:options.id
      });
      var main=this;
      wx.showLoading({
        title: '请稍后',
      });
      var data = {
        url: app.globalData.serverAddress + '/SubAccount/Detail?id='+options.id,
        method:"GET",
        success: function (res) {
          wx.hideLoading();
          main.setData({
            subaccount:res,
            userName:res.ObjectName,
            account:res.ObjectNo,
            discount:res.Discount
          });
        }
      }
      app.NetRequest(data);
    }
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
  doSave: function (res,action) {
    wx.showLoading({
      title: '请稍后',
    });
    var data = {
      url: app.globalData.serverAddress + '/SubAccount/'+action,
      data: res,
      success: function (res) {
        wx.hideLoading();
        if ((action=="Create" && res.Success) || (action=="Edit"&&res)) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          });
          wx.navigateBack({
            delta:1
          });
        }else{
          wx.showModal({
            title: '保存失败',
            content: res.ErrMsg,
            showCancel:false
          })
        }
      }
    }
    app.NetRequest(data);
  },
  save: function (e) {
    var userName = e.detail.value.userName.trim();
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var discount = e.detail.value.discount
    if (userName.length < 2) {
      this.setData({
        userNameWarning: true,
        errorTips: "名称不能为空并且长度不能小于2"
      });
      this.showErrorTips();
      return;
    }
    var checkMsg = this.checkAccount(account);
    if (checkMsg.length > 0) {
      this.setData({
        accountWarning: true,
        errorTips: checkMsg
      });
      this.showErrorTips();
      return;
    }
    checkMsg = this.checkPassword(password);
    if (checkMsg.length > 0) {
      this.setData({
        passwordWarning: true,
        errorTips: checkMsg
      });
      this.showErrorTips();
      return;
    }
    if (isNaN(Number(discount))) {
      this.setData({
        discountWarning: true,
        errorTips: "请输入正确的折扣"
      });
      this.showErrorTips();
      return;
    } else {
      if (Number(discount) < 0.01) {
        this.setData({
          discountWarning: true,
          errorTips: "折扣不能小于0.01"
        });
        this.showErrorTips();
        return;
      }
    }
    var data = {
      ObjectName: userName,
      ObjectNo: account,
      Password: password,
      Discount: discount
    }
    if(this.data.subaccount==null)
      this.doSave(data,"Create");
    else{
      if(password!="")
        this.data.subaccount.Password1=password;
      else
        this.data.subaccount.Password1 = "";
      this.data.subaccount.ObjectName=userName;
      this.data.subaccount.ObjectNo=account;
      this.data.subaccount.Discount=discount;
      this.doSave(this.data.subaccount, "Edit");
    }
  },
  showErrorTips: function () {
    var that = this;
    this.setData({
      showErrorTips: true
    });
    setTimeout(function () {
      that.setData({
        showErrorTips: false,
        userNameWarning: false,
        accountWarning: false,
        passwordWarning: false,
        discountWarning: false
      });
    }, 2000);
  },
  checkPassword: function (password) {
    if (this.data.subaccount!=null && password.length==0){
      return "";
    }
    if (password.trim().length == 0) {
      return "密码不能为空";
    }
    if (password.length < 8 || password.length > 16) {
      return "密码长度要求大于8小于16";
    }
    var reg1 = /[0-9]+/g;
    var reg2 = /[a-zA-Z]+/g;
    var exec1 = password.match(reg1);
    var exec2 = password.match(reg2);
    if (exec1 == null || exec2 == null) {
      return "密码要求必须数字和字母混合";
    } else {
      var length1 = 0;
      var length2 = 0;
      for (var i in exec1) {
        length1 += exec1[i].length;
      }
      for (var i in exec2) {
        length2 += exec2[i].length;
      }
      if (length1 + length2 != password.length) {
        return "密码只支持数字和字母";
      }
    }
    return "";
  },
  checkAccount: function (account) {
    if (account.trim().length == 0) {
      return "账号不能为空";
    }
    if (account.length < 2 || account.length > 8) {
      return "账号长度要求大于2小于8";
    }
    var reg1 = /[0-9]+/g;
    var reg2 = /[a-zA-Z]+/g;
    var reg3 = /_+/g;
    var exec1 = account.match(reg1);
    var exec2 = account.match(reg2);
    var exec3 = account.match(reg3);
    var length1 = 0;
    var length2 = 0;
    var length3 = 0;
    for (var i in exec1) {
      length1 += exec1[i].length;
    }
    for (var i in exec2) {
      length2 += exec2[i].length;
    }
    for (var i in exec3) {
      length3 += exec3[i].length;
    }
    if (length1 + length2 + length3 != account.length) {
      return "账号只支持数字、字母、下划线";
    }
    return "";
  }
})