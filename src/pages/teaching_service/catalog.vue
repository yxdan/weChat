<template>
  <div>
    <v-title>股侠课堂</v-title>
    <div class="catalog_cont">
      <div class="cata_header">
        <div class="banner">
          <div class="img_cont">
            <img :src="courseInfo.catalog_img" alt="">
            <div class="img_bg"></div>
          </div>
          <h3 :class="nospace">{{courseInfo.course_catalog}}</h3>
          <p :class="nospace">{{courseInfo.summary}}</p>
          <span class="jpkt" v-if='(courseInfo.courseType==1)?true:false'>精品课程</span>
          <span class="mfkt" v-if='(courseInfo.courseType==0)?true:false'>免费课程</span>
        </div>
        <div class="total_course">
          <ul>
            <li>
              <p>总课程</p>
              <b>{{courseInfo.courseCount}}<span>课</span></b>
            </li>
            <li>
              <p>价格</p>
              <b v-if="(courseInfo.course_price!=='')?true:false">￥{{courseInfo.course_price/100}}</b>
              <b v-if="(courseInfo.course_price==='')?true:false">免费</b>
            </li>
          </ul>
        </div>
      </div>
      <div class="course_bright_spot" v-if="(courseInfo.course_feature !=='')?true:false">
        <h3>课程亮点</h3>
        <p :class="fold ? 'fold' : 'unfold'" v-if="(courseInfo.course_feature !=='')?true:false">{{courseInfo.course_feature}}</p>
        <div class='show_cont' v-if="showCont">
          <div class="show" @click="handleFold" v-show="fold">展开</div>
          <div class="show" @click="handleFold" v-show="!fold">收起</div>
        </div>
      </div>
      <div class="course_directory">
        <h3>课程大纲</h3>
        <mt-loadmore :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul>
            <router-link v-for="(item,index) of courseCatalog" :key="item.id"
                         :to=" {path:'/teaching_service/detail',query: {labelId:item.id}}"
                         :class="[index ==0?'readCont':'']">
              <li>
                <h4 :class="nospace">{{item.course_name}}</h4>
                <span class="read" v-if="(courseInfo.course_price!=='')?true:false" v-show="read">试读</span>
              </li>
            </router-link>
          </ul>
        </mt-loadmore>
      </div>
      <div class="load_more" @click="loadTop" v-if="readMore">
        点击加载更多
      </div>
      <div class="no_more_data" v-if="noMoreData">
        暂无更多数据
      </div>
      <div class="bottom_btn_lock" v-if="(isAuthorised==1)?false:true">
        <ul>
          <li @click="buyBook">
            <span class="lock_icon"></span>
            <p>订阅解锁(整本<span>￥{{courseInfo.course_price/100}}</span>)</p>
          </li>
          <router-link tag="li" :to=" {path:'/test/share', query:{id:shareId, img:picUrl}} ">
            <span class="share_icon"></span>
            <p>
              分享免费解锁
            </p>
          </router-link>
        </ul>
      </div>
      <mt-popup
        v-show="showBookModal"
        v-model="popupVisible"
        position="bottom" popup-transition="popup-fade">
        <div class="confirm_order">
          <div class="header">
            <span class="icon_close"  @click="closeOrder">
            </span>
            <p>确认订单</p>
          </div>
          <div class="main_order">
            <div class="order_info">
              <h4>{{courseInfo.course_catalog}} </h4>
              <p>￥{{courseInfo.course_price/100}}</p>
            </div>
            <div class="choose">
              <p class="xuangou">选购</p>
              <ul>
                <li><p>整本<sup>限时抢</sup></p></li>
                <li @click="closeOrder"> <span>分享免费解锁</span></li>
              </ul>
            </div>
            <div class="discount">
              <p>优惠</p>
              <p>无可用 ></p>
            </div>
            <div class="pay_method">
              <p>支付方式</p>
              <p v-if="showPay"><img src="https://cdn1.qkzhi.com/qkz-static-production/MC-qkzhi-0.0.6/img/icon-wx@3x.png" alt=""></p>
              <p v-if="showNormal"><img src="https://cdn1.qkzhi.com/qkz-static-production/MC-qkzhi-0.0.6/img/icon-wx2@3x.png" alt=""></p>
            </div>
            <div class="order_bottom">
              <span class="radio" @click="fclick" :class="{now:now}"></span>
              <label>我已阅读并同意
                <span @click="goCaesar()">风险揭示书</span>
              </label><br>
              <span class="radio" @click="fclick2" :class="{now2:now2}"></span>
              <label>我已阅读并同意
                <span @click="goCaesar2()">产品服务协议</span>
              </label>
              <div class="pay_cont">
                <p >合计: <span>￥{{courseInfo.course_price/100}}</span></p>
                <p class="norbtn" v-if="noBuy">立即支付</p>
                <p class="ljzf" v-if='canBuy' @click="payment()">立即支付</p>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VTitle from '@/components/title/title'
import {Loadmore, Popup} from 'mint-ui'
import pingpp from 'pingpp-js'
import wx from 'weixin-js-sdk'

Vue.component(Popup.name, Popup)

Vue.component(Loadmore.name, Loadmore)

