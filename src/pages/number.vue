<template>
  <div id="number">
    <m-title>记账成员管理</m-title>
    <p v-if="data.length ==0"
       class="number-text">
      您暂时还没有记账成员
    </p>
    <!-- 成员列表 -->
    <van-swipe-cell :on-close="onClose"
                    v-for="(item,index) in data"
                    :key="index"
                    :name="item.id">
      <van-cell :border="false"
                :title="item.nickname" />
      <p slot="right">
        <van-button square
                    type="danger"
                    text="删除" />
      </p>
    </van-swipe-cell>
    <!-- 添加成员 -->
    <div class="footer">
      <van-button type="primary"
                  size="large"
                  @click="add">添加记账成员</van-button>
      <van-button type="info"
                  size="large"
                  @click="fanhui">返回</van-button>
    </div>
    <!-- 记账成员弹出框 -->
    <van-popup v-model="show">
      <p>添加记账成员</p>
      <input type="text"
             placeholder="请输入记账成员手机号"
             v-model="mobile">
      <van-button type="primary"
                  size="large"
                  @click="save">保存</van-button>
      <van-button type="info"
                  size="large"
                  @click="back">取消</van-button>
    </van-popup>

  </div>
</template>
<script>
import Vue from 'vue'
import mTitle from '../components/title'
import { Dialog, SwipeCell, Button, Popup, Toast } from 'vant'
import Qs from 'qs'

Vue.use(Toast)
Vue.use(Popup)
Vue.use(Button)
Vue.use(SwipeCell)
export default {
  components: {
    mTitle
  },
  inject: ['reload'],
  data () {
    return {
      data: [],
      book_id: '',
      show: false,
      mobile: '',
      Toast: ''
    }
  },
  methods: {
    onClose (clickPosition, instance, name) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(() => {
            let url = '/api/member/delete?token=' + localStorage.getItem('accessToken')
            this.axios.post(url, Qs.stringify(
              {
                book_id: this.book_id,
                user_id: name.name
              }
            )).then((data) => {
              if (data.data.code == '0') {
                this.$toast(data.data.data)
                this.reload()
              } else {
                this.$toast('删除失败')
                this.show = false
              }
            }).catch((error) => {
              this.$toast({
                message: '数据异常'
              })
              return error
            })
            instance.close()
          })
          break
      }
    },
    // 添加记账成员
    add () {
      this.show = true
    },
    // 返回
    back () {
      this.show = false
    },
    save () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      let url = '/api/member/add?token=' + localStorage.getItem('accessToken')
      this.axios.post(url, Qs.stringify({
        book_id: this.book_id,
        mobile: this.mobile
      })).then((data) => {
        if (data.data.code == '0') {
          this.show = false
          this.$toast(data.data.data)
          this.reload()
        } else {
          this.$toast(data.data.data)
        }
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    },
    fanhui () {
      window.history.back(-1)
    }
  },
  created () {
    this.data = []
    var promise = new Promise((resolve, reject) => {
      let url1 = '/api/book/get-default?token=' + localStorage.getItem('accessToken')
      this.axios.get(url1)
        .then((res) => {
          this.book_id = res.data.data.id
          resolve(res)
        })
        .catch((err) => {
          this.$toast({
            message: '数据异常'
          })
          return err
        })
    })
    promise.then((res) => {
      let url2 = '/api/member?token=' + localStorage.getItem('accessToken')
      this.axios.post(url2, Qs.stringify({
        book_id: res.data.data.id
      })).then((res) => {
        if (res.data.code == '0') {
          this.data = res.data.data
        } else {
          return false
        }
      }).catch((err) => {
        this.$toast({
          message: '数据异常'
        })
        return err
      })
    })
  }
}
</script>
<style lang="less" >
#number {
  .number-text {
    color: #ccc;
  }
  p {
    line-height: 50px;
  }
  .van-swipe-cell {
    border-bottom: 1px solid #f2f2f2;
    .van-cell__title {
      text-align: left;
    }
  }
  .footer {
    button {
      margin-top: 10px;
      width: 95%;
    }
  }
  .van-popup {
    width: 90%;
    padding: 10px;
    border-radius: 5px;
    input {
      width: 100%;
      padding: 10px 0;
      border: none;
    }
    button {
      margin: 10px 0px;
    }
  }
}
</style>
