const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    encryptedUserInfo: {},
    userNameWarning: false,
    passwordWarning: false,
    isBindWeChat: true,
    userName: "",
    password: "",
    refer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.refer = options.refer;
    if (options.type != null && options.type == 1) {
      return;
    }
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    this.wxOauth();
  },
  //当前客户端与服务端的身份凭证是否有效
  getIsAuthenticated: function (authCallback, unAuthCallback) {
    var data = {
      url: app.globalData.serverAddress + "/Account/IsAuthenticated",
      method: "GET",
      success: authCallback,
      fail: unAuthCallback,
    };
    app.NetRequest(data);
  },
  getAuthInfo: function () {
    var data = {
      url: app.globalData.authServerAddress + "/WeChatAuth/GetAuth4Info",
      data: {
        unionId: app.globalData.unionId,
        openId: app.globalData.openId,
        userName: this.data.userName
      },
      success: function (res) {
        wx.setStorageSync("ASPSESSID", res.session_id);//存储sessionId
        wx.setStorageSync("ASPAUTH", res.auth);//存储服务器验证信息
        wx.setStorageSync("UserType", res.usertype);//0:同行  1:直客
        wx.setStorageSync("Name", res.name);
        app.globalData.userType = res.usertype;
        app.globalData.name = res.name;
        wx.redirectTo({
          url: '/pages/home/index',
        })
      }
    };
    app.NetRequest(data);
  },
  wxOauth: function () {
    var main = this;
    //凭证未失效
    var authCallback = function () {
      wx.hideLoading();
      app.globalData.userType = wx.getStorageSync("UserType");
      app.globalData.openId = wx.getStorageSync("OpenId");
      app.globalData.name = wx.getStorageSync("Name");
      wx.redirectTo({
        url: '/pages/home/index',
      });
    }
    //凭证失效
    var unAuthCallback = function () {
      wx.hideLoading();
      if (main.data.refer == "logoff") {
        return;//从更换账号跳转过来的不需要再次请求验证
      }
      wx.removeStorageSync("ASPSESSID");//移除保存的会话id
      wx.removeStorageSync("ASPAUTH");//移除保存的凭证
      main.doAuth();
    }
    this.getIsAuthenticated(authCallback, unAuthCallback);
  },
  doAuth: function () {
    var main=this;
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        app.globalData.encryptedData = res.encryptedData;
        app.globalData.iv = res.iv;
        var url = app.globalData.authServerAddress + "/WeChatAuth/OAuth4";
        // var url = app.globalData.authServerAddress + "/WeChatAuth/OAuth4_1";
        // var url = app.globalData.authServerAddress + "/WeChatAuth/OAuth4_2";
        var success = function (res) {
          wx.hideLoading();
          app.globalData.openId = res.openid;
          app.globalData.unionId = res.unionid;
          wx.setStorageSync("OpenId", res.openid);
          if (res.islogin) {
            main.getAuthInfo();
          }
        };
        var fail = function (res) {
          wx.hideLoading();
          var index1 = res.data.indexOf("<title>");
          var index2 = res.data.indexOf("</title>");
          var errMsg = "";
          if (index1 != -1) {
            errMsg = res.data.substr(index1 + 7, index2 - (index1 + 7));
          }
          if (errMsg.length == 0) {
            errMsg = res.data;
          }
          wx.showModal({
            title: '获取验证失败',
            content: errMsg,
            showCancel: false
          });
        }
        var data = {
          url: url,
          success: success,
          fail: fail,
          data: {
            code: app.globalData.js_code,
            iv: app.globalData.iv,
            encryptedData: app.globalData.encryptedData
          }
        };
        app.NetRequest(data);
      }
    })
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
  userInfoHandler: function (e) {
    if (e.detail.errMsg.indexOf("fail") != -1) {//微信用户未授权(获取用户公开信息)给当前小程序
      wx.showModal({
        title: '提示',
        content: '请先同意授权后再登录',
        showCancel: false
      });
    } else {
      if (getApp().globalData.unionId != null && getApp().globalData.unionId != "") {
        this.logon();
      } else {
        this.doAuth();
      }
    }
  },
  logon: function () {
    this.data.refer = null;
    wx.removeStorageSync("ASPSESSID");//移除保存的会话id
    wx.removeStorageSync("ASPAUTH");//移除保存的凭证
    var userName = this.data.userName.trim();
    var password = this.data.password;
    var isBind = this.data.isBindWeChat;
    if (userName == "") {
      this.setData({
        userNameWarning: true
      });
      return;
    }
    else {
      this.setData({
        userNameWarning: false
      });
    }
    if (password == "") {
      this.setData({
        passwordWarning: true
      });
      return;
    }
    else {
      this.setData({
        passwordWarning: false
      });
    }
    wx.showLoading({
      title: '登录中',
      mask: true
    });
    var main = this;
    wx.request({
      url: app.globalData.serverAddress + '/account/logon',
      method: 'POST',
      data: {
        Username: userName,
        Password: password,
        IsBind: isBind,
        UnionId: app.globalData.unionId,
        OpenId: app.globalData.openId
      },
      success: function (res) {
        //登录验证返回true
        if (res.data.success) {
          main.getAuthInfo();
        }
        else {
          wx.hideLoading();
          wx.showModal({
            title: '登录失败',
            showCancel: false,
            content: res.data.errMsg,
          })
        }
      },
      fail: function (msg) {
      }
    })
  },
  bindWeChatChange: function (e) {
    this.setData({
      isBindWeChat: !!e.detail.value.length
    });
  },
  inputUserName: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },
  inputPassword: function (e) {
    this.setData({
      password: e.detail.value
    });
  }
})
