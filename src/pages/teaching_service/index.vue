<template>
  <div>
    <v-title>股侠课堂首页</v-title>
    <div class="teach_container">
      <div class="tip" v-if="tipStatus" ref="tip">
        <p>分享文章，立即解锁</p>
        <span class="close_btn" @click="close_btn()"></span>
      </div>
      <!--轮播-->
      <mt-swipe :auto="4000" class="swiper-cont"  >
        <mt-swipe-item v-for='item of imgUrl'  :key="item.id" :data-img="item.id">
          <img :src="item.pic_url"  alt="">
        </mt-swipe-item>
      </mt-swipe>
      <!--列表-->
      <div class="list_container">
        <ul>
          <router-link v-for="item of list" :key="item.id" :to=" {path:'/teaching_service/catalog', query:{id:item.id}} ">
            <li>
              <div class="item_cont">
                <div class="desc_cont">
                  <div class="desc_left"><img :src="item.catalog_img+newImg" alt=""></div>
                  <div class="desc_right">
                    <h3 :class="nospace">{{item.course_catalog}}</h3>
                    <p :class="nospace">{{item.summary}}</p>
                  </div>
                </div>
                <p>￥{{item.course_price/100}}</p>
                <router-link tag="p" class="share-btn" :to=" {path:'/test/share', query:{id:item.id, img:picUrl}} " >
                  分享免费解锁
                </router-link>
              </div>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VTitle from '@/components/title/title'
import { Swipe, SwipeItem } from 'mint-ui'
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
export default {
  name: 'index',
  data () {
    return {
      tipStatus: true,
      list: [],
      id: '',
      imgUrl: '',
      newImg: '?imageMogr2/gravity/Center/crop/60x60',
      nospace: 'nospace',
      picUrl: ''
    }
  },
  components: {
    VTitle
  },
  created () {
    this.listInfo()
    this.bannerList()
  },
  methods: {
    close_btn () {
      this.tipStatus = !this.tipStatus
    },
    listInfo () {
      let args = {
        'pageNow': 1,
        'pageSize': 4
      }
      this.$api.post('api/stock/course/serie', args, data => {
        if (data.code === 0) {
          this.list = data.data
          this.list.map((currentValue, index, arr) => {
            let img = arr[index].id
            this.$set(this.$data.list[index], 'img', img)
            let args = {
              'catalogId': img
            }
            this.$api.post('api/stock/course/share/pic', args, data => {
              if (data.code === 0) {
                this.picUrl = encodeURIComponent(data.data.picUrl)
                console.log(88, this.picUrl)
              }
            })
          })
        }
      })
    },
    bannerList () {
      let args = {}
      this.$api.post('api/stock/course/banner', args, data => {
        this.imgUrl = data.data
        console.log(98, this.imgUrl)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./home.less";
</style>
