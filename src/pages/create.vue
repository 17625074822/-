<template>
  <div id="login-wrap">
    <div class="login-bgc">
    </div>
    <div class="login">
      <van-cell-group>
        <van-field v-model="username"
                   label="用户名"
                   right-icon="question-o"
                   placeholder="请输入用户名" />
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
        <van-field v-model="repassword"
                   type="password"
                   label="重复密码"
                   placeholder="请再次输入密码"
                   required />
      </van-cell-group>
      <!-- 图片验证 -->
      <div class="imgProve-wrap">
        <img :src="imgUrl"
             alt="">
        <van-field v-model="imgyanzhengma"
                   placeholder="请输入验证码" />
      </div>
      <!-- 发送手机验证吗 -->
      <div class="infoProve-wrap">
        <van-button type="warning"
                    @click="infoProve">发送短信</van-button>
        <van-field v-model="infoyanzhengma"
                   placeholder="请输入验证码" />
      </div>
      <div class="button-wrap">
        <van-button type="info"
                    size="large"
                    @click="create">注册</van-button>
      </div>
      <div class="button-wrap">
        <van-button type="primary"
                    size="large"
                    to="/">返回</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Cell, CellGroup, Button, Divider, Icon, Toast } from 'vant'
import Qs from 'qs'

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
      repassword: '',
      imgyanzhengma: '',
      username: '',
      infoyanzhengma: '',
      Toast: ''
    }
  },
  methods: {
    // 图片验证码
    imgProve () {
      this.axios.get('/api/captcha').then((data) => {
        this.imgKey = data.data.data.key
        this.imgUrl = data.data.data.url
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 手机验证码
    infoProve () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/sms/verify', Qs.stringify({
        mobile: this.iphone,
        captcha_code: this.imgyanzhengma,
        captcha_key: this.imgKey
      })).then((data) => {
        if (data.data.code == '0') {
          this.$toast({
            message: data.data.data
          })
        } else {
          this.$toast({
            message: '获取失败请重试'
          })
        }
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 注册
    create () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.disabled = true
      if (this.password === this.repassword) {
        this.axios.post('/api/user/register', Qs.stringify({
          mobile: this.iphone,
          verify: this.infoyanzhengma,
          password: this.password,
          nickname: this.username
        })).then((data) => {
          if (data.data.code == 0) {
            this.$toast('注册成功')
            // 设置token的存储
            localStorage.setItem('accessToken', data.data.data.token)
            this.$router.push({ path: '/home' })
          } else {
            this.$toast(data.data.data)
            this.reload()
            return false
          }
        })
      } else {
        this.$toast('两次密码不一致')
        return false
      }
    }
  },
  created () {
    this.imgProve()
  }
}
</script>
<style lang="less" scoped>
#login-wrap {
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
      justify-content: space-around;
      .van-field {
        border: none;
        border-bottom: 1px solid #f2f2f2;
        padding: 0px;
      }
      .van-field__body {
        padding-left: 5px;
        input {
          height: 46px;
        }
      }
      img {
        width: 100px;
      }
      img + div {
        width: 100px;
        border: 1px solid #f6f6f6;
      }
    }
    .infoProve-wrap {
      padding-top: 20px;
      display: flex;
      justify-content: space-around;
      .van-field {
        border: none;
        border-bottom: 1px solid #f2f2f2;
        padding: 0px;
      }
      .van-field__body {
        padding-left: 5px;
        input {
          height: 46px;
        }
      }
      button {
        width: 100px;
      }
      button + div {
        width: 100px;
        border: 1px solid #f6f6f6;
        margin-left: 10px;
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
}
</style>
