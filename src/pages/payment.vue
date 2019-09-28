<template>
  <div id="payment">
    <van-row class="head">
      <p class="title">账面收支明细</p>
      <van-col span="8">
        <van-button to="/payment/1"
                    @click="monthActive"
                    ref="month"
                    :style="month">当月收支</van-button>
      </van-col>
      <van-col span="8">
        <van-button to="/payment/2"
                    ref="quarter"
                    @click="quarterActive"
                    :style="quarter">季度收支</van-button>
      </van-col>
      <van-col span="8">
        <van-button to="/payment/3"
                    ref="year"
                    @click="yearActive"
                    :style="year">年度收支</van-button>
      </van-col>
    </van-row>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading"
                      @refresh="onRefresh">
      <van-row>
        <!-- 月份 -->
        <van-col span="24">
          <p class="payment-month">
            <span>{{paymentTitle}} :</span>
            <span class="month-text">{{startMonth}} 至 {{endMonth}}</span>
          </p>
        </van-col>
      </van-row>
      <!-- 账面收支信息 -->
      <van-row class="account-info">
        <van-col span="12">
          <p>
            <span>账面收入 :</span>
            <span class="cashin">{{cashin}}</span>
          </p>
        </van-col>
        <van-col span="12">
          <p>
            <span>账面利润 :</span>
            <span class="profit">{{profit}}</span>
          </p>
        </van-col>
        <van-col span="12">
          <p>
            <span>账面支出 :</span>
            <span class="cashout">{{cashout}}</span>
          </p>
        </van-col>
      </van-row>
      <!-- 明细 -->
      <van-list v-model="loading"
                :finished="finished"
                class="payment-wrap"
                finished-text="没有更多了"
                @load="onLoad">
        <li v-for="(item,index) in  list"
            :key="index">
          <van-button type="default"
                      size="large"
                      slot="default"
                      :to="'/changePayment/'+item.id">
            <van-row class="payment-info">
              <van-swipe-cell :on-close="onClose"
                              :name="item.id">
                <van-cell>
                  <van-col span="6"
                           class="cash-imgbox">
                    <img v-if="item.type_string == '支出'"
                         src="../assets/img/支出.png"
                         alt="">
                    <img v-if="item.type_string == '收入'"
                         src="../assets/img/收入.png"
                         alt="">
                    <p>{{item.date.substring(5)}}</p>
                  </van-col>
                  <van-col span="6"
                           class="middle-content">
                    <p>{{item.company_name==''?'[无]':item.company_name}}</p>
                    <p class="nocashin"
                       v-if="(item.total_money != item.paid_money)&&item.type_string=='支出'">待付款:{{(Number(item.total_money)-Number(item.paid_money)).toFixed(2)}}</p>
                    <p class="nocashout"
                       v-else-if="(item.total_money != item.paid_money)&&item.type_string=='收入'">待收款:{{(Number(item.total_money)-Number(item.paid_money)).toFixed(2)}}</p>
                    <p class="cash-remark"
                       v-else>
                      {{item.remark}}
                    </p>
                  </van-col>
                  <van-col span="10"
                           class="payment-gold">
                    <p>{{item.total_money}}</p>

                  </van-col>
                  <van-col span="2"
                           class="right-icon">
                    <van-icon name="arrow" />
                  </van-col>
                </van-cell>
                <p slot="right">
                  <van-button square
                              type="danger"
                              text="删除" />
                </p>
              </van-swipe-cell>
            </van-row>
          </van-button>
        </li>
      </van-list>
    </van-pull-refresh>

    <!-- 筛选 -->
    <van-button class="choose"
                icon="search"
                to="/choose"></van-button>

  </div>
