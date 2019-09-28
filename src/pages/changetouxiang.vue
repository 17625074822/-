<template>
  <div id="changetouxiang">
    <m-Title>个人资料</m-Title>
    <!--意见反馈 -->
    <ul class="list">
      <li class="item">
        <p class="text">头像</p>
        <p class="content">
          <van-image width="50"
                     height="50"
                     :src="touxiang" />
        </p>
        <p class="icon">
          <van-icon name="arrow" />
        </p>
      </li>
      <!-- 昵称 -->
      <li class="item"
          @click="showNamePopup">
        <p class="text">昵称</p>
        <p class="content">
          <input type="text"
                 readonly
                 v-model="nickname">
        </p>
        <p class="icon">
          <van-icon name="arrow" />
        </p>
      </li>
      <!-- 手机号 -->
      <li class="item"
          @click="showMoilePopup">
        <p class="text">手机号</p>
        <p class="content">
          <input type="text"
                 readonly
                 v-model="mobile">
        </p>
        <p class="icon">
          <van-icon name="arrow" />
        </p>
      </li>
    </ul>
    <!-- 手机弹出框 -->
    <van-popup v-model="showMoile">
      <p class="title-text">为确保您的帐号安全,请先登录密码验证身份</p>

      <van-cell-group>
        <van-field v-model="password"
                   type="password"
                   placeholder="请输入密码" />
      </van-cell-group>

      <p class="title-text">下次登录必须使用新手机号码登录</p>
      <van-cell-group>
        <van-field v-model="newmobile"
                   type="text"
                   placeholder="请输入新的手机号码" />
      </van-cell-group>
      <p class="imgbox">
        <van-cell-group>
          <van-field v-model="imgnumber"
                     type="text"
                     placeholder="请输入图片验证码" />
        </van-cell-group>
        <img :src="imgurl">
      </p>
      <p class="yzmbox">
        <van-cell-group>
          <van-field v-model="verify"
                     type="text"
                     placeholder="请输入验证码" />
        </van-cell-group>
        <van-button type="warning"
                    @click="getKey">
          获取验证码
        </van-button>
      </p>
      <van-button type="primary"
                  size="large"
                  @click="saveMobile">
        确认修改
      </van-button>
      <van-button type="info"
                  size="large"
                  @click="back">取消</van-button>
    </van-popup>
    <!-- 修改密码弹出框 -->
    <van-popup v-model="showPwd">
      <p class="title-text">修改密码</p>
      <van-cell-group>
        <van-field v-model="oldPwd"
                   type="password"
                   placeholder="请输入旧密码" />
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="newPwd"
                   type="password"
                   placeholder="请输入新密码" />
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="rePwd"
                   type="password"
                   placeholder="再次输入新密码" />
      </van-cell-group>
      <van-button type="primary"
                  size="large"
                  @click="changePwd">
        确认修改
      </van-button>
      <van-button type="info"
                  size="large"
                  @click="back">取消</van-button>
    </van-popup>
    <!-- 修改名称弹出框 -->
    <van-popup v-model="showName">
      <p class="title-text nickname-title">修改昵称</p>
      <van-cell-group>
        <van-field class="nickname-box"
                   v-model="username"
                   required
                   label="账户昵称" />
      </van-cell-group>
      <van-button type="primary"
                  @click="save">
        保存
      </van-button>
      <van-button type="info"
                  @click="back">取消</van-button>
    </van-popup>
    <!-- 底部按钮 -->
    <van-button @click="showPwdPopup"
                type="primary"
                size="large">
      修改密码
    </van-button>
    <van-button type="info"
                size="large"
                color="linear-gradient(to right, #4bb0ff, #6149f6"
                @click="fanhui">返回</van-button>
  </div>
