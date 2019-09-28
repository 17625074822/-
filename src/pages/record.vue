<template>
  <div id="jizhang">
    <m-head></m-head>
    <van-tabs v-model="activeName"
              @change="toggleCash"
              replace=true>
      <van-tab title="支出"
               name="2">
        <cash>
          <p slot="cashName">账面支出</p>
          <p slot="cashMode">付款方式</p>
          <p slot="cashAccount">付款账户</p>
          <p slot="cashCategory">支出类别</p>
          <p v-if="cashTypeValue=='1'"
             slot="first">首笔付款</p>
          <!-- 付款金额 -->
          <van-cell-group slot="cashGold">
            <van-field v-model="cashGold"
                       placeholder="0.00" />
          </van-cell-group>
          <!-- 交易对象 -->
          <van-col span="12"
                   slot="company_name">
            <van-field v-model="company_name"
                       placeholder="输入交易对象" />
          </van-col>
          <!-- 付款账户 -->
          <van-dropdown-menu slot="cashAccountMenu">
            <van-dropdown-item v-model="cashAccountValue"
                               :options="cashAccountOption" />
          </van-dropdown-menu>
          <!-- 付款方式 -->
          <van-dropdown-menu slot="cashModeMenu">
            <van-dropdown-item v-model="cashTypeValue"
                               :options="cashTypeOption" />
          </van-dropdown-menu>
          <!-- 分期付款 -->
          <van-cell-group slot="firstGold">
            <van-field v-model="firstGold"
                       v-if="cashTypeValue=='1'"
                       placeholder="0.00" />
          </van-cell-group>
          <!-- 支出类别 -->
          <van-dropdown-menu slot="cashCategoryMenu">
            <van-dropdown-item v-model="cashCategorytValue"
                               :options="cashCategoryOption" />
          </van-dropdown-menu>
          <!-- 付款日期 -->
          <van-cell-group slot="cashDateMenu">
            <van-button type="default"
                        @click="showPopup">
              <van-field :v-model="cashDate"
                         :placeholder="cashDate"
                         readonly />
            </van-button>
          </van-cell-group>
          <!-- 付款日期 -->
          <p slot="cashDate">付款日期</p>
          <!-- 付款凭证 -->
          <p slot="cashVoucher">支出凭证</p>
          <van-uploader slot="cashVoucherImg"
                        :after-read="afterRead"
                        :before-read="beforeRead"
                        v-model="fileList"
                        multiple />
          <!-- 备注 -->
          <van-cell-group slot="cashRemark">
            <van-field type="textarea"
                       autosize
                       rows="5"
                       v-model="remark"
                       placeholder="请输入备注..." />
          </van-cell-group>
        </cash>
      </van-tab>
      <!-- 收入 -->
      <van-tab title="收入"
               name="1">
        <cash>
          <p slot="cashName">账面收入</p>
          <p slot="cashMode">收款方式</p>
          <p slot="cashAccount">收款账户</p>
          <p slot="cashCategory">收入类别</p>
          <p slot="first"
             v-if="cashTypeValue=='1'">分期收入</p>
          <!-- 收款金额 -->
          <van-cell-group slot="cashGold">
            <van-field v-model="cashGold"
                       placeholder="0.00" />
          </van-cell-group>
          <!-- 交易对象 -->
          <van-col span="12"
                   slot="company_name">
            <van-field v-model="company_name"
                       placeholder="输入交易对象" />
          </van-col>
          <!-- 收款账户 -->
          <van-dropdown-menu slot="cashAccountMenu">
            <van-dropdown-item v-model="cashAccountValue"
                               :options="cashAccountOption" />
          </van-dropdown-menu>
          <!-- 收款方式 -->
          <van-dropdown-menu slot="cashModeMenu">
            <van-dropdown-item v-model="cashTypeValue"
                               :options="cashTypeOption" />
          </van-dropdown-menu>
          <!-- 分期收款 -->
          <van-cell-group slot="firstGold">
            <van-field v-model="firstGold"
                       v-if="cashTypeValue=='1'"
                       placeholder="0.00" />
          </van-cell-group>
          <!-- 收入类别 -->
          <van-dropdown-menu slot="cashCategoryMenu">
            <van-dropdown-item v-model="cashCategorytValue"
                               :options="cashCategoryOption" />
          </van-dropdown-menu>
          <!-- 收款日期 -->
          <van-cell-group slot="cashDateMenu">
            <van-button type="default"
                        @click="showPopup">
              <van-field :v-model="cashDate"
                         :placeholder="cashDate"
                         readonly />
            </van-button>
          </van-cell-group>
          <!-- 收款日期 -->
          <p slot="cashDate">收款日期</p>
          <!-- 付款凭证 -->
          <p slot="cashVoucher">收入凭证</p>
          <van-uploader slot="cashVoucherImg"
                        :after-read="afterRead"
                        :before-read="beforeRead"
                        v-model="fileList"
                        multiple />
          <!-- 备注 -->
          <van-cell-group slot="cashRemark">
            <van-field type="textarea"
                       autosize
                       rows="5"
                       v-model="remark"
                       placeholder="请输入备注..." />
          </van-cell-group>
        </cash>
      </van-tab>
    </van-tabs>
    <!-- 保存 -->
    <div class="save">
      <van-button type="primary"
                  size="large"
                  @click="create">
        保存
      </van-button>
    </div>
    <!-- 底盒 -->
    <div class="footer"></div>
    <!-- 返回 -->
    <div class="back">
      <van-button @click="back"
                  class="back"
                  icon="arrow-left">
      </van-button>
    </div>
    <!-- 弹出框 -->
    <van-popup position="bottom"
               v-model="show">
      <van-datetime-picker @confirm="getDateTime"
                           v-model="currentDate"
                           :value="currentDate"
                           type="date" />
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import Qs from 'qs'
import mHead from '../components/head'
import Cash from '../components/cash'
import { Tab, Tabs, Row, Col, Field, DropdownMenu, DropdownItem, DatetimePicker, Popup, Button, Uploader, Toast } from 'vant'

