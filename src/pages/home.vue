<template>
  <div class="detail">
    <!-- 头部  -->
    <m-head></m-head>
    <!-- 导航表示-->
    <div class="account-nav">
      <van-icon name="qr" />
      <van-icon name="tosend" />
      <van-icon name="circle" />
      <van-icon name="chart-trending-o" />
      <van-icon name="bar-chart-o" />
    </div>
    <van-pull-refresh v-model="isLoading"
                      @refresh="onRefresh">
      <!-- 账面收支  -->
      <ul class="account-wrap">
        <!--账面收支 -->
        <li class="account-title">
          <p>账面收支 {{month}}</p>
        </li>
        <!-- 账面收入 -->
        <li class="account-item">
          <van-button type="default"
                      size="large"
                      to="/payment/1">
            <van-row>
              <van-col span="16">
                <p class="account-item-text">
                  账面收入
                </p>
              </van-col>
              <van-col span="6">
                <p class="cashin">
                  {{cashin}}
                </p>
              </van-col>
              <van-col span="2"
                       class="right-arrow">
                <van-icon name="arrow" />
              </van-col>
            </van-row>
          </van-button>
        </li>
        <!-- 账面支出 -->
        <li>
          <van-button type="default"
                      size="large"
                      to="/payment/1">
            <van-row>
              <van-col span="16">
                <p class="account-item-text">
                  账面支出
                </p>
              </van-col>
              <van-col span="6">
                <p class="cashout">
                  {{cashout}}
                </p>
              </van-col>
              <van-col span="2"
                       class="right-arrow">
                <van-icon name="arrow" />
              </van-col>
            </van-row>
          </van-button>
        </li>
        <!-- 账面利润 -->
        <li>
          <van-button type="default"
                      size="large"
                      to="/payment/1">
            <van-row>
              <van-col span="16">
                <p class="account-item-text">
                  账面利润
                </p>
              </van-col>
              <van-col span="6">
                <p class="profit">
                  {{profit}}
                </p>
              </van-col>
              <van-col span="2"
                       class="right-arrow">
                <van-icon name="arrow" />
              </van-col>
            </van-row>
          </van-button>
        </li>
      </ul>
      <!-- 待收待付 -->
      <ul class="account-wrap">
        <!--账面收支 -->
        <li class="account-title">
          <p>待收/待付</p>
        </li>
        <!-- 待收款 -->
        <li class="account-item">
          <van-button type="default"
                      size="large"
                      to="/nocashin">
            <van-row>
              <van-col span="16">
                <p class="account-item-text">
                  待收款
                </p>
              </van-col>
              <van-col span="6">
                <p class="cashin">
                  {{nocashin}}
                </p>
              </van-col>
              <van-col span="2"
                       class="right-arrow">
                <van-icon name="arrow" />
              </van-col>
            </van-row>
          </van-button>
        </li>
        <!-- 待付款 -->
        <li>
          <van-button type="default"
                      size="large"
                      to="/nocashout">
            <van-row>
              <van-col span="16">
                <p class="account-item-text">
                  待付款
                </p>
              </van-col>
              <van-col span="6">
                <p class="cashout">
                  {{nocashout}}
                </p>
              </van-col>
              <van-col span="2"
                       class="right-arrow">
                <van-icon name="arrow" />
              </van-col>
            </van-row>
          </van-button>
        </li>
      </ul>
    </van-pull-refresh>
    <!-- 记账按钮 -->
    <div class="footer">
      <van-button type="primary"
                  size="large"
                  to="/record">记&nbsp;一&nbsp;笔&nbsp;</van-button>
    </div>

    <div class="footer-box">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import mHead from '../components/head'
import { Toast, Icon, SwipeCell, Row, Col, PullRefresh } from 'vant'

Vue.use(PullRefresh)
Vue.use(Toast)
Vue.use(Row).use(Col)
Vue.use(SwipeCell)
Vue.use(Icon)
export default {
  inject: ['reload'],
  data () {
    return {
      nickname: '',
      month: '',
      cashin: 0,
      cashout: 0,
      nocashin: 0,
      nocashout: 0,
      accountlist: [],
      profit: 0,
      Toast: '',
      isLoading: false
    }
  },
  components: {
    mHead
  },
  created () {
    // 获取个人数据
    this.axios.get('/api/view/home?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.cashin = (Number(data.data.data.cash.in) + Number(data.data.data.waitingForCollection)).toFixed(2)
      this.cashout = (Number(data.data.data.cash.out) + Number(data.data.data.waitingForPayment)).toFixed(2)
      this.nocashin = data.data.data.waitingForCollection
      this.nocashout = data.data.data.waitingForPayment
      this.month = data.data.data.cash.month
      this.profit = (this.cashin - this.cashout).toFixed(2)
      if (data.data.code == '0') {
        return true
      } else {
        this.$toast({
          message: '数据加载失败，请稍后重试！！！'
        })
      }
    }).catch((error) => {
      this.$toast({
        message: '数据异常'
      })
      return error
    })
  },
  methods: {
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.reload()
      }, 500)
    }
  }
}
</script>
<style lang="less">
.detail {
  margin-bottom: 50px;
  .account-nav {
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    padding: 15px;
    i {
      font-size: 20px;
      color: #a9a9a9;
    }
  }
  .account-wrap {
    li {
      .van-row {
        display: flex;
        align-items: center;
        .right-arrow {
          display: flex;
          justify-content: center;
        }
      }
    }
    .account-title {
      color: #9e9e9e;
      font-size: 14px;
      padding: 10px;
      text-align: left;
    }
    .van-button--large {
      height: 60px;
    }
    .account-item-text {
      text-align: left;
      padding-left: 10px;
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
  .footer {
    .van-button {
      width: 95%;
      margin-top: 20px;
    }
  }
  .footer-box {
    height: 50px;
  }
}
</style>
