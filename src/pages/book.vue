<template>
  <div id="book">
    <m-title>帐簿管理</m-title>
    <ul class="book-list">
      <van-swipe-cell :on-close="onClose"
                      v-for="(item,index) in data"
                      :key="index"
                      :name="item.id">
        <van-cell :border="false"
                  :title="item.name+'(创建:'+item.user_name+')'">
          <span slot="default">
            <span v-if="id==item.id">(当前帐簿)</span>
          </span>
        </van-cell>
        <span slot="right">
          <van-button square
                      v-if="id!=item.id"
                      type="primary"
                      @click="change"
                      text="切换" />
          <van-button square
                      type="warning"
                      text="编辑"
                      @click="edit" />
          <van-button square
                      type="danger"
                      text="删除"
                      @click="del" />
        </span>
      </van-swipe-cell>
    </ul>
    <!-- 底部按钮 -->
    <div class="footer">
      <van-button type="primary"
                  @click="showPopup">
        创建新帐簿
      </van-button>
      <!-- 创建新帐簿的弹出框 -->
      <van-popup v-model="showCreate">
        <p class="title">添加帐簿名称</p>
        <p class="book-name">
          <span>账户名称</span>
          <input type="text"
                 placeholder="请输入帐簿名称"
                 v-model="name">
        </p>
        <van-button type="primary"
                    size="large"
                    @click="add">创建新帐簿</van-button>
      </van-popup>
      <!-- 编辑帐簿弹出框 -->
      <van-popup v-model="showEdit">
        <p class="title">帐簿名称修改</p>
        <p class="book-name">
          <span>账户名称</span>
          <input type="text"
                 placeholder="请输入帐簿名称"
                 v-model="edit_name">
        </p>
        <van-button type="primary"
                    @click="doEdit">确认</van-button>
      </van-popup>
      <!-- 返回 -->
      <van-button type="info"
                  @click="back">返回</van-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Dialog, Button, Popup, Toast, SwipeCell } from 'vant'
import Qs from 'qs'
import mTitle from '../components/title'
Vue.use(SwipeCell)
Vue.use(Toast)
Vue.use(Popup)
Vue.use(Button)
export default {
  components: {
    mTitle
  },
  inject: ['reload'],
  data () {
    return {
      data: [],
      id: '',
      name: '',
      showCreate: false,
      showEdit: false,
      book_id: '',
      Toast: '',
      edit_name: ''
    }
  },
  methods: {
    showPopup () {
      this.showCreate = true
    },
    // clickPosition 表示关闭时点击的位置
    onClose (clickPosition, instance, name) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          this.book_id = name.name
          instance.close()
          break
      }
    },
    // 改变主book
    change () {
      Dialog.confirm({
        message: '确定更改吗？'
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '加载中...'
        })
        this.axios.post('/api/book/set-default?token=' + localStorage.getItem('accessToken'), Qs.stringify({
          book_id: this.book_id
        })).then((data) => {
          if (data.data.code == 0) {
            this.$toast({
              message: '切换成功'
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
      }).catch(() => {
      })
    },
    // 删除
    del () {
      Dialog.confirm({
        message: '确定删除吗？'
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '加载中...'
        })
        this.axios.post('/api/book/delete?token=' + localStorage.getItem('accessToken'), Qs.stringify({
          book_id: this.book_id
        })).then((data) => {
          if (data.data.code == 0) {
            this.$toast({
              message: '删除成功'
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
      }).catch(() => {
      })
    },
    // 弹出编辑框
    edit () {
      this.showEdit = true
    },
    // 编辑帐簿
    doEdit () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/book/update?token=' + localStorage.getItem('accessToken'), Qs.stringify({
        book_id: this.book_id,
        book_name: this.edit_name
      })).then((data) => {
        this.showEdit = false
        if (data.data.code == '0') {
          this.$toast({
            message: '修改成功'
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
    },
    back: function () {
      window.history.back(-1)
    },
    add: function () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      if (this.name == '') {
        this.$toast({
          message: '名称不能为空'
        })
        return false
      } else {
        Toast.loading({
          mask: true,
          message: '加载中...'
        })
        this.axios.post('/api/book/create?token=' + localStorage.getItem('accessToken'), Qs.stringify({
          name: this.name
        })).then((data) => {
          this.showCreate = false
          if (data.data.code == '0') {
            this.$toast({
              message: '创建成功'
            })
            this.reload()
          } else {
            this.showCreate = false
            this.$toast({
              message: '创建失败'
            })
          }
        }).catch((error) => {
          this.$toast({
            message: '操作出现异常'
          })
          return error
        })
      }
    }
  },
  created () {
    this.axios.get('/api/book?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.data = data.data.data
    }).catch((error) => {
      this.$toast({
        message: '操作出现异常'
      })
      return error
    })
    // 获取当前帐簿
    this.axios.get('/api/book/get-default?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.id = data.data.data.id
    }).catch((error) => {
      this.$toast({
        message: '操作出现异常'
      })
      return error
    })
  }
}
</script>
<style lang="less" >
#book {
  .book-list {
    .van-swipe-cell {
      border-bottom: 1px solid #f2f2f2;
      background-color: #fff;
    }
  }
  .footer {
    button {
      margin-top: 10px;
      width: 95%;
    }
  }
  .van-popup {
    width: 95%;
    height: 27%;
    border-radius: 10px;
    .title {
      height: 40px;
      font-size: 22px;
      color: #808b8c;
    }
    button {
      margin: 33px 0;
    }
  }
  .book-title {
    text-align: left;
    color: #9e9e9e;
    padding-bottom: 20px;
  }
  .book-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #f2f2f2;
    input {
      border: none;
      text-align: right;
    }
  }
  .van-cell__title {
    text-align: left;
    span {
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
