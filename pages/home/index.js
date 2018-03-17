// pages/home/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    currentYear: (new Date()).getFullYear(),
    grids: [
      {
        name: '价格查询',
        url: '/pricecalculate/index',
        img: 'member-2',
        isFraternity:false//是否同行才可以看
      },
      {
        name: '偏远查询',
        url: '/remote/index',
        img: 'member-3',
        isFraternity: false
      }, 
      {
        name: '运单确认',
        url: '/confirm/index',
        img: 'member-5',
        isFraternity: true
      },
      {
        name: '交货记录',
        url: '/deliveryrecord/index',
        img: 'member-4',
        isFraternity: false
      }, 
      {
        name: '模板下载',
        url: '/templates/index',
        img: 'member-1',
        isFraternity: false
      },
      {
        name: '微信支付',
        url: '/wechatpay/index',
        img: 'member-6',
        isFraternity: false
      }, 
      {
        name: '查看报价',
        url: '/pricelist/index',
        img: 'member-10',
        isFraternity: true
      }, 
      {
        name: '修改密码',
        url: '/changepassword/index',
        img: 'member-11',
        isFraternity: true
      },
      {
        name: '账号管理',
        url: '/subaccount/index',
        img: 'member-7',
        isFraternity: true
      },
      {
        name: '微信绑定',
        url: '/wechatbinding/index',
        img: 'member-8',
        isFraternity: false
      },
      // {
      //   name: '退出登录',
      //   url: '/logout/index',
      //   img: 'member-2'
      // }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.name
    });
    if(app.globalData.userType!=0){//不是同行
      var grids=this.data.grids;
      var temp=new Array();
      for(var i in grids){
        if (!grids[i].isFraternity){
          temp.push(grids[i]);
        }
      }
      this.setData({
        grids: temp
      });
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
  gotologon:function(){
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Account/LogOff',
      method: "GET",
      success: function (res) {
        wx.removeStorageSync("ASPSESSID");//移除保存的会话id
        wx.removeStorageSync("ASPAUTH");//移除保存的凭证
        wx.redirectTo({
          url: '/pages/logon/index?refer=logoff',
        })
      }
    }
    app.NetRequest(data);
  }
})