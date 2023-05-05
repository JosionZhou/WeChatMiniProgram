// pages/pricecalculate/pricecalculate.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryList:{},
    ruleList:{},
    selectedRuleIds:[],
    filtCountryList:{},
    modeofTransportList:{},
    modeofTransportNameList: {},
    modeofTransportIndex:0,
    modeofTransportId:0,
    showCountryLIst:false,
    hideCP:true,
    hideDetail:true,
    countryText:"",
    countryId:null,
    ctrlText:'更多信息',
    countryWarning:false,
    weightWarning:false,
    productTypes: [
      { name: 'DOC', value: '0' },
      { name: 'WPX', value: '1', checked: true }
    ],
    volumes: [],
    volumeNames:[],
    volumeIndex: 0,
    volumeId:null,
    showErrorTips:false,
    errorTips:"",
    isLoading:false,
    piece:1,
    sizes:[]
  },

  /**o
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    var main=this;
    var data={
      url: app.globalData.serverAddress + '/Common/GetModeOfTransportList',
      method:"GET",
      success: function (res) {
        var names = new Array();
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].Name);
        }
        main.setData({
          modeofTransportList: res,
          modeofTransportNameList: names
        });
        app.countryList=res;
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
    var data2 = {
      url: app.globalData.serverAddress + '/Common/GetVolumetricDivisorList',
      method: "GET",
      success: function (res) {
        var names = new Array();
        for (var i = 0; i < res.length; i++) {
          names.push(res[i].Name);
        }
        main.setData({
          volumes: res,
          volumeNames:names,
          volumeId:res[0].Id
        });
        app.volumes=res
      }
    }
    var data3 = {
      url: app.globalData.serverAddress + '/Common/GetRuleList',
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        for(var i=0;i<res.length;i++){
          res.Checked=false;
        }
        main.setData({
          ruleList: res
        });
      }
    }
    app.NetRequest(data);
    app.NetRequest(data1);
    app.NetRequest(data2);
    app.NetRequest(data3);
    // wx.request({
    //   url: app.globalData.serverAddress + '/PriceCalculate/ModeOfTransportInfoList',
    //   success:function(res){
    //     var a=new Array();
    //     for(var i=0;i<res.data.length;i++){
    //       a.push(res.data[i].ObjectName);
    //     }
    //     main.setData({
    //       modeofTransportList: res.data,
    //       modeofTransportNameList:a
    //     });
    //   }
    // })
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
  volumeChange: function (e) {
    this.setData({
      volumeIndex: e.detail.value,
      volumeId:this.data.volumes[e.detail.value].Id
    })
  },
  typeChange: function (e) {
    var productTypes = this.data.productTypes;
    for (var i = 0, len = productTypes.length; i < len; ++i) {
      productTypes[i].checked = productTypes[i].value == e.detail.value;
    }

    this.setData({
      productTypes: productTypes
    });
  },
  modeofTransportChange: function (e) {
    this.setData({
      modeofTransportIndex: e.detail.value,
      modeofTransportId: this.data.modeofTransportList[e.detail.value].Id
    })
  },
  search:function(e){
    if (e.detail.value.country.trim()=="")
    {
      this.showErrorTips();
      this.setData({
        countryWarning:true,
        errorTips:"国家名不能为空"
      });
      return;
    } else {
      this.setData({
        countryWarning: false
      });
    };
    if (e.detail.value.weight.trim() == "") {
      this.showErrorTips();
      this.setData({
        weightWarning: true,
        errorTips: "重量不能为空"
      });
      return;
    } else {
      this.setData({
        weightWarning: false
      });
    }
    //如果填写了尺寸规格，则必须跟件数匹配
    if(this.data.sizes.length>0 && this.data.piece!=this.data.sizes.length){
      wx.showModal({
        showCancel:false,
        title:"提示",
        content:"规格与件数不一致，请确认每件规格！"
      });
      return;
    }
    this.setData({
      isLoading:true
    });
    var main=this;
    var data={
      url: app.globalData.serverAddress + '/Calculation/Calculate',
      data: {
        ProductType: e.detail.value.productcode,
        CountryId: main.data.countryId,
        City: e.detail.value.city,
        DeclaredValue: e.detail.value.declaredvalue,
        ModeOfTransportId: main.data.modeofTransportId,
        ActualWeight: e.detail.value.weight,
        VolumeWeight: e.detail.value.volumeweight,
        Volumetric: main.data.volumeId,
        PostalCode: e.detail.value.postalcode,
        SelectRuleIds:main.data.selectedRuleIds,
        Sizes:main.data.sizes
      },
      success: function (res) {
        main.setData({
          isLoading:false
        });
        wx.hideLoading();
        if(res==null || res.length==0){
          wx.showModal({
            title: '提示',
            content: '当前条件查询无报价',
            showCancel:false
          });
          return;
        }
        app.priceResult=res;
        wx.navigateTo({
          url: 'priceresult'
        });
      },
      fail: function (res) {
        wx.hideLoading();
        wx.redirectTo({
          url: '/pages/pricecalculate/error',
        });
      }
    };
    app.NetRequest(data);
  },
  inputCountry:function(input){
    var country = input.detail.value;
    this.setData({
      countryText:country
    });
    if(country==""){
      this.setData({
        filtCountryList:{}
      });
    }else{
      var filtCountryList=new Array();
      var countryList = this.data.countryList;
      for(var i=0;i<countryList.length;i++){
        if (countryList[i].Name.toUpperCase().indexOf(country.toUpperCase())!=-1){
          filtCountryList.push(countryList[i]);
        }
      }
      this.setData({
        filtCountryList: filtCountryList,
        hideCP: false
      });
    }
  },
  selectCountry:function(e){
    var countryText = e.currentTarget.dataset["text"];
    var countryId = e.currentTarget.dataset["value"];
    this.setData({
      countryText:countryText,
      countryId:countryId
    });
    hideCountryList(this);
  },
  showDetail:function(e){
    this.setData({
      hideDetail: !this.data.hideDetail
    });
    if (this.data.hideDetail)
    {
      this.setData({
        ctrlText:'更多信息'
      });
    }else{
      this.setData({
        ctrlText: '简略信息'
      });
    }
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
  ruleChange:function(e){
    var ruleList = this.data.ruleList, values = e.detail.value;
    for (var i = 0, lenI = ruleList.length; i < lenI; ++i) {
      ruleList[i].Checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (ruleList[i].Id == values[j]) {
          ruleList[i].Checked = true;
          break;
        }
      }
    }

    this.setData({
      ruleList: ruleList,
      selectedRuleIds:values
    });
  },
  
  showSizes: function () {
    let that = this;
    if (that.data.piece > 0) {
      wx.navigateTo({
        url: './sizes/index',
        events: {
          submitSizes: function (data) {
            that.data.sizes = data.sizes;
            console.log(data.sizes);
          }
        },
        success: function (res) {
          res.eventChannel.emit("editSizes", {
            sizes: that.data.sizes,
            pieces: that.data.piece
          });
        }
      });
    }else{
      wx.showModal({
        showCancel:false,
        title:"提示",
        content:"件数必须大于0！",
      });
    }
  }
})
function hideCountryList(res){
  res.setData({
    filtCountryList:{},
    hideCP:true
  });
}