Vue.use(Toast)
Vue.use(Uploader)
Vue.use(Button)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(Row).use(Col)
Vue.use(Tab).use(Tabs)
Vue.use(Field)
export default {
  inject: ['reload'],
  components: {
    Cash,
    mHead
  },
  data () {
    return {
      isRouterAlive: true,
      activeName: 'chasOut',
      show: false,
      fileList: [],
      file: {},
      remark: '',
      cashGold: '',
      company_name: '',
      cashDate: '请选择',
      currentDate: new Date(),
      firstGold: '',
      cashTypeValue: 0,
      cashTypeOption: [
        { text: '全额付款', value: 0 },
        { text: '分期付款', value: 1 }
      ],
      cashAccountValue: 0,
      cashAccountOption: [
        { text: '请选择', value: 0 }
      ],
      cashCategorytValue: 0,
      cashCategoryOption: [
        { text: '请选择', value: 0 }
      ],
      imgkey: [],
      Toast: ''
    }
  },
  methods: {
    // 获取日期
    getDateTime (cashDate) {
      this.cashDate = cashDate.toLocaleDateString().replace(/\//g, '-')
      this.show = false
    },
    // 日期弹框
    showPopup () {
      this.show = true
    },
    // 校验是否为图片
    beforeRead (file) {
      if (file.type !== 'image/jpeg') {
        Toast('请上传 jpg 格式图片')
        return false
      }
      return true
    },
    // 获取图片
    afterRead (file) {
      let url1 = '/api/upload/image?token=' + localStorage.getItem('accessToken')
      let params = new FormData()
      params.append('file', file.file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post(url1, params, config)
        .then((data) => {
          this.imgkey.push(data.data.data.file.fileKey)
          Toast.clear();
        })
        .catch((err) => {
          this.$toast({
            message: '数据异常'
          })
          return err
        })
    },
    // 切换收支页面更换数据
    toggleCash (name, title) {
      if (title === '支出') {
        this.cashCategorytValue = 0
        this.cashCategoryOption = [{ text: '请选择', value: 0 }]
        this.activeName = name
        // 获取收入支出类别
        this.axios.get('/api/category?token=' + localStorage.getItem('accessToken'), {
          params: {
            type: name,
            dataType: 1
          }
        }).then((data) => {
          // 遍历循环账户并添加到收入/支出中
          for (const iterator of data.data.data) {
            this.cashCategoryOption.push(JSON.parse(JSON.stringify(iterator).replace(/\bid\b/g, 'value').replace(/\bname\b/g, 'text')))
          }
        }).catch((error) => {
          this.$toast({
            message: '数据异常'
          })
          return error
        })
      } else {
        this.cashCategorytValue = 0
        this.cashCategoryOption = [{ text: '请选择', value: 0 }]
        this.activeName = name
        this.axios.get('/api/category?token=' + localStorage.getItem('accessToken'), {
          params: {
            type: name,
            dataType: 1
          }
        }).then((data) => {
          // 遍历循环账户并添加到收入/支出中
          for (const iterator of data.data.data) {
            this.cashCategoryOption.push(JSON.parse(JSON.stringify(iterator).replace(/\bid\b/g, 'value').replace(/\bname\b/g, 'text')))
          }
        }).catch((error) => {
          this.$toast({
            message: '数据异常'
          })
          return error
        })
      }
    },
    // 新增记账
    create () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      // 新增收入/支出
      if (this.firstGold == '') {
        this.axios.post('/api/record/create?token=' + localStorage.getItem('accessToken'), Qs.stringify({
          total_money: this.cashGold,
          money: this.cashGold,
          account_id: this.cashAccountValue,
          category_id: this.cashCategorytValue,
          date: this.cashDate,
          company_name: this.company_name,
          remark: this.remark,
          image_keys: this.imgkey.join(',')
        })).then((data) => {
          this.$toast(data.data.data)
          if (data.data.code == 0) {
            window.history.go(-1)
          } else {
            this.$toast('上传数据出错,请重试!')
          }
        }).catch((error) => {
          this.$toast({
            message: '网络异常,请重试！'
          })
          return error
        })
      } else {
        this.axios.post('/api/record/create?token=' + localStorage.getItem('accessToken'), Qs.stringify({
          total_money: this.cashGold,
          money: this.firstGold,
          account_id: this.cashAccountValue,
          category_id: this.cashCategorytValue,
          date: this.cashDate,
          company_name: this.company_name,
          remark: this.remark,
          image_keys: this.imgkey.join(',')
        })).then((data) => {
          if (data.data.code == '0') {
            this.$toast(data.data.data)
            window.history.go(-1)
          } else {
            this.$toast('上传数据出错,请重试!')
          }
        }).catch((error) => {
          this.$toast({
            message: '网络异常,请重试!'
          })
          return error
        })
      }
    },
    // 返回
    back () {
      window.history.go(-1)
    }
  },
  // 页面初始化
  created () {
    // 获取账户信息
    this.axios.get('/api/account?token=' + localStorage.getItem('accessToken')).then((data) => {
      // 遍历循环账户并添加到收入/支出账户中
      for (const iterator of data.data.data) {
        this.cashAccountOption.push(JSON.parse(JSON.stringify(iterator).replace(/\bid\b/g, 'value').replace(/\bname\b/g, 'text')))
      }
    }).catch((error) => {
      this.$toast({
        message: '网络异常,请重试!'
      })
      return error
    })
    // 获取收入支出类别
    this.axios.get('/api/category?token=' + localStorage.getItem('accessToken'), {
      params: {
        type: 2,
        dataType: 1
      }
    }).then((data) => {
      // 遍历循环账户并添加到收入/支出中
      for (const iterator of data.data.data) {
        this.cashCategoryOption.push(JSON.parse(JSON.stringify(iterator).replace(/\bid\b/g, 'value').replace(/\bname\b/g, 'text')))
      }
    }).catch((error) => {
      this.$toast({
        message: '网络异常,请重试!'
      })
      return error
    })
  }
}
</script>
<style lang="less" >
#jizhang {
  margin-bottom: 50px;
  #firstcash {
    border: none;
  }
  .van-row {
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
    display: flex;
    align-items: center;
    input {
      text-align: center;
    }
    .van-col {
      height: 100%;
      min-height: 0px;
      .van-button--default {
        border: none;
      }
      .van-button:active::before {
        opacity: 0;
      }
      .van-button--normal {
        padding: 0px;
      }
    }
    .van-col:nth-child(1) {
      background-color: #fff;
      text-align: center;
    }
    .van-uploader__upload,
    .van-uploader__preview {
      margin-top: 8px;
    }
    .van-cell-group {
      width: 100%;
    }
  }
  [class*="van-hairline"]::after {
    border: none;
  }
  .save {
    padding-top: 10px;
  }
  .back {
    position: absolute;
    top: 6px;
    left: 10px;
    color: #fff;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .footer {
    height: 50px;
  }
}
</style>
