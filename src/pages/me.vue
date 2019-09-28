<template>
  <div id="me">
    <!-- 头部 -->
    <m-head></m-head>
    <!-- 身体 -->
    <ul>
      <!-- 头像 -->
      <li class="me-list">
        <van-button type="default"
                    size="large"
                    @click="showPopup">
          <van-row class="me-row">
            <van-col span="8">
              <van-image :src="touxiang" />
            </van-col>
            <van-col span="14"
                     class="me-info">
              <p class="cashin">
                {{nickname}}
              </p>
              <p>
                {{mobile}}
              </p>
            </van-col>
            <van-col span="2"
                     class="right-arrow">
              <van-icon name="arrow" />
            </van-col>
          </van-row>
        </van-button>
      </li>

      <!-- 修改个人资料 -->
      <li class="me-item">
        <van-button type="default"
                    size="large"
                    to="/changetouxiang">
          <van-row class="me-row">
            <van-col span="4"
                     class="icon">
              <van-icon name="setting" />
            </van-col>
            <van-col span="18">
              <p class="text">修改个人资料</p>
            </van-col>
            <van-col span="2"
                     class="right-arrow">
              <van-icon name="arrow" />
            </van-col>
          </van-row>
        </van-button>
      </li>
      <!-- 帐簿管理 -->
      <li class="me-item">
        <van-button type="default"
                    size="large"
                    to="/book">
          <van-row class="me-row">
            <van-col span="4"
                     class="icon">
              <van-icon name="bill" />
            </van-col>
            <van-col span="18">
              <p class="text">帐簿管理</p>
            </van-col>
            <van-col span="2"
                     class="right-arrow">
              <van-icon name="arrow" />
            </van-col>
          </van-row>
        </van-button>
      </li>
      <!--意见反馈 -->
      <li class="me-item">
        <van-button type="default"
                    size="large"
                    to="/ideaback">
          <van-row class="me-row">
            <van-col span="4"
                     class="icon">
              <van-icon name="invition" />
            </van-col>
            <van-col span="18">
              <p class="text">意见反馈</p>
            </van-col>
            <van-col span="2"
                     class="right-arrow">
              <van-icon name="arrow" />
            </van-col>
          </van-row>
        </van-button>
      </li>
      <!-- 退出登录 -->
      <li class="me-item">
        <van-button type="default"
                    size="large"
                    @click="quit">
          退出登录
        </van-button>
      </li>
    </ul>
    <!-- 弹出头像层 -->
    <van-popup v-model="show">
      <p>修改头像</p>
      <van-uploader :after-read="afterRead"
                    v-model="fileList"
                    :max-count="1"
                    multiple />
      <div class="img-button">
        <van-button type="info"
                    @click="hidden">取消</van-button>
        <van-button type="primary"
                    :loading='loading'
                    @click="save">确认</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import { Row, Col, Button, Image, Popup, Uploader, Toast } from 'vant'
import mHead from '../components/head'
import Qs from 'qs'
Vue.use(Toast)
Vue.use(Uploader)
Vue.use(Popup)
Vue.use(Image)
Vue.use(Button)
Vue.use(Row).use(Col)
export default {
  inject: ['reload'],
  data () {
    return {
      mobile: '',
      avatar_url: '',
      touxiang: '',
      nickname: '',
      name: '',
      show: false,
      fileList: [],
      imgkey: '',
      Toast: '',
      loading: false
    }
  },
  components: {
    mHead
  },
  created () {
    this.name = localStorage.getItem('personInfo')
    // 获取个人信息
    this.axios.get('/api/user/profile?token=' + localStorage.getItem('accessToken')).then((data) => {
      // 设置token的存储
      this.touxiang = data.data.data.avatar_url
      this.nickname = data.data.data.nickname
      this.mobile = data.data.data.mobile
    }).catch((error) => {
      this.$toast({
        message: '数据异常'
      })
      return error
    })
  },
  methods: {
    showPopup () {
      this.show = true
    },
    // 获取图片
    afterRead (file, name) {
      this.loading = true
      let params = new FormData()
      params.append('file', file.file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 此时可以自行将文件上传至服务器
      let url1 = '/api/upload/image?token=' + localStorage.getItem('accessToken')
      this.axios.post(url1, params, config)
        .then((data) => {
          this.imgkey = data.data.data.file.fileKey
          this.loading = false;
        })
        .catch((err) => {
          this.$toast({
            message: '数据异常'
          })
          return err
        })
    },
    save () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      let url2 = '/api/user/profile/update?token=' + localStorage.getItem('accessToken')
      this.axios.post(url2, Qs.stringify({
        nickname: '',
        avatar: this.imgkey
      })).then((data) => {
        if (data.data.code == 0) {
          this.$toast(data.data.data)
          this.reload()
        } else {
          this.$toast(data.data.data)
          this.reload()
        }
      }).catch((err) => {
        this.$toast({
          message: '数据异常'
        })
        return err
      })
    },
    quit () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      let url = '/api/user/logout?token=' + localStorage.getItem('accessToken')
      this.axios.get(url).then((data) => {
        if (data.data.code == 0) {
          this.$toast('退出成功')
          this.$router.push({ path: '/login' })
        } else {
          this.$toast('退出失败')
        }
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    },
    hidden () {
      this.show = false
    }
  }
}
</script>
<style lang="less" >
#me {
  .me-list {
    margin-bottom: 20px;
    button {
      height: 100%;
    }
    .me-row {
      display: flex;
      align-items: center;
      .me-info {
        text-align: left;
      }
    }
  }
  .right-arrow {
    display: flex;
  }
  .van-image {
    width: 80px;
    height: 80px;
    vertical-align: middle;
  }
  .me-item {
    margin-bottom: 20px;
    .me-row {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        display: flex;
        justify-content: center;
        i {
          font-size: 25px;
          color: #00b355;
        }
      }
    }
    .text {
      text-align: left;
    }
  }
  .van-popup {
    border-radius: 5px;
    width: 88%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    flex-direction: column;
    .van-uploader__upload {
      margin: 0px;
    }
    .img-button {
      padding-top: 10px;
      button {
        margin: 10px;
      }
    }
    p {
      width: 100%;
      color: #333;
      margin-bottom: 10px;
      box-sizing: border-box;
      padding: 14px;
    }
  }
}
</style>
