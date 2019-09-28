<template>
  <div class="login-wrap">
    <div class="login-bgc">
    </div>
    <div class="login">
      <van-cell-group>
        <van-field v-model="iphone"
                   required
                   label="手机号码"
                   placeholder="请输入手机号"
                   @click-right-icon="$toast('question')" />

        <van-field v-model="password"
                   type="password"
                   label="密码"
                   placeholder="请输入密码"
                   required />
      </van-cell-group>
      <div class="imgProve-wrap"
           v-if="yzmshow">
        <img :src="imgUrl"
             alt="">
        <van-field v-model="yanzhengma"
                   placeholder="请输入验证码" />
      </div>
      <div class="button-wrap">
        <van-button type="primary"
                    size="large"
                    @click="loginDo">登录</van-button>
      </div>
      <div class="button-wrap">
        <van-button type="info"
                    to="/create"
                    size="large">注册</van-button>
      </div>
      <van-divider>其他登录方式 </van-divider>
      <van-icon name="wechat" />
      <van-icon name="alipay" />
      <van-icon name="graphic" />

    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Qs from 'qs'
import { Toast, Field, Cell, CellGroup, Button, Divider, Icon } from 'vant'
Vue.use(Toast)
Vue.use(Cell).use(CellGroup).use(Field).use(Button).use(Divider).use(Icon)
export default {
  inject: ['reload'],
  data () {
    return {
      imgKey: '',
      imgUrl: '',
      iphone: '',
      password: '',
      yanzhengma: '',
      token: '',
      Toast: '',
      yzmshow: false,
      errorNum: 0,
    }
  },
  methods: {
    imgProve () {
      this.axios.get('/api/captcha').then((data) => {
        this.imgKey = data.data.data.key
        this.imgUrl = data.data.data.url
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    },
    infoProve () {
      this.$router.push({ path: '/index' })
      this.axios.post('/api/sms/verify', Qs.stringify({
        mobile: this.iphone,
        captcha_code: this.yanzhengma,
        captcha_key: this.imgKey
      })).then((data) => {
        if (data.data.code == '0') {
          this.$toast({
            message: data.data.data
          })
        } else {
          this.$toast({
            message: data.data.data
          })
        }
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    },
    // 登录
    loginDo () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      if (this.errorNum == 3) {
        this.yzmshow = true
      }
      this.axios.post('/api/user/token/mobile', Qs.stringify({
        mobile: this.iphone,
        password: this.password,
        captcha_code: this.yanzhengma,
        captcha_key: this.key
      })).then((data) => {
        this.token = data.data.data.token
        if (data.data.code != 0) {
          this.errorNum++
          this.$toast(data.data.data)
          this.imgProve()
        } else {
          // 设置token的存储
          localStorage.setItem('accessToken', this.token)
          this.$toast('登录成功')
          this.$router.push({ path: '/home' })
        }
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    }
  },
  created () {
    this.imgProve()
  }
}
</script>
<style lang="less" >
.login-wrap {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  background: #f5f5f5;
  .login-bgc {
    height: 200px;
    widows: 100%;
    background-color: #00b355;
  }
  .login {
    position: absolute;
    top: 127px;
    left: 20px;
    right: 20px;
    border: 1px solid #ebedf0;
    border-radius: 5px;
    padding: 10px;
    background: #fff;
    .imgProve-wrap {
      padding-top: 20px;
      display: flex;
      justify-content: center;
      img {
        width: 100px;
      }
      img + div {
        width: 100px;
      }
    }
    .button-wrap {
      padding: 20px 20px 0 20px;
      display: flex;
      justify-content: space-evenly;
    }
  }
  .van-icon {
    font-size: 25px;
  }
  .van-icon-wechat {
    color: #00b355;
  }
  .van-icon-alipay {
    color: #1989fa;
  }
  .van-icon-graphic {
    color: #f22b48;
  }
}
</style>