</template>
<script>
import Vue from 'vue'
import { Toast, Dialog, Row, Col, Button, List, PullRefresh } from 'vant'

Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Toast)
Vue.use(Button)
Vue.use(Row).use(Col)
export default {
  inject: ['reload'],
  data () {
    return {
      isLoading: false,
      list: [],
      loading: false,
      finished: false,
      show: false,
      paymentTitle: '当月',
      paymentList: [],
      pathId: '',
      startMonth: '',
      endMonth: '',
      cashin: 0,
      cashout: 0,
      nocashin: 0,
      nocashout: 0,
      profit: 0,
      month: {},
      quarter: {},
      year: {},
      Toast: ''
    }
  },
  methods: {
    //删除
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
            for (let i = 0; i < this.paymentList.length; i++) {
              if (parseInt(this.paymentList[i].id) == name.name) {
                this.paymentList.splice(i, 1)
                i--
              }
            }
            this.axios.post('/api/record/delete?id=' + name.name + '&token=' + localStorage.getItem('accessToken')).then((data) => {
              if (data.data.code == '0') {
                this.$toast(data.data.data)
                this.reload()
              } else {
                this.$toast(data.data.data)
              }
            }).catch((error) => {
              this.$toast('网络异常,请重试!')
              return error
            })
            instance.close()
          })
          break
      }
    },
    monthActive () {
      this.month = {
        color: '#00b355',
        background: '#fff'
      }
      this.year = {
        background: '#00b355',
        color: '#fff'
      }
      this.quarter = {
        background: '#00b355',
        color: '#fff'
      }
    },
    quarterActive () {
      this.quarter = {
        color: '#00b355',
        background: '#fff'
      }
      this.month = {
        background: '#00b355',
        color: '#fff'
      }
      this.year = {
        background: '#00b355',
        color: '#fff'
      }
    },
    yearActive () {
      this.year = {
        background: '#fff',
        color: '#00b355'
      }
      this.month = {
        background: '#00b355',
        color: '#fff'
      }
      this.quarter = {
        background: '#00b355',
        color: '#fff'
      }
    },
    // 获取路径id
    getPath () {
      this.pathId = this.$route.params.id
      let date = new Date()
      // 季度
      if (this.pathId == 2) {
        this.paymentTitle = '季度'
        if (date.getMonth() >= 1 && date.getMonth() <= 3) {
          this.startMonth = date.getFullYear() + '-' + '01-01'
          this.endMonth = date.getFullYear() + '-' + '03-31'
        } else if (date.getMonth() >= 4 && date.getMonth() <= 6) {
          this.startMonth = date.getFullYear() + '-' + '04-01'
          this.endMonth = date.getFullYear() + '-' + '07-31'
        } else if (date.getMonth() >= 7 && date.getMonth() <= 9) {
          this.startMonth = date.getFullYear() + '-' + '07-01'
          this.endMonth = date.getFullYear() + '-' + '09-30'
        } else {
          this.startMonth = date.FullgetYear() + '-' + '10-01'
          this.endMonth = date.FullgetYear() + '-' + '12-31'
        }
        this.list = []
        this.finished = false;
        // 获取季度明细列表
        this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
          params: {
            begin_date: this.startMonth,
            end_date: this.endMonth,
            excel: '0',
            page: '1'
          }
        }).then((data) => {
          this.cashin = data.data.data.in
          this.cashout = data.data.data.out
          this.profit = (this.cashin - this.cashout).toFixed(2)
          this.paymentList = data.data.data.list
          this.getPaymentList(2, this.startMonth, this.endMonth)
          this.loading = true;
          if (this.loading == true) {
            this.onLoad()
          }
        }).catch((error) => {
          this.$toast('数据异常')
          return error
        })
      } else if (this.pathId == 3) {
        // 年份
        this.list = []
        this.finished = false;
        this.paymentTitle = '年度'
        this.startMonth = date.getFullYear() + '-' + '01' + '-' + '01'
        this.endMonth = date.getFullYear() + '-' + '12' + '-' + '31'
        // 获取年度明细列表
        this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
          params: {
            begin_date: this.startMonth,
            end_date: this.endMonth,
            excel: '0',
            page: '1'
          }
        }).then((data) => {
          this.cashin = data.data.data.in
          this.cashout = data.data.data.out
          this.profit = (this.cashin - this.cashout).toFixed(2)
          this.paymentList = data.data.data.list
          this.getPaymentList(2, this.startMonth, this.endMonth)
          this.loading = true;
          if (this.loading == true) {
            this.onLoad()
          }
        }).catch((error) => {
          this.$toast('数据异常')
          return error
        })
      } else {
        this.reload()
      }
    },
    // 下拉加载列表
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        if (this.paymentList == []) {
          this.finished = true
        } else {
          // 数据全部加载完成
          for (let i = 0; i < 10; i++) {
            if (this.list.length >= this.paymentList.length) {
              this.finished = true
              break
            }
            this.list.push(this.paymentList[this.list.length])
          }
          // 加载状态结束
          this.loading = false
        }
      }, 500)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.finished = false;
        this.list = [],
          this.paymentList = [],
          this.getPaymentList(1, this.startMonth, this.endMonth)
        this.loading = true;
        if (this.loading == true) {
          this.onLoad()
        }
      }, 1000)
    },
    // 请求数据列表
    getPaymentList (page, begin_date, end_date) {
      this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
        params: {
          begin_date: begin_date,
          end_date: end_date,
          excel: '0',
          page: page
        }
      }).then((data) => {
        if (data.data.data.list.length == '0') {
          return false
        } else {
          this.paymentList = this.paymentList.concat(data.data.data.list)
          this.loading = true;
          this.finished = false;
          if (this.loading == true) {
            this.onLoad()
          }
          page++
          this.getPaymentList(page, begin_date, end_date)
        }
      }).catch((error) => {
        return error
      })
    }
  },
  //页面初始化
  created () {
    this.pathId = this.$route.params.id
    this.startMonth = this.$route.params.begin_date
    this.endMonth = this.$route.params.end_date
    if (this.pathId == '4') {
      this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
        params: {
          begin_date: this.$route.params.begin_date,
          end_date: this.$route.params.end_date,
          type: this.$route.params.type,
          category_id: this.$route.params.category_id,
          excel: 0,
          page: 1
        }
      }).then((data) => {
        this.paymentList = data.data.data.list
        this.cashin = data.data.data.in
        this.cashout = data.data.data.out
        this.profit = (this.cashin - this.cashout).toFixed(2)
        this.getPaymentList(2, this.startMonth, this.endMonth)
      }).catch((error) => {
        this.$toast('数据异常')
        return error
      })
    } else {
      let date = new Date()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(date.getFullYear(), month, 0)
      this.startMonth = date.getFullYear() + '-' + month + '-' + '01'
      this.endMonth = date.getFullYear() + '-' + month + '-' + day.getDate()
      // 获取当月明细列表
      this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
        params: {
          excel: '0',
          page: '1'
        }
      }).then((data) => {
        if (data.data.data.list.length == '0') {
          this.list = data.data.data.list
          return false;
        } else {
          this.paymentList = data.data.data.list
          this.getPaymentList(2, this.startMonth, this.endMonth)
          this.loading = true;
          if (this.loading == true) {
            this.onLoad();
          }
        }
      }).catch((error) => {
        this.$toast('数据异常')
        return error
      })
      this.axios.get('/api/view/home?token=' + localStorage.getItem('accessToken')).then((data) => {
        this.cashin = (Number(data.data.data.cash.in) + Number(data.data.data.waitingForCollection)).toFixed(2)
        this.cashout = (Number(data.data.data.cash.out) + Number(data.data.data.waitingForPayment)).toFixed(2)
        this.nocashin = data.data.data.waitingForCollection
        this.nocashout = data.data.data.waitingForPayment
        this.profit = (this.cashin - this.cashout).toFixed(2)
      }).catch((error) => {
        this.$toast('数据异常')
        return error
      })
    }
  },
  watch: {
    '$route': 'getPath'
  },
  mounted () {
    this.pathId = this.$route.params.id
    if (this.pathId == 1) {
      // 筛选
      this.$refs.month.style.background = '#fff'
      this.$refs.month.style.color = '#00b355'
    }
  }

}
</script>
<style lang="less" >
#payment {
  margin-bottom: 50px;
  .head {
    height: 124px;
    font-size: 20px;
    color: #fff;
    background-color: #00b355;
    margin-bottom: 20px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    .title {
      padding: 17px 0px;
    }
    .van-button {
      background-color: #00b355;
      color: #fff;
      border-radius: 10px;
      font-weight: 500;
    }
    .van-button--default {
      border: 2px solid #ffffff;
    }
  }
  .payment-month {
    text-align: left;
    padding-left: 10px;
    padding-bottom: 20px;
    .month-text {
      color: #00b355;
    }
  }
  .payment-wrap {
    li {
      .van-button--large {
        height: 100%;
      }
    }
    .payment-info {
      padding: 5px;
      background-color: #fff;
      .cash-imgbox {
        img {
          width: 32px;
        }
      }
      .van-cell__value {
        height: 100%;
      }
      .middle-content {
        width: 100%;
        overflow: hidden;
        // align-self: stretch;

        & p:nth-child(1) {
          margin-bottom: 10px;
        }
        p {
          padding: 1px 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .nocashout {
          display: initial;
          border-radius: 15px;
          border: 2px solid #ed5566;
          color: #ed5566;
          font-weight: 500;
        }
        .nocashin {
          display: initial;
          border-radius: 15px;
          border: 2px solid #00b355;
          color: #00b355;
          font-weight: 500;
        }
        .cash-remark {
          color: #999999;
          font-size: 12px;
        }
      }
      .van-swipe-cell {
        width: 100%;
        .van-swipe-cell__wrapper {
          padding-bottom: 1px;
        }
        .van-cell:not(:last-child)::after {
          border: none;
        }
        .van-cell__value {
          display: flex;
          align-items: center;
        }
        p {
          overflow: hidden;
        }
      }
      i {
        font-size: 30px;
      }
      .payment-gold {
        text-align: right;
      }
      .van-swipe-cell__right {
        p {
          height: 100%;
          button {
            height: 100%;
          }
        }
      }
      .right-icon {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        i {
          font-size: 18px;
        }
      }
    }
    .payment-month {
      text-align: left;
      padding: 10px;
      .date-text {
        color: #00b355;
      }
    }
  }
  .account-info {
    padding-bottom: 10px;
    p {
      text-align: left;
      padding-left: 10px;
      padding-bottom: 5px;
    }
    .cashin {
      color: #ed5566;
    }
    .cashout {
      color: #00b355;
    }
    .profit {
      color: #f6bb42;
    }
  }
  .choose {
    position: absolute;
    top: 12px;
    right: 10px;
    background-color: transparent;
    border: none;
    color: #fff;
    i {
      font-size: 25px;
    }
  }
}
</style>
