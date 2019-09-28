<template>
  <ul class="payment-box">
    <!-- 账面收支 -->
    <li class="payment-item">
      <p class="name">
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
  </ul>
</template>
<script>
export default {

}
</script>
<style lang="less">
</style>