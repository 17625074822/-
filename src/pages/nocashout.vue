<template>
  <div id="paymentout">
    <van-row class="head">
      <p class="title">账面收支明细</p>
      <van-col span="8">
        <van-button to="/nocashout"
                    class="init-month"
                    @click="monthActive"
                    :style="month">当月待付</van-button>
      </van-col>
      <van-col span="8">
        <van-button to="/nocashout/2"
                    @click="quarterActive"
                    :style="quarter">季度待付</van-button>
      </van-col>
      <van-col span="8">
        <van-button to="/nocashout/3"
                    @click="yearActive"
                    :style="year">年度待付</van-button>
      </van-col>
    </van-row>
    <!-- 账面收支信息 -->
    <van-row class="nocash-info">
      <p>
        总待付金额 :
        <span>
          {{datalist.waitingForPayment}}
        </span>
      </p>
    </van-row>
    <!-- 明细 -->
    <ul class="payment-wrap">
      <li v-for="(item,index) in paymentList"
          :key="index"
          v-show="item.total_money != item.paid_money && item.type=='2'">
        <van-button type="default"
                    size="large"
                    :to="'/changePayment/'+item.id">
          <van-row class="payment-info">
            <van-swipe-cell :on-close="onClose"
                            :name="item.id">
              <van-cell>
                <van-col span="6"
                         class="imgbox">
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
    </ul>

  </div>
</template>
<script>
import Vue from 'vue'
import { Dialog, Row, Col, Button } from 'vant'

Vue.use(Button)
Vue.use(Row).use(Col)
export default {
  inject: ['reload'],
  data () {
    return {
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
      status: '',
      datalist: []
    }
  },
  methods: {
    // clickPosition 表示关闭时点击的位置
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
            this.axios.post('/api/record/delete?id=' + name.name + '&token=' + localStorage.getItem('accessToken')).then((data) => {
              this.$toast({
                message: data.data.data
              })
              this.reload()
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
    getPath () {
      this.pathId = this.$route.params.id
      this.paymentTitle = '季度'
      let date = new Date()
      // 季度
      if (this.pathId == 2) {
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
        // 获取季度明细列表
        this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
          params: {
            begin_date: this.startMonth,
            end_date: this.endMonth,
            excel: '0',
            page: '1'
          }
        }).then((data) => {
          this.paymentList = data.data.data.list
        }).catch((error) => {
          this.$toast({
            message: '数据异常'
          })
          return error
        })
      } else if (this.pathId == 3) {
        // 年份
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
          this.paymentList = data.data.data.list
        }).catch((error) => {
          this.$toast({
            message: '数据异常'
          })
          return error
        })
      } else {
        // 获取月份明细列表
        this.paymentTitle = '当月'
        let month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        this.startMonth = date.getFullYear() + '-' + month + '-' + '01'
        var day = new Date(date.getFullYear(), month, 0)
        this.endMonth = date.getFullYear() + '-' + month + '-' + day.getDate()
        this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
          params: {
            excel: '0',
            page: '1'
          }
        }).then((data) => {
          this.paymentList = data.data.data.list
        }).catch((error) => {
          this.$toast({
            message: '数据异常'
          })
          return error
        })
      }
    }
  },
  created () {
    if (this.$route.params.id == '1') {
      this.status = '1'
    } else if (this.$route.params.id == '2') {
      this.status = '2'
    }
    let date = new Date()
    let month = date.getMonth() + 1
    this.startMonth = date.getFullYear() + '-' + month + '-' + '01'
    month = month < 10 ? '0' + month : month
    var day = new Date(date.getFullYear(), month, 0)
    this.endMonth = date.getFullYear() + '-' + month + '-' + day.getDate()
    // 获取当月明细列表
    this.axios.get('/api/record/account?token=' + localStorage.getItem('accessToken'), {
      params: {
        excel: '0',
        page: '1'
      }
    }).then((data) => {
      this.paymentList = data.data.data.list
    }).catch((error) => {
      this.$toast({
        message: '数据异常'
      })
      return error
    })
    this.axios.get('/api/view/home?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.datalist = data.data.data
      this.cashin = (Number(data.data.data.cash.in) + Number(data.data.data.waitingForCollection)).toFixed(2)
      this.cashout = (Number(data.data.data.cash.out) + Number(data.data.data.waitingForPayment)).toFixed(2)
      this.nocashin = data.data.data.waitingForCollection
      this.nocashout = data.data.data.waitingForPayment
      this.profit = (this.cashin - this.cashout).toFixed(2)
    }).catch((error) => {
      this.$toast({
        message: '数据异常'
      })
      return error
    })
  },
  watch: {
    '$route': 'getPath'
  }
}
</script>
<style lang="less" >
#paymentout {
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
    .init-month {
      color: #00b355;
      background-color: #fff;
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
      .imgbox {
        img {
          width: 32px;
        }
      }
      .middle-content {
        width: 100%;
        overflow: hidden;
        align-self: stretch;
        & p:nth-child(1) {
          margin-bottom: 10px;
        }
        p {
          padding: 0px 10px;
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
  .nocash-info {
    padding-bottom: 10px;
    p {
      text-align: text;
      padding-left: 10px;
      padding-bottom: 5px;
      font-size: 20px;
      span {
        color: #f6bb42;
        padding-left: 10px;
      }
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
}
</style>
