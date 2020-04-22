<template>
  <div>
    <div id="r-result">请输入:<input id="suggestId" type="text" size="20" value="百度" style="width:300px;margin-bottom: 5px"></div>
    <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;z-index: 999999999999" />
    <div id="allmap" :style="{height: mapheight + 'px' }" />
  </div>
</template>
<script>
export default {
  name: 'Maps',
  props: {
    mapheight: {
      type: String,
      default: '200'// date or datetime
    },
    longitude: {
      type: [String, Number]
    },
    latitude: {
      type: [String, Number]
    }
  },
  data() {
    return {
      lng: '',
      lat: ''
    }
  },
  created() {

  },
  mounted() {
    this.showMap()
  },
  methods: {
    changeGetvalue(val) {
      // this.$emit('getTimeValue', val)
    },
    showMap() {
      // 百度地图API功能
      var map = new BMap.Map('allmap')
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      this.getSerach(map)
    },
    getSerach(map) {
      var _this = this
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id)
      }
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function(r) {
        if (r) {
          var mk = new BMap.Marker(r.point)
          map.addOverlay(mk)
          map.panTo(r.point)
          // alert('您的位置：'+r.point.lng+','+r.point.lat);
        } else {
          alert('failed' + this.getStatus())
        }
      }, { enableHighAccuracy: true })
      var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
        { 'input': 'suggestId',
          'location': map
        })

      ac.addEventListener('onhighlight', function(e) { // 鼠标放在下拉列表上的事件
        var str = ''
        var _value = e.fromitem.value
        var value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        G('searchResultPanel').innerHTML = str
      })

      var myValue
      ac.addEventListener('onconfirm', function(e) { // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue

        setPlace()
      })

      function setPlace() {
        map.clearOverlays() // 清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          map.centerAndZoom(pp, 18)
          map.addOverlay(new BMap.Marker(pp)) // 添加标注
        }
        var local = new BMap.LocalSearch(map, { // 智能搜索
          onSearchComplete: myFun
        })
        local.search(myValue)
        function showInfo(e) {
          _this.getAddives(e.point.lng, e.point.lat)
        }
        map.addEventListener('click', showInfo)
      }
    },
    getAddives(lng, lat) {
      var _this = this
      var point = new BMap.Point(lng, lat)// 用所定位的经纬度查找所在地省市街道等信息
      var gc = new BMap.Geocoder()
      gc.getLocation(point, function(rs) {
        var mapvalue = {
          lng: lng,
          lat: lat,
          address: rs.address
        }
        _this.$emit('getMapkey', mapvalue)
      })
    },
    islogmap(longitude, latitude) {
      console.log(longitude, latitude)
      var map = new BMap.Map('allmap')
      map.centerAndZoom(new BMap.Point(longitude, latitude), 11)
      map.enableScrollWheelZoom(true)
      // 用经纬度设置地图中心点
      function theLocation() {
        if (longitude && latitude) {
          map.clearOverlays()
          var new_point = new BMap.Point(longitude, latitude)
          var marker = new BMap.Marker(new_point) // 创建标注
          map.addOverlay(marker) // 将标注添加到地图中
          map.panTo(new_point)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  #allmap{
    width: 100%;
  }
  #r-result{width:100%;}
</style>
