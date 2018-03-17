//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    //每次启动时清除本地缓存的sessionID
    // wx.removeStorageSync("ASPSESSID");
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        getApp().globalData.js_code = res.code;
        console.log("js_code:"+res.code)
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
      }
    })
  },
  globalData: {
    userInfo: null,
    // serverAddress: 'http://192.168.0.20:8033/api',
    // authServerAddress: 'http://192.168.0.20:8032',
    serverAddress: 'https://api.sl56.com/api',
    authServerAddress: 'https://www.sl56.com',
    js_code: null,
    encryptedData: null,
    iv: null,
    isCustomerLogin: false,
    header: null,
    userType: null
  },
  NetRequest: function ({ url, data, success, fail, complete, method = "POST" }) {

    var session_id = wx.getStorageSync('ASPSESSID');//本地取存储的sessionID
    var auth = wx.getStorageSync('ASPAUTH');
    var header;
    if (session_id != null && session_id != "") {
      header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'ASP.NET_SessionId=' + session_id + ';sl56Auth=' + auth + ';OpenId=' + this.globalData.openId }
    } else {
      header = { 'content-type': 'application/x-www-form-urlencoded' }
    }
    this.globalData.header = header;
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: res => {
        var data = res.data
        res['statusCode'] === 200 ? success(data) : fail(res)
      },
      fail: res => {
      },
      complete: complete
    })
  },
  dateProcess: function (p) {
    var date = new Date();
    date.setDate(date.getDate() + p);
    var dateStr = date.toLocaleDateString();
    var strs = dateStr.split('/');
    for (var i = 0; i < strs.length; i++) {
      if (i == 0) {
        dateStr = strs[i];
      } else {
        if (strs[i].length == 1) {
          dateStr += ("-0" + strs[i]);
        } else {
          dateStr += ("-" + strs[i]);
        }
      }
    }
    return dateStr;
  }
})