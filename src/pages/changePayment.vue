<template>
  <div id="payment-list">
    <div class="title">
      <p class="name"> {{dataList.type_string =='支出'?'支出详情':'收入详情'}} </p>
    </div>
    <ul class="payment-box">
      <!-- 账面收支 -->
      <li class="payment-item">
        <p c
           lass="name">
          {{dataList.type_string =='支出'?'账面支出':'账面收入'}}
        </p>
        <p class="content"
           :class="dataList.type_string=='支出'?'cashout_gold' : 'cashin_gold'">
          <input type="text"
                 :readonly="status"
                 :class="{'changeInfo':!status}"
                 v-model="total_money">
          <van-icon name="arrow" />
        </p>
      </li>
      <!-- 交易对象 -->
      <li>
        <p class="name">
          交易对象
        </p>
        <p class="content">
          <input type="text"
                 :readonly="status"
                 :class="{'changeInfo':!status}"
                 v-model="company_name">
          <van-icon name="arrow" />
        </p>
      </li>
      <!-- 方式 -->
      <li>
        <p class="name">{{dataList.type_string =='支出'?'付款方式':'收款方式'}}</p>
        <p class="content">{{dataList.total_money-dataList.paid_money == '0' ?'全额付款':'分期付款'}}</p>
      </li>
      <!-- 类别 -->
      <li>
        <p class="name">
          {{dataList.type_string =='支出'?'支出类别':'收入类别'}}
        </p>
        <p class="content">
          {{dataList.category_name}}
        </p>
      </li>
      <!-- 状态 -->
      <li>
        <p class="name">
          结清状态
        </p>
        <p class="content"
           :class="dataList.type_string=='支出'?'cashout_status': 'cashin_status'">
          {{Number(dataList.total_money)-Number(dataList.paid_money) == 0 ?'已结清':'未结清('+(Number(dataList.total_money)-Number(dataList.paid_money)).toFixed(2)+')'}}
        </p>
      </li>
      <!-- 支付凭证 -->
      <li v-for="(item,index) in dataList.items"
          :key="index"
          v-show="!nocash"
          class="nofenqi">
        <p>{{dataList.type_string =='支出'?'支出':'收入'}}凭证</p>
        <div class="nofenqi-box">
          <div class="nofenqi-imgbox">
            <van-uploader :after-read="afterRead"
                          multiple
                          :name="dataList.id"
                          @delete="delImg"
                          v-model="dataList.items[index].images" />
          </div>
          <van-icon name="arrow" />
        </div>
      </li>

      <!-- 分期 -->
      <ul v-show="nocash">
        <li class="fenqi"
            v-for="(item,index) in dataList.items"
            :key="index">
          <p class="fenqi-box fenqi-title">第{{index+1}}笔{{dataList.type_string =='支出'?'付款':'收款'}}</p>
          <!-- 付款金额 -->
          <div class="fenqi-box">
            <p class="name">
              {{dataList.type_string =='支出'?'付款金额':'收款金额'}}
            </p>
            <p class="content cashout_gold"
               @click="showFenQiGoldPopup"
               :id="dataList.items[index].id">
              <input type="text"
                     v-model="golditem[index].money">
              <van-icon name="arrow" />
            </p>
            <!-- 收付款金额弹出层 -->
            <van-popup v-model="showFenQiGold">
              <van-cell-group class="gold-popup">
                <van-field v-model="fenqigold"
                           placeholder="请输入金额"
                           :label="dataList.type_string =='支出'?'付款金额':'收款金额'" />
                <van-button type="primary"
                            @click="editFenQi">确认</van-button>
                <van-button type="info"
                            @click="hidden">取消</van-button>
              </van-cell-group>
            </van-popup>
          </div>
          <!-- 付款账户 -->
          <div class="fenqi-box">
            <p class="name">{{dataList.type_string =='支出'?'付款账户':'收款账户'}}</p>
            <p class="content"
               :itemId="dataList.items[index].id"
               :id="golditem[index].account_id"
               :name="dataList.type_string"
               @click="showAccountPopup(golditem[index].account_id,dataList.items[index].id)">
              {{golditem[index].account_name}}
              <van-icon name="arrow" />
            </p>
            <!-- 账户弹出层 -->
            <van-popup v-model="showAccount">
              <van-cell-group>
                <p>
                  {{dataList.type_string =='支出'?'付款账户':'收款账户'}}
                </p>
                <van-radio-group v-model="radio"
                                 checked>
                  <van-radio :name="item.id"
                             v-for="(item,index) in typelist"
                             :key="index">{{item.name}}</van-radio>
                </van-radio-group>
                <van-button type="primary"
                            @click="editFenQiAccount">确认修改</van-button>
              </van-cell-group>
            </van-popup>
          </div>
          <!-- 凭证 -->
          <div class="fenqi-box">
            <p>{{dataList.type_string =='支出'?'支出':'收入'}}凭证</p>
            <div class="box">
              <div class="imgbox">
                <van-uploader :after-read="afterRead"
                              multiple
                              :name="dataList.items[index].id"
                              v-model="dataList.items[index].images" />
              </div>
              <van-icon name="arrow" />
            </div>
          </div>
          <!-- 付款日期 -->
          <div class="fenqi-box">
            <p>{{dataList.type_string =='支出'?'付款日期':'收款日期'}}</p>
            <p class="content"
               :id="dataList.items[index].id"
               @click="showDatePopup">
              {{golditem[index].date}}
              <van-icon name="arrow" />
            </p>
          </div>
        </li>
      </ul>
      <!-- 备注 -->
      <p class="beizhu">备注</p>
      <li class="beizhu-content">
        <van-cell-group :class="{'changeInfo':!status}">
          <van-field v-model="message"
                     :readonly="status"
                     placeholder="暂无备注"
                     type="textarea" />
        </van-cell-group>
        <van-icon name="arrow" />
      </li>
      <!-- 记账人 -->
      <li>
        <p class="name">
          记账人
        </p>
        <p class="content">
          {{dataList.user_nickname}}
        </p>
      </li>
      <!-- 记账日期 -->
      <li>
        <p class="name">
          记账日期
        </p>
        <p class="content">
          {{dataList.created_at}}
        </p>
      </li>
      <!-- 更新日期 -->
      <li>
        <p class="name">
          更新日期
        </p>
        <p class="content">
          {{dataList.created_at}}
        </p>
      </li>
    </ul>
    <!-- 保存 -->
    <van-button class="save"
                type="primary"
                size="large"
                v-show="!status"
                @click="save">保存</van-button>
    <!-- 编辑 -->
    <van-button class="edit"
                icon="edit"
                @click="edit"></van-button>
    <!-- 后续首付款 -->
    <van-button v-show="nocash"
                class="save"
                type="primary"
                size="large"
                :to="'/follow/'+cashType+record_id">{{dataList.type_string =='支出'?'后续付款':'后续收款'}}</van-button>
    <div class="footer"></div>
    <!-- 日期 -->
    <van-popup v-model="showDate"
               position="bottom">
      <van-datetime-picker v-model="currentDate"
                           type="date"
                           @cancel="hidden"
                           @confirm="editDate" />
    </van-popup>
    <!-- 返回 -->
    <van-button class="back"
                name="arrow-left"
                @click="back"
                icon="arrow-left"></van-button>
  </div>
