<template>
  <div>
    <v-title>详情</v-title>
    <div class="detail_cont">
      <div class="header">
        <h4 :class="nospace">{{courseDetail.title}}</h4>
        <p>{{courseDetail.createTime}}</p>
      </div>
      <div class="main_cont">
        <!--免费内容-->
        <div class="main_desc" :class="nospace"  v-if="(isAuthorised==0)?true:false" v-html="courseDetail.freeContent"></div>
        <!--1 是已购买 0未购买-->
        <div class="lock" v-if="(isAuthorised==1)?true:false" v-html="courseDetail.paidContent"></div>
        <router-link tag="div" class="unlock" v-if="(isAuthorised == 0)?true:false" :to=" {path:'/test/share', query:{id:catalogId,img:picUrl}} ">
          <span class="unlock_icon"></span>
          <p>解锁可见</p>
        </router-link>
      </div>
      <div class="other_course" v-if="(otherCourse !== '' )?true:false">
        <h3>相关课程</h3>
        <ul>
          <router-link v-for="item of otherCourse" :key="item.id"  :to=" {path:'/teaching_service1/detail',query:{labelId:item.id}}">
            <li>
              <h4 :class="nospace">{{item.course_name}}</h4>
              <p :class="nospace">
                {{item.content}}
                <!--.replace(/<\/?[^>]*>/g, "")-->
              </p>
            </li>
          </router-link>
        </ul>
      </div>
      <div class="bottom_btn_lock" v-if="(isAuthorised==1)?false:true">
        <ul>
          <li @click="buyBook">
            <span class="lock_icon"></span>
            <p>订阅解锁(整本<span>￥{{coursePrice/100}}</span>)</p>
          </li>
          <!--<li @click="share()">-->
          <!--<span class="share_icon"></span>-->
          <!--<p>-->
          <!--分享解锁该篇-->
          <!--</p>-->
          <!--</li>-->
          <router-link tag="li" :to=" {path:'/test/share', query:{id:catalogId, img:picUrl}} ">
            <span class="share_icon"></span>
            <p>
              分享免费解锁
            </p>
          </router-link>
        </ul>
      </div>
      <!--购买modal-->
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
              <h4>{{courseDetail.courseSeriesName}} </h4>
              <p>￥{{coursePrice/100}}</p>
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
                <p >合计: <span>￥{{coursePrice/100}}</span></p>
                <p class="norbtn" v-if="noBuy">立即支付</p>
                <p class="ljzf" v-if='canBuy' @click="payment()">立即支付</p>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>
      <div class="guide" v-show="guide">
        <img src="https://cdn1.qkzhi.com/qkz-static-production/MC-qkzhi-0.0.6/img/分享解锁蒙层@3x.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VTitle from '@/components/title/title'
import wx from 'weixin-js-sdk'
import { Popup } from 'mint-ui'
import pingpp from 'pingpp-js'

Vue.component(Popup.name, Popup)

export default {
  name: 'detail',
  components: {
    VTitle
  },
  data () {
    return {
      isAuthorised: '',
      courseDetail: '',
      otherCourse: '',
      popupVisible: false,
      showBookModal: false,
      isChecked: false,
      activeClass: 'activeClass',
      coursePrice: '',
      nospace: 'nospace',
      guide: false,
      catalogId: '',
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
  created () {
    this.init()
    this.shareShow()
  },
  watch: {
    '$route' (newVal, oldVal) {
      this.init()
      this.shareShow()
    }
  },
  methods: {
    init () {
      let labelId = this.$utils.getUrlParam('labelId')
      let args = {
        'labelId': labelId
      }
      this.$api.post('api/stock/course/detail', args, data => {
        if (data.code === 0) {
          this.isAuthorised = data.data.isAuthorised
          this.coursePrice = data.data.coursePrice
          this.courseDetail = data.data.courseDetail
          this.otherCourse = data.data.relatedCourses
          this.otherCourse.map((currentValue, index, arr) => {
            arr[index].content = currentValue.content.replace(/<\/?[^>]*>/g, '').replace(/&nbsp;/gi, '')
          })
          this.catalogId = data.data.courseDetail.catalogId
          if (this.catalogId !== '' || this.catalogId !== undefined) {
            this.getImg()
          }
        }
      })
    },
    share () {
      this.guide = !this.guide
      setTimeout(() => {
        this.guide = false
      }, 2500)
    },
    buyBook: function () {
      this.showBookModal = !this.showBookModal
      this.popupVisible = this.popupVisible !== true
    },
    shareShow () { // 获取签名信息
      let url = location.href.split('#')[0]
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
      var curshareUrl = 'https://newtonvue.qiantg.com/test/share?id=' + this.catalogId + '&img=' + this.picUrl
      let args = {
        'url': curshareUrl,
        'catalogId': this.catalogId
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
      let args = {
        'catalogId': this.catalogId
      }
      this.$api.post('api/stock/course/payment/receipt', args, data => {
        console.log(data.data)
        this.charge = data.data.payment
        console.log(205, this.charge)
        pingpp.createPayment(this.charge, function (result, err) {
          if (result === 'success') {
            console.log('payment success', 123)
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
      let args = {
        'catalogId': this.catalogId
      }
      this.$api.post('api/stock/course/share/pic', args, data => {
        if (data.code === 0) {
          console.log(data.data)
          this.picUrl = encodeURIComponent(data.data.picUrl)
          if (this.picUrl !== '' || this.picUrl !== undefined) {
            // 调用分享
            this.shareInfo()
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "detail.less";
</style>
