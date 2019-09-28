<template>
  <div id="accounst">
    <!-- 头部 -->
    <m-head></m-head>
    <!-- 账户资产 -->
    <van-row>
      <van-col span="4">
        <van-icon name="balance-o"
                  color="#FCC43C">
        </van-icon>
      </van-col>
      <van-col span="10">账户资产</van-col>
      <van-col span="10"
               class="icon">
        <van-button icon="arrow"
                    type="default"
                    to="/Info"></van-button>
      </van-col>
    </van-row>
    <!-- 收入类别 -->
    <van-row>
      <van-col span="4">
        <van-icon name="orders-o"
                  color="#FE473F">
        </van-icon>
      </van-col>
      <van-col span="10">收入类别</van-col>
      <van-col span="10"
               class="icon">
        <van-button icon="arrow"
                    type="default"
                    to="/cashType/1"></van-button>
      </van-col>
    </van-row>
    <!-- 支出类别 -->
    <van-row>
      <van-col span="4">
        <van-icon name="orders-o"
                  color="#00BE9D">
        </van-icon>
      </van-col>
      <van-col span="10">支出类别</van-col>
      <van-col span="10"
               class="icon">
        <van-button icon="arrow"
                    type="default"
                    to="/cashType/2"></van-button>
      </van-col>
    </van-row>
    <!-- 记账成员 -->
    <van-row>
      <van-col span="4">
        <van-icon name="friends-o"
                  color="#0098DA">
        </van-icon>
      </van-col>
      <van-col span="10">记账成员</van-col>
      <van-col span="10"
               class="icon">
        <van-button icon="arrow"
                    type="default"
                    to="/number"></van-button>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { Row, Col, Button } from 'vant'
import mHead from '../components/head'

Vue.use(Button)
Vue.use(Row).use(Col)
export default {
  data () {
    return {
      nickname: ''
    }
  },
  components: {
    mHead
  },
  created () {
    this.nickname = localStorage.getItem('personInfo')
  }
}
</script>
<style lang="less" >
#accounst {
  .van-row {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 10px 0px;
    margin-bottom: 20px;
    .van-button {
      border: none;
    }
    .icon {
      text-align: right;
      button {
        width: 100%;
        text-align: right;
      }
    }
  }
  .van-col:nth-of-type(1) {
    display: flex;
    padding-left: 10px;
    i {
      font-size: 25px;
    }
  }
  .van-col:nth-of-type(2) {
    text-align: left;
  }
}
</style>