</template>
<script>
import Vue from 'vue'
import { Icon, Image, Button, Popup, Toast, Field } from 'vant'
import Qs from 'qs'
import mTitle from '../components/title'
Vue.use(Field)
Vue.use(Toast)
Vue.use(Popup)
Vue.use(Button)
Vue.use(Image)
Vue.use(Icon)
export default {
  components: {
    mTitle
  },
  inject: ['reload'],
  data () {
    return {
      nickname: '',
      mobile: '',
      newmobile: '',
      touxiang: '',
      password: '',
      oldPwd: '',
      newPwd: '',
      rePwd: '',
      imgurl: '',
      imgnumber: '',
      imgkey: '',
      verify: '',
      Toast: '',
      showMoile: false,
      showPwd: false,
      showName: false,
      username: '',
    }
  },
  created () {
    // 获取个人信息
    this.axios.get('/api/user/profile?token=' + localStorage.getItem('accessToken')).then((data) => {
      // 设置token的存储
      this.touxiang = data.data.data.avatar_url
      this.nickname = data.data.data.nickname
      this.username = this.nickname
      this.mobile = data.data.data.mobile
    }).catch((error) => {
      this.$toast({
        message: '操作出现异常'
      })
      return error
    })
  },
  methods: {
    // 弹出手机号码
    showMoilePopup () {
      this.showMoile = true
      this.axios.get('/api/captcha').then((data) => {
        this.imgurl = data.data.data.url
        this.imgkey = data.data.data.key
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 弹出密码
    showPwdPopup () {
      this.showPwd = true
      this.axios.get('/api/captcha').then((data) => {
        this.imgurl = data.data.data.url
        this.imgkey = data.data.data.key
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 弹出昵称
    showNamePopup () {
      this.showName = true
    },
    // 修改昵称
    save () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/user/profile/update?token=' + localStorage.getItem('accessToken'), Qs.stringify({
        nickname: this.username
      })).then((data) => {
        if (data.data.code == '0') {
          this.$toast({
            message: data.data.data
          })
          this.showName = false
          this.reload()
        } else {
          this.$toast({
            message: data.data.data
          })
        }
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 返回
    fanhui () {
      window.history.back(-1)
    },
    // 修改手机号
    saveMobile () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })

      this.axios.post('/api/user/mobile?token=' + localStorage.getItem('accessToken'), Qs.stringify({
        password: this.password,
        mobile: this.newmobile,
        verify: this.verify
      })).then((data) => {
        if (data.data.code == '0') {
          this.$toast({
            message: data.data.data
          })
          this.showMoile = false
          this.reload()
        } else {
          this.$toast({
            message: data.data.data
          })
          return false
        }
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 获取验证码
    getKey () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/sms/verify?token=' + localStorage.getItem('accessToken'), Qs.stringify({
        mobile: this.newmobile,
        captcha_code: this.imgnumber,
        captcha_key: this.imgkey
      })).then((data) => {
        if (data.data.code == '0') {
          this.$toast({
            message: data.data.data
          })
        } else {
          this.$toast({
            message: '获取失败，请重试'
          })
        }
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 修改密码
    changePwd () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      if (this.rePwd === this.newPwd) {
        this.axios.post('/api/user/password?token=' + localStorage.getItem('accessToken'), Qs.stringify({
          password: this.oldPwd,
          new_password: this.newPwd
        })).then((data) => {
          if (data.data.code == '0') {
            this.showPwd = false
            this.$toast({
              message: data.data.data
            })
            this.reload()
          } else {
            this.$toast({
              message: data.data.data
            })
          }
        }).catch((error) => {
          this.$toast({
            message: '操作出现异常'
          })
          return error
        })
      } else {
        this.$toast({
          message: '密码输入不一致'
        })
      }
    },
    // 取消
    back () {
      this.showMoile = false
      this.showPwd = false
      this.showName = false
    }
  }

}
</script>
<style lang="less">
#changetouxiang {
  margin-bottom: 50px;
  .list {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      border-bottom: 1px solid #f2f2f2;
      height: 60px;
      .icon {
        i {
          color: #ccbdbd;
        }
        padding-right: 10px;
      }
      .content {
        width: 70%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        input {
          border: none;
          text-align: right;
        }
      }
      .text {
        color: #000;
        padding-left: 10px;
      }
    }
  }
  button {
    margin: 10px 0px;
    width: 95%;
    height: 50px;
    font-size: 16px;
  }
  .van-popup {
    width: 92%;
    border-radius: 10px;
    min-height: 37%;
    .imgbox,
    .yzmbox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        width: 30%;
      }
      button {
        width: 38%;
        border: none;
        padding: 0px;
        border-bottom: 1px solid #f2f2f2;
        height: 41px;
        margin-right: 15px;
      }
    }
    p {
      input {
        width: 100%;
        height: 40px;
        border: none;
        color: #9e9e9e;
      }
    }

    .title-text {
      text-align: left;
      padding: 10px 0;
      padding-left: 12px;
      color: #808b8c;
      border-bottom: 1px solid #f2f2f2;
    }
    & button:nth-of-type(2) {
      margin-bottom: 20px;
    }
    .nickname-title {
      padding-top: 28px;
    }
    .nickname-box {
      padding: 20px 0;
      input {
        text-align: right;
        padding-right: 14px;
      }
    }
  }
  [class*="van-hairline"]::after {
    border: none;
  }
}
</style>