</template>
<script>
import Vue from 'vue'
import { Icon, Field, Button, Uploader, Image, Popup, RadioGroup, Radio, DatetimePicker, Toast } from 'vant'
import Qs from 'qs'

Vue.use(Toast)
Vue.use(DatetimePicker)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Field)
Vue.use(Popup)
Vue.use(Image)
Vue.use(Uploader)
Vue.use(Button)
Vue.use(Field)
Vue.use(Icon)
export default {
  inject: ['reload'],
  data () {
    return {
      dataList: {},
      message: '',
      total_money: '',
      company_name: '',
      nocash: false,
      golditem: [],
      fileList: [],
      showFenQiGold: false,
      fenqigold: '',
      itemId: '',
      showAccount: false,
      showDate: false,
      radio: '',
      typelist: [],
      currentDate: new Date(),
      record_id: '',
      cashType: '',
      status: true,
      Toast: '',
    }
  },
  created () {
    // 获取记账单条详情
    this.axios('/api/record/detail?id=' + this.$route.params.id + '&token=' + localStorage.getItem('accessToken')).then((data) => {
      this.message = data.data.data.remark === '' ? '' : data.data.data.remark
      this.total_money = data.data.data.total_money
      this.company_name = data.data.data.company_name
      this.record_id = data.data.data.items[0].record_id
      console.log(data)

      if ((this.total_money - data.data.data.paid_money) != 0) {
        this.nocash = true
      }
      this.dataList = data.data.data
      this.dataList.items = JSON.parse(JSON.stringify(this.dataList.items).replace(/\boriginal\b/g, 'url'))
      if (this.dataList.type_string == '支出') {
        this.cashType = '2'
      } else {
        this.cashType = '1'
      }
      this.golditem = this.dataList.items
    }).catch((error) => {
      this.$toast({
        message: '网络异常,请重试！'
      })
      return error
    })
    this.axios.get('/api/account?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.typelist = data.data.data
    }).catch((error) => {
      this.$toast({
        message: '网络异常,请重试！'
      })
      return error
    })
  },
  methods: {
    // 分期金额弹出框
    showFenQiGoldPopup (_this) {
      this.showFenQiGold = true
      this.itemId = _this.path[1].id
    },
    // 账户弹出框
    showAccountPopup (accountId, itemId) {
      this.showAccount = true
      this.itemId = itemId
      this.radio = accountId
    },
    // 日期弹出框
    showDatePopup (_this) {
      this.showDate = true
      this.itemId = _this.path[0].id
    },
    // 获取图片
    afterRead (file, name) {
      console.log(name)
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
      var promise = new Promise((resolve, reject) => {
        let url1 = '/api/upload/image?token=' + localStorage.getItem('accessToken')
        this.axios.post(url1, params, config)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            this.$toast({
              message: '网络异常,请重试！'
            })
            return err
          })
      })
      promise.then((res) => {
        let url2 = '/api/record/item/update?itemId=' + name.name + '&token=' + localStorage.getItem('accessToken')
        this.axios.post(url2, Qs.stringify({
          image_keys: res.data.data.file.fileKey
        })).then((res) => {
          this.data = res.data.data
          console.log(res)
          if (res.data.code == '0') {
            this.$toast({
              message: '上传成功'
            })
          } else {
            this.dataList.items[0].images.pop()
            console.log(this.dataList.items[0].images)
            this.$toast({
              message: res.data.data
            })
          }
        }).catch((err) => {
          this.$toast({
            message: '网络异常,请重试！'
          })
          return err
        })
      })
    },
    delImg () {
      console.log('删除')
    }
    ,
    // 修改记帐单条详情
    save () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/record/update?id=' + this.$route.params.id + '&token=' + localStorage.getItem('accessToken'), Qs.stringify({
        total_money: this.total_money,
        company_name: this.company_name,
        remark: this.message
      })).then((data) => {
        if (data.data.code == 0) {
          this.$toast(data.data.data)
          this.status = true
        } else {
          this.$toast(data.data.data)
        }
        this.reload();
      }).catch((error) => {
        this.$toast({
          message: '操作出现异常'
        })
        return error
      })
    },
    // 修改分期单条详情
    editFenQi () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      if (this.fenqigold == '') {
        this.$toast('请输入金额')
        return false
      }
      this.axios.post('/api/record/item/update?itemId=' + this.itemId + '&token=' + localStorage.getItem('accessToken'), Qs.stringify({
        money: this.fenqigold
      })).then((data) => {
        if (data.data.code == 0) {
          this.$toast(data.data.data)
          this.reload()
        } else {
          this.$toast(data.data.data)
        }
      })
    },
    // 修改分期账户
    editFenQiAccount () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      this.axios.post('/api/record/item/update?itemId=' + this.itemId + '&token=' + localStorage.getItem('accessToken'), Qs.stringify({
        account_id: this.radio
      })).then((data) => {
        if (data.data.code == 0) {
          this.$toast(data.data.data)
          this.reload()
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
    // 修改时间
    editDate (value) {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      value = value.toLocaleDateString().replace(/\//g, '-')
      this.axios.post('/api/record/item/update?itemId=' + this.itemId + '&token=' + localStorage.getItem('accessToken'), Qs.stringify({
        date: value
      })).then((data) => {
        if (data.data.code == '0') {
          this.showDate = false
          this.$toast({
            message: '修改成功'
          })
          this.reload()
        } else {
          this.$toast({
            message: '修改失败'
          })
        }
      }).catch((error) => {
        this.$toast({
          message: '网络异常,请重试'
        })
        return error
      })
    },
    // 开始修改状态
    edit () {
      this.status = false
      this.$toast('修改状态已开,可修改名称,交易对象和备注,点击保存即可完成修改')
    },
    // 取消
    hidden () {
      this.showFenQiGold = false
      this.showDate = false
    },
    // 返回
    back () {
      window.history.go(-1)
    }

  },
  computed: {
    imglist: function (element) {
      return JSON.parse(JSON.stringify(element).replace(/\boriginal\b/g, 'url'))
    }
  }
}
</script>
<style lang="less">
#payment-list {
  margin-bottom: 50px;
  background: #f5f5f5;
  .title {
    background-color: #00b355;
    height: 50px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin-bottom: 20px;
    p {
      line-height: 50px;
      color: #fff;
    }
  }
  .payment-box {
    .nofenqi-box {
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      overflow: hidden;
      .van-uploader__wrapper {
        display: flex;
        justify-content: flex-end;
      }
      i {
        color: #a7a7a7;
      }
    }
    .beizhu {
      text-align: left;
      color: #a7a7a7;
      padding: 10px;
    }
    .beizhu-content {
      margin-bottom: 30px;
      i {
        color: #a7a7a7;
      }
      textarea {
        color: #aaa;
      }
    }
    .fenqi {
      .van-popup {
        width: 80%;
        border-radius: 6px;
        padding: 10px;
        .van-radio {
          padding: 10px;
        }
        .gold-popup {
          padding: 15px;
          box-sizing: border-box;
          .van-field {
            padding-bottom: 20px;
          }
          button {
            margin: 10px;
          }
        }
      }
      .fenqi-box {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        border-bottom: 1px solid #f2f2f2;
        .content {
          color: #a7a7a7;
        }
        .box {
          width: 80%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
          i {
            color: #a7a7a7;
          }
          .imgbox {
            padding-right: 10px;
            .van-uploader__wrapper {
              display: flex;
              justify-content: flex-end;
            }
          }
        }
        p {
          display: flex;
          align-items: center;
          .van-uploader__upload {
            margin: 0 10px;
          }
        }
        padding: 15px;
        input {
          border: none;
          text-align: right;
        }
      }
      .fenqi-title {
        background-color: #f5f5f5;
        padding: 5px 15px;
        color: #a7a7a7;
      }
    }
    li:not(.fenqi) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;
      background-color: #fff;
      padding: 15px;
      .van-cell-group {
        width: 100%;
      }
      .name {
        text-align: left;
      }
      .content {
        display: flex;
        color: #a7a7a7;
        justify-content: flex-end;
        align-items: center;
        padding-left: 10px;
        input {
          border: none;
          text-align: right;
          padding-right: 10px;
        }
      }
      [class*="van-hairline"]::after {
        border: none;
      }
    }
    .cashin_gold,
    .cashin_status {
      color: #ed5566;
      i {
        color: #a7a7a7;
      }
    }
    .cashout_gold,
    .cashout_status {
      color: #00b355 !important;
      i {
        color: #a7a7a7 !important;
      }
    }
  }
  .van-uploader__wrapper {
    .van-uploader__preview {
      .van-icon-delete {
        display: none;
      }
    }
  }
  .save {
    margin-top: 20px;
    width: 95%;
  }
  .edit {
    position: absolute;
    top: 4px;
    right: 5px;
    background-color: transparent;
    border: 1px solid transparent;
    color: #fff;
  }
  .back {
    position: absolute;
    top: 4px;
    left: 5px;
    background-color: transparent;
    border: 1px solid transparent;
    color: #fff;
  }
  .changeInfo {
    color: #4caf50;
    textarea {
      color: #4caf50 !important;
    }
  }
  .footer {
    height: 50px;
  }
}
</style>
