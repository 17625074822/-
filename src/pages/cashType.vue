<template>
  <div id="cash-type">
    <m-title>
      {{cashName}} 类别管理
    </m-title>
    <!-- 类别列表 -->
    <van-row v-for="(item,index) in cashList"
             :key="index">
      <van-swipe-cell :on-close="onClose"
                      :name="item.id+'?'+item.name">
        <van-cell :border="false"
                  :title="item.name" />
        <p slot="right">
          <van-button square
                      type="warning"
                      text="编辑"
                      @click="showEditPopup" />
          <van-button square
                      type="danger"
                      text="删除"
                      @click="del" />
        </p>
      </van-swipe-cell>
    </van-row>
    <!-- 添加按钮 -->
    <van-button @click="showPopup"
                icon="plus"
                class="add"></van-button>
    <van-button @click="back"
                icon="arrow-left"
                class="back"></van-button>
    <!-- 底部的盒子 -->
    <div class="footer-box">

    </div>
    <!-- 添加收支类别弹出框 -->
    <van-popup v-model="
                  show"
               position="bottom">
      <van-panel :title="'添加'+cashName+'类别'"
                 :desc="cashName+'类别名称'">
        <van-cell-group>
          <van-field v-model="cashTypeName"
                     required
                     :label="cashName+'类别名称'"
                     :placeholder="'请输入'+cashName+'类别名称'" />
        </van-cell-group>
      </van-panel>
      <!-- 添加按钮和取消 -->
      <div class="button-wrap">
        <van-button type="primary"
                    size="large"
                    @click="add">确认</van-button>
        <van-button type="info"
                    size="large">取消</van-button>
      </div>
    </van-popup>
    <!-- 编辑弹出框-->
    <van-popup class="edit-box"
               v-model="showEdit">
      <van-cell-group>
        <van-field v-model="editName"
                   required
                   clearable
                   :placeholder="typeName"
                   :label="cashName+'类别名称'" />
      </van-cell-group>
      <van-button type="primary"
                  @click="edit"
                  size="large">确定</van-button>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import Qs from 'qs'
import { Dialog, Button, Row, Col, Popup, Panel, Field, Toast, SwipeCell } from 'vant'
import mTitle from '../components/title'
Vue.use(SwipeCell)
Vue.use(Toast)
Vue.use(Field)
Vue.use(Panel)
Vue.use(Popup)
Vue.use(Button)

Vue.use(Row).use(Col)
export default {
  inject: ['reload'],
  components: {
    mTitle
  },
  data () {
    return {
      cashTypeName: '',
      cashList: [],
      show: false,
      Toast: '',
      id: '',
      showEdit: false,
      typeName: '',
      editName: ''
    }
  },
  methods: {
    // 弹出添加框
    showPopup () {
      this.show = true
    },
    // 弹出编辑框
    showEditPopup () {
      this.showEdit = true
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
          this.id = name.name.split('?')[0]
          this.typeName = name.name.split('?')[1]
          instance.close()
          break
      }
    },
    // 添加
    add () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/category/create?token=' + localStorage.getItem('accessToken'), Qs.stringify({
        parent_id: 0,
        type: this.$route.params.id,
        name: this.cashTypeName,
        sort: 10
      })).then((data) => {
        if (data.data.code == 0) {
          this.$toast('添加成功')
          this.reload()
        } else {
          this.$toast('添加失败')
        }
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
      this.show = false
    },
    // del
    del () {
      Dialog.confirm({
        message: '确定删除吗?'
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '加载中...'
        })
        let url = '/api/category/delete?id=' + this.id + '&token=' + localStorage.getItem('accessToken')
        this.axios.post(url).then((data) => {
          if (data.data.code == 0) {
            this.$toast(data.data.data)
            this.reload()
          } else {
            this.$toast('删除失败')
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
    // edit
    edit () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      let url = '/api/category/update?id=' + this.id + '&token=' + localStorage.getItem('accessToken')
      this.axios.post(url, Qs.stringify({
        name: this.editName,
        sort: '10'
      })).then((data) => {
        this.showEdit = false
        if (data.data.code == 0) {
          this.$toast(data.data.data)
          this.reload()
        } else {
          this.$toast('编辑失败')
        }
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 返回
    back () {
      window.history.go(-1)
    }
  },
  created () {
    this.axios.get('/api/category?token=' + localStorage.getItem('accessToken'), {
      params: {
        type: this.$route.params.id,
        dataType: 1
      }
    }).then((data) => {
      this.cashList = data.data.data
    }).catch((error) => {
      this.$toast({
        message: '操作出现异常'
      })
      return error
    })
  },
  computed: {
    cashName: function () {
      if (this.$route.params.id == 1) {
        let name = '收入'
        return name
      } else {
        let name = '支出'
        return name
      }
    }
  }
}
</script>
<style lang="less">
#cash-type {
  margin-bottom: 70px;
  .van-row {
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;
    overflow: hidden;
    padding: 10px 0px 10px 10px;
    height: 44px;
    .van-col {
      line-height: 44px;
      text-align: left;
    }
    .van-cell__title {
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .edit-box {
    width: 80%;
    padding: 10px;
  }
  .van-popup {
    .van-field__body {
      input {
        text-align: right;
      }
    }
    .button-wrap {
      button {
        margin-top: 10px;
      }
    }
  }
  .add {
    position: absolute;
    top: 12px;
    right: 13px;
    background-color: transparent;
    border: 1px solid transparent;
    color: #fff;
  }
  .back {
    position: absolute;
    top: 12px;
    left: 13px;
    color: #fff;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .footer-box {
    height: 50px;
  }
}
</style>
