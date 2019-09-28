<template>
  <div id="account-info">
    <m-title>
      账户资产管理
    </m-title>
    <van-pull-refresh v-model="isLoading"
                      @refresh="onRefresh">
      <van-row v-for="(item,index) in accountList"
               :key="index">
        <van-swipe-cell :on-close="onClose"
                        :name="item.id+'?'+item.name+'?'+item.remark+'?'+item.type">
          <van-cell :border="false"
                    :title="item.name"
                    :value="item.balance" />
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
    </van-pull-refresh>
    <!-- 底部按钮 -->
    <van-button type="primary"
                icon="plus"
                class="add"
                @click="showPopup"></van-button>
    <van-button type="info"
                @click="goBack"
                class="back"
                icon="arrow-left"></van-button>
    <!-- 添加弹出框 -->
    <van-popup v-model="show"
               position="bottom">
      <p class="popup-text">添加资产帐号</p>
      <van-cell-group>
        <van-field v-model="accountName"
                   required
                   label="账户名称"
                   placeholder="请输入账户名称" />
        <van-field v-model="accountGold"
                   required
                   label="初始余额"
                   placeholder="0.00" />
      </van-cell-group>
      <p>账户类型</p>
      <van-radio-group v-model="radio">
        <van-radio name="0">请选择</van-radio>
        <van-radio name="1">现金</van-radio>
        <van-radio name="2">银行</van-radio>
        <van-radio name="3">支付平台</van-radio>
        <van-radio name="4">其他</van-radio>
      </van-radio-group>
      <van-cell-group>
        <van-field v-model="message"
                   type="textarea"
                   placeholder="请输入留言"
                   rows="5"
                   autosize />
      </van-cell-group>
      <van-button type="primary"
                  @click="add"
                  :loading="loading"
                  size="large">确定</van-button>
    </van-popup>
    <!-- 编辑弹出框-->
    <van-popup class="edit-box"
               v-model="showEdit">
      <p class="popup-text">请输入新的账户名称</p>
      <van-cell-group>
        <van-field v-model="typeName"
                   :placeholder="typeName"
                   label="账户名称" />
      </van-cell-group>
      <p class="account-type">账户类型</p>
      <van-radio-group v-model="radio">
        <van-radio name="1">现金</van-radio>
        <van-radio name="2">银行</van-radio>
        <van-radio name="3">支付平台</van-radio>
        <van-radio name="4">其他</van-radio>
      </van-radio-group>
      <van-cell-group>
        <van-field v-model="message"
                   type="textarea"
                   placeholder="请输入留言"
                   rows="5"
                   autosize />
      </van-cell-group>
      <van-button type="primary"
                  @click="edit"
                  size="large">确定</van-button>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import { Toast, Dialog, Row, Col, Button, RadioGroup, Radio } from 'vant'
import mTitle from '../components/title'
import Qs from 'qs'

Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Button)
Vue.use(Row).use(Col)
export default {
  inject: ['reload'],
  components: {
    mTitle
  },
  data () {
    return {
      isLoading: false,
      accountList: [],
      showEdit: false,
      id: '',
      typeName: '',
      radio: '0',
      message: '',
      show: false,
      accountName: '',
      accountGold: '',
      loading: false
    }
  },
  methods: {
    // 返回
    goBack () {
      window.history.back(-1)
    },
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
          this.message = name.name.split('?')[2]
          this.radio = name.name.split('?')[3]
          instance.close()
          break
      }
    },
    // 编辑
    edit () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      let url = '/api/account/update?id=' + this.id + '&token=' + localStorage.getItem('accessToken')
      this.axios.post(url, Qs.stringify({
        name: this.typeName,
        type: Number(this.radio),
        remark: this.message,
        sort: 10
      })).then((data) => {
        if (data.data.code == 0) {
          this.$toast('编辑成功')
          this.showEdit = false
          this.reload()
        } else {
          this.$toast('编辑失败')
        }
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    },
    // 删除
    del () {
      Dialog.confirm({
        message: '确定删除吗?'
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '加载中...'
        })
        let url = '/api/account/delete?id=' + this.id + '&token=' + localStorage.getItem('accessToken')
        this.axios.post(url).then((data) => {
          if (data.data.code == 0) {
            this.$toast(data.data.data)
            this.reload()
          } else {
            this.$toast('删除失败')
          }
        }).catch((error) => {
          this.$toast({
            message: '数据异常'
          })
          return error
        })
      }).catch(() => {
      })
    },
    // 添加
    add () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.loading = true
      let url = '/api/account/create?token=' + localStorage.getItem('accessToken')
      this.axios.post(url, Qs.stringify({
        name: this.accountName,
        type: this.radio,
        initial_balance: this.accountGold,
        remark: this.message,
        sort: 10
      })).then((data) => {
        if (data.data.code == '0') {
          this.radio = '0'
          this.$toast('添加成功')
          this.reload()
        } else {
          this.$toast('添加失败')
          this.loading = false
        }
        this.message = ''
      }).catch((error) => {
        this.$toast({
          message: '数据异常'
        })
        return error
      })
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.reload()
      }, 500)
    }
  },
  // 获取账户
  created () {
    this.axios.get('/api/account?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.accountList = data.data.data
    }).catch((error) => {
      this.$toast({
        message: '数据异常'
      })
      return error
    })
  }
}
</script>
<style lang="less">
#account-info {
  .van-row {
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;
    .van-col {
      height: 100%;
      line-height: 70px;
    }
    & .van-col:nth-child(1) {
      text-align: left;
    }
    & .van-col:nth-child(2) {
      text-align: right;
      color: #fe473f;
    }
    .van-swipe-cell {
      .van-cell {
        padding: 20px 10px 20px 10px;
      }
      .van-cell__title {
        text-align: left;
      }
      .van-swipe-cell__right {
        display: flex;
        align-items: center;
        p {
          height: 100%;
          button {
            height: 100%;
          }
        }
      }
    }
  }
  .edit-box {
    width: 95%;
    padding: 10px;
    border-radius: 13px;
  }
  .van-radio-group {
    margin-bottom: 20px;
  }
  .van-popup {
    padding: 10px;
    box-sizing: border-box;
    .van-field__body {
      input {
        text-align: right;
      }
    }
    .account-type {
      text-align: left;
    }
    .van-field {
      padding-left: 0;
    }
    .van-cell__title {
      text-align: left;
    }
    .van-button {
      margin: 10px 0;
    }
    .popup-text {
      padding-bottom: 10px;
      text-align: left;
    }
    .van-radio__label {
      padding: 10px 0;
    }
  }
  .add {
    position: absolute;
    top: 12px;
    right: 13px;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .back {
    position: absolute;
    top: 12px;
    left: 13px;
    color: #fff;
    background-color: transparent;
    border: 1px solid transparent;
  }
}
</style>
