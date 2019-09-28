<template>
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
</template>
<script>
export default {

}
</script>
<style lang="less">
</style>