export default {
  name: 'catalog',
  data () {
    return {
      courseInfo: '',
      courseCatalog: '',
      readCont: 'readCont',
      pageNow: 0,
      readMore: false,
      read: true, // 试读
      allLoaded: true,
      noMoreData: false,
      brightPoint: false,
      nospace: 'nospace',
      fold: true,
      maxLength: 112,
      showCont: false,
      isAuthorised: '',
      shareId: '',
      popupVisible: false,
      showBookModal: false,
      isChecked: false,
      charge: '',
      showPay: false,
      showNormal: true,
      now: '',
      now2: '',
      noBuy: true,
      canBuy: false,
      picUrl: ''
    }
  },
  components: {
    VTitle
  },
  created () {
    this.init()
    this.getImg()
    this.shareShow()
  },
  methods: {
    init () {
      var id = this.$utils.getUrlParam('id')
      this.shareId = id
      this.pageNow++
      let args = {
        'catalogId': id,
        'pageSize': 10,
        'pageNow': this.pageNow
      }
      this.$api.post('api/stock/course/catalog', args, data => {
        this.isAuthorised = data.data.isAuthorised
        this.courseInfo = data.data.courseInfo
        var len = this.courseInfo.course_feature.length
        if (len > this.maxLength) {
          this.showCont = true
        } else {
          this.showCont = false
        }
        this.courseCatalog = data.data.courseCatalog
        if (this.pageNow !== 1) {
          this.read = false
        }
        if (this.courseCatalog.length > 1 && this.courseCatalog.length >= 10) {
          this.readMore = !this.readMore
        } else if (this.courseCatalog.length !== 0 && this.pageNow !== 1) {
          this.readMore = false
          this.noMoreData = !this.noMoreData
        }
      })
    },
    loadTop () {
      this.$refs.loadmore.onTopLoaded()
      setTimeout(() => {
        this.init()
      }, 1000)
    },
    handleFold () {
      this.fold = !this.fold
    },
    buyBook: function () {
      this.showBookModal = !this.showBookModal
      this.popupVisible = this.popupVisible !== true
    },
    closeOrder () {
      this.showBookModal = !this.showBookModal
      this.popupVisible = this.popupVisible !== true
      this.now = false
      this.now2 = false
      this.noBuy = true
      this.canBuy = false
      this.showPay = false
      this.showNormal = true
    },
    payment () {
      var id = this.$utils.getUrlParam('id')
      let args = {
        'catalogId': id
      }
      this.$api.post('api/stock/course/payment/receipt', args, data => {
        this.charge = data.data.payment
        pingpp.createPayment(this.charge, function (result, err) {
          if (result === 'success') {
            console.log('payment success')
          } else {
            console.log('fail', 123)
          }
        })
      })
    },
    goCaesar () {
      window.location.href = 'https://dzqk.qiantg.com/productCenter/productRisk'
    },
    goCaesar2 () {
      window.location.href = 'https://dzqk.qiantg.com/productCenter/productAgree'
    },
    fclick () {
      this.now = !this.now
      if (this.now === true && this.now2 === true) {
        this.showNormal = false
        this.showPay = true
        this.noBuy = false
        this.canBuy = true
      } else {
        this.showPay = false
        this.showNormal = true
        this.noBuy = true
        this.canBuy = false
      }
    },
    fclick2 () {
      this.now2 = !this.now2
      if (this.now === true && this.now2 === true) {
        this.showPay = true
        this.showNormal = false
        this.noBuy = false
        this.canBuy = true
      } else {
        this.showPay = false
        this.showNormal = true
        this.noBuy = true
        this.canBuy = false
      }
    },
    getImg () {
      var id = this.$utils.getUrlParam('id')
      let args = {
        'catalogId': id
      }
      this.$api.post('api/stock/course/share/pic', args, data => {
        if (data.code === 0) {
          console.log(data.data)
          this.picUrl = encodeURIComponent(data.data.picUrl)
          console.log(293, this.picUrl)
          // 调用分享信息接口
          this.shareInfo()
        }
      })
    },
    shareShow () { // 获取签名信息
      let url = location.href
      let args = {
        'url': url
      }
      this.$api.post('api/stock/course/wxconfiginfo', args, data => {
        if (data.code === 0) {
          let configInfo = data.data.configInfo
          let appId = configInfo.appId
          let timestamp = configInfo.timestamp
          let nonceStr = configInfo.nonceStr
          let signature = configInfo.signature
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: Number(timestamp), // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareQZone'
            ]// 必填，需要使用的JS接口列表
          })
        }
        wx.ready(function () { // 分享成功
          console.log('xxxx')
        })
      })
    },
    shareInfo () {
      var id = this.$utils.getUrlParam('id')
      var curshareUrl = 'https://newtonvue.qiantg.com/test/share?id=' + id + '&img=' + this.picUrl
      console.log(333, curshareUrl)
      let args = {
        'url': curshareUrl,
        'catalogId': id
      }
      this.$api.post('api/stock/course/share/seriesinfo', args, data => {
        if (data.code === 0) {
          let shareInfo = data.data.shareSeriesInfo
          let mlink = shareInfo.link
          console.log(mlink, 104)
          console.log(curshareUrl, 105)
          var obj = { // 朋友圈
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            // 该链接是重定向链接，因为需要获取用户code，但是该链接又无法直接写微信获取code的链接，
            // 所以需要点击后重新加载新的页面，来实现重定向，重新打开获取code的微信链接，实现获取用户信息的功能；
            imgUrl: shareInfo.imgUrl, // 分享图标
            fail: function (res) {
              console.log(JSON.stringify(res))
            },
            success: () => {
              console.log('分享成功')
            }
          }
          // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareAppMessage(obj)

          // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareTimeline(obj)

          // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareQQ(obj)

          // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareWeibo(obj)

          // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
          wx.onMenuShareQZone(obj)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./catalog.less";
</style>
