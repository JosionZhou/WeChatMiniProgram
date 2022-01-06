
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  changepassword: function (e) {
    if (e.detail.value.oldPassword.trim() == "") {
      this.setData({
        opwdWarning: true,
        oldPassword: e.detail.value.oldPassword.trim()
      });
      return;
    }
    else {
      this.setData({
        opwdWarning: false
      });
    }
    if (e.detail.value.newPassword.trim() == "") {
      this.setData({
        npwdWarning: true,
        newPassword: e.detail.value.newPassword.trim()
      });
      return;
    }
    else {
      if (!this.checkPassword(e.detail.value.newPassword)) {
        this.setData({
          npwdWarning: true,
          errorTips: "交货密码不符合要求"
        });
        this.showErrorTips();
        return;
      } else {
        this.setData({
          npwdWarning: false
        });
      }
    }
    if (e.detail.value.newPassword1.trim() == "") {
      this.setData({
        npwdWarning1: true,
        newPassword1: e.detail.value.newPassword1.trim()
      });
      return;
    }
    else {
      this.setData({
        npwdWarning1: false
      });
    }
    if (e.detail.value.newPassword != e.detail.value.newPassword1) {
      this.setData({
        npwdWarning: true,
        npwdWarning1: true,
        errorTips: "确认交货密码和新交货密码不一致"
      });
      this.showErrorTips();
      return;
    } else {
      this.setData({
        npwdWarning: false,
        npwdWarning1: false
      });
    }
    this.setData({
      isLoading:true
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Account/ChangeRgdPassword',
      data: {
        password: e.detail.value.oldPassword,
        newPassword1: e.detail.value.newPassword,
        newPassword2: e.detail.value.newPassword1
      },
      method: "POST",
      success: function (res) {
        main.setData({
          isLoading: false
        });
        if (res.Success) {
          wx.showModal({
            title: '操作成功',
            content: '交货密码已成功修改',
            confirmText:'确定',
            showCancel:false,
            success:function(){
              wx.navigateBack({
                delta: 0,
              })
            }
          })
          main.clear();
        }else{
          wx.showToast({
            title: res.ErrMsg,
            icon:'none'
          })
        }
      },
      fail: function (res) {
        main.setData({
          isLoading: false
        });
        wx.showModal({
          title: '操作失败',
          content: '交货密码修改失败，请刷新页面后重试，如多次失败，请联系业务',
          showCancel: false
        })
      }
    }
    app.NetRequest(data);

  },
  showErrorTips: function () {
    var main = this;
    this.setData({
      showErrorTips: true
    });
    setTimeout(function () {
      main.setData({
        showErrorTips: false
      });
    }, 2000);
  },
  clear: function () {
    this.setData({
      oldPassword: "",
      newPassword: "",
      newPassword1: ""
    });
  },
  checkPassword:function(password){
    if(password.length != 6){
      return false;
    }
    var reg1=/[0-9]+/g;
    var exec1=password.match(reg1);
    if(exec1==null){
      return false;
    }
    return true;
  }
})