<template>
  <div id="ideaback">
    <m-title>意见反馈</m-title>
    <div class="idea-box">
      <p class="idea-text">问题和建议</p>
      <van-cell-group>
        <van-field v-model="message"
                   type="textarea"
                   placeholder="请简要描述你的问题和意见"
                   rows="5" />
      </van-cell-group>

      <van-cell-group>
        <p class="mobile-email">联系电话或邮箱</p>
        <van-field v-model="value"
                   placeholder="选填,便于我们与你联系" />
      </van-cell-group>
      <van-button type="primary"
                  class="submit-idea"
                  size="large"
                  @click="submitIdea">提交意见</van-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Field, Button, Toast } from 'vant'
import Qs from 'qs'
import mTitle from '../components/title'
Vue.use(Toast)
Vue.use(Button)
Vue.use(Field)
export default {
  components: {
    mTitle
  },
  data () {
    return {
      message: '',
      value: '',
      Toast: ''
    }
  },
  methods: {
    submitIdea () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      let url = '/api/feedback/add?token=' + localStorage.getItem('accessToken')
      this.axios.post(url, Qs.stringify({
        content: this.message,
        contact: this.value
      })).then((data) => {
        this.$toast(data.data.data)
        window.history.go(-1)
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    }
  }

}
</script>
<style lang="less">
#ideaback {
  .idea-box {
    p {
      text-align: left;
      color: #9b9b99;
      padding-left: 16px;
    }
    .mobile-email {
      background-color: #f5f5f5;
      padding-top: 10px;
      padding-left: 16px;
    }
  }
  .submit-idea {
    width: 95%;
    margin-top: 20px;
  }
}
</style>
