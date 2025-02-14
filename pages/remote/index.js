// pages/remote/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryList: {},
    filtCountryList: {},
    modeofTransportList: {},
    modeofTransportNameList: {},
    modeofTransportIndex: 1,
    modeofTransportId: 1,
    modeOfTransportNames: [],
    isUsePostCode: true,
    isLoading: false,
    showErrorTips: false,
    errorTips: "",
    isRemote: false,
    hideResult: true,
    postalCode: "",
    city: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Common/GetModeOfTransportTypeList',
      method: "GET",
      success: function (res) {
        var names = new Array();
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].Name);
        }
        main.setData({
          modeofTransportList: res,
          modeofTransportNameList: names
        });
      }
    }
    var data1 = {
      url: app.globalData.serverAddress + '/Common/GetCountryList',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        main.setData({
          countryList: res
        });
        app.modeOfTransportList = res
      }
    }
    app.NetRequest(data);
    app.NetRequest(data1);
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
  modeofTransportChange: function (e) {
    this.setData({
      modeofTransportIndex: e.detail.value,
      modeofTransportId: this.data.modeofTransportList[e.detail.value].Id
    })
  },
  inputCountry: function (input) {
    var country = input.detail.value;
    this.setData({
      countryText: country
    });
    if (country == "") {
      this.setData({
        filtCountryList: {}
      });
    } else {
      var filtCountryList = new Array();
      var countryList = this.data.countryList;
      for (var i = 0; i < countryList.length; i++) {
        if (countryList[i].Name.toUpperCase().indexOf(country.toUpperCase()) != -1) {
          filtCountryList.push(countryList[i]);
        }
      }
      this.setData({
        filtCountryList: filtCountryList,
        hideCP: false
      });
    }
  },
  selectCountry: function (e) {
    let main=this;
    var countryText = e.currentTarget.dataset["text"];
    var countryId = e.currentTarget.dataset["value"];
    var queryIsUsePostcodeData ={
      url: app.globalData.serverAddress + '/Remote/CountryIsUsePostcode',
      data: {
        CountryId: countryId,
        ModeOfTransportTypeId:this.data.modeofTransportId
      },
      success:function(isUsePostcode){
        main.setData({
          countryText: countryText,
          countryId: countryId,
          isUsePostCode: isUsePostcode,
          postalCode: "",
          city: ""
        });
        hideCountryList(main);
      },
      fail:function(err){
        wx.showModal({
          title: '操作失败',
          content: '获取城市/邮编必填信息异常',
          showCancel:false
        });
      }
    }
    app.NetRequest(queryIsUsePostcodeData);
  },
  search: function (e) {
    this.initWarning();
    this.setData({
      hideResult: true
    });
    if (this.data.modeofTransportId == null) {
      this.setData({
        modeOfTransportWarning: true,
        showErrorTips: true,
        errorTips: "渠道不能为空"
      });
      this.showErrorTips();
      return;
    } else {
      this.setData({
        modeOfTransportWarning: false,
      });
    }
    if (this.data.countryId == null) {
      this.setData({
        countryWarning: true,
        showErrorTips: true,
        errorTips: "国家不能为空"
      });
      this.showErrorTips();
      return;
    } else {
      this.setData({
        countryWarning: false
      });
    };
    if (e.detail.value.city.trim() == "" && !this.data.isUsePostCode) {
      this.setData({
        cityWarning: true,
        postalcodeWarning: false,
        showErrorTips: true,
        errorTips: "城市不能为空"
      });
      this.showErrorTips();
      return;
    } else {
      this.setData({
        countryWarning: false
      });
    };
    if (e.detail.value.postalcode.trim() == "" && this.data.isUsePostCode) {
      this.setData({
        postalcodeWarning: true,
        cityWarning: false,
        showErrorTips: true,
        errorTips: "邮编不能为空"
      });
      this.showErrorTips();
      return;
    } else {
      this.setData({
        countryWarning: false
      });
    };
    this.setData({
      isLoading: true
    });
    var main = this;
    var data = {
      url: app.globalData.serverAddress + '/Remote/Query',
      data: {
        ModeOfTransportTypeId: main.data.modeofTransportId,
        CountryId: main.data.countryId,
        City: e.detail.value.city,
        Postalcode: e.detail.value.postalcode
      },
      success: function (res) {
        if (res.Status == 0) {
          main.setData({
            isRemote: res.IsRemote,
            isLoading: false,
            hideResult: false
          });
        }else{
          wx.showModal({
            title: '操作失败',
            content: res.Message,
            showCancel:false
          });
          main.setData({
            isLoading: false
          });
        }
      },
      fail: function (res) {

      }
    };
    app.NetRequest(data);
  },
  showErrorTips: function () {
    var that = this;
    this.setData({
      showErrorTips: true
    });
    setTimeout(function () {
      that.setData({
        showErrorTips: false
      });
    }, 2000);
  },
  initWarning: function () {
    this.setData({
      countryWarning: false,
      modeOfTransportWarning: false,
      cityWarning: false,
      postalcodeWarning: false
    });
  }
})

function hideCountryList(res) {
  res.setData({
    filtCountryList: {},
    hideCP: true
  });
}