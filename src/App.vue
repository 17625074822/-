<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
    <div class="m-tabbar"
         v-show="!isLogin">
      <van-tabbar v-model="active"
                  route
                  active-color="#07BC9D">
        <van-tabbar-item name="gold"
                         icon="gold-coin-o"
                         to="/home">明细</van-tabbar-item>
        <van-tabbar-item name="balance"
                         icon="balance-o"
                         to="/account">账户</van-tabbar-item>
        <van-tabbar-item name="contact"
                         icon="contact"
                         to="/me">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button, Tabbar, TabbarItem } from 'vant'

Vue.use(Tabbar).use(TabbarItem)
Vue.use(Button)

export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      active: 0,
      isRouterAlive: true
    }
  },
  name: 'App',
  methods: {

    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
  computed: {
    isLogin: function () {
      if (this.$route.path === '/' || this.$route.path === '/create' || this.$route.path === '/login') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less">
@import "../node_modules/vant/lib/index.css";
#app {
  font-family: "Arial", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  list-style: none;
  background: #f5f5f5;
  .van-tabbar-item__icon {
    width: 18px;
    height: 18px;
    z-index: 2;
  }
  [class*="van-hairline"]::after {
    border: none !important;
  }
}
</style>
