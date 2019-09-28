<template>
  <div id="follow">
    <m-title>{{type==1?'后续收款':'后续付款'}}</m-title>
    <div class="box gold-box">
      <p>{{type==1?'收款金额':'付款金额'}}</p>
      <van-cell-group>
        <van-field v-model="gold"
                   placeholder="0.00" />
      </van-cell-group>
    </div>
    <div class="account-box box">
      <p>{{type==1?'收款账户':'付款账户'}}</p>
      <van-col span="6">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value"
                             :options="option" />
        </van-dropdown-menu>
      </van-col>
    </div>
    <div class="pingzheng-box box">
      <p>{{type==1?'收入凭证':'支出凭证'}}</p>
      <van-uploader v-model="fileList"
                    :after-read="afterRead"
                    @delete="delImg"
                    multiple />
    </div>
    <div class="date-box box">
      <p>{{type==1?'收款日期':'付款日期'}}</p>
      <van-button @click="showPopup">
        {{today}}
      </van-button>
    </div>
    <div class="footer">
      <van-button size="large"
                  type="primary"
                  @click="save">
        {{type==1?'确认收款':'确认付款'}}
      </van-button>
      <van-button size="large"
                  type="info"
                  @click="back">
        返&nbsp;回
      </van-button>
      <div class="footer-box"></div>
    </div>
    <!-- 下拉菜单 -->
    <van-popup v-model="show"
               position="bottom">
      <van-datetime-picker v-model="currentDate"
                           type="date"
                           @confirm="saveDate" />
    </van-popup>
  </div>
</template>
<script>
import Qs from 'qs'
import Vue from 'vue'
import { Field, DropdownMenu, DropdownItem, Uploader, Popup, DatetimePicker, Row, Col, Toast } from 'vant'
import mTitle from '../components/title'

Vue.use(Toast)
Vue.use(Row).use(Col)
Vue.use(DatetimePicker)
Vue.use(Popup)
Vue.use(Uploader)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(Field)
export default {
  components: {
    mTitle
  },
  data () {
    return {
      type: '',
      value: 0,
      option: [
        { text: '请选择', value: 0 }
      ],
      fileList: [],
      today: '',
      show: false,
      currentDate: new Date(),
      accoutlist: [],
      account_id: '',
      gold: '',
      date: '',
      imgkey: [],
      Toast: ''
    }
  },
  created () {
    let date = new Date()
    date = date.toLocaleDateString().replace(/\//g, '-')
    this.type = this.$route.params.id[0]
    this.today = date
    this.date = this.today
    this.axios.get('/api/account?token=' + localStorage.getItem('accessToken')).then((data) => {
      for (const iterator of data.data.data) {
        this.option.push(JSON.parse(JSON.stringify(iterator).replace(/\bid\b/g, 'value').replace(/\bname\b/g, 'text')))
      }
    }).catch((error) => {
      this.$toast({
        message: '操作出现异常'
      })
      return error
    })
  },
  methods: {
    showPopup () {
      this.show = true
    },
    saveDate (value) {
      this.date = value.toLocaleDateString().replace(/\//g, '-')
      this.show = false
      this.today = this.date
    },
    // 获取图片
    afterRead (file) {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
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
          this.imgkey.push(data.data.data.file.fileKey)
          Toast.clear()
        })
        .catch((err) => {
          this.$toast({
            message: '网络异常,请重试！'
          })
          return err
        })
    },
    //删除图片
    delImg () {
      this.imgkey.pop()
    },
    // 保存
    save () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.account_id = this.$route.params.id.substr(1)
      this.axios.post('/api/record/sequel?token=' + localStorage.getItem('accessToken'), Qs.stringify({
        record_id: this.account_id,
        money: this.gold,
        account_id: this.value,
        date: this.date,
        image_keys: this.imgkey.join(',')
      })).then((data) => {
        if (data.data.code == '0') {
          this.$toast(data.data.data)
          window.history.go(-1)
        } else {
          this.$toast(data.data.data)
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
  }
}
</script>
<style lang="less">
#follow {
  .box {
    display: flex;
    justify-content: space-between;
    background: #fff;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    p {
      text-align: left;
      width: 50%;
      padding-left: 10px;
    }
  }
  .gold-box {
    padding: 10px 0;
    p {
      width: 50%;
    }
    input {
      border: none;
      text-align: right;
    }
    [class*="van-hairline"]::after {
      border: none;
    }
  }
  .pingzheng-box {
    padding: 10px;
    .van-uploader__upload {
      margin: 0px;
    }
    p {
      width: 50%;
      padding: 0;
      text-align: left;
    }
  }
  .date-box {
    padding: 10px;
    button {
      border: none;
    }
    p {
      padding: 0;
    }
  }
  .van-popup {
    width: 100%;
  }
  .footer {
    button {
      width: 95%;
      margin-top: 20px;
    }
    .footer-box {
      height: 50px;
    }
  }
}
</style>
