<template>
  <div id="cash">
    <!-- 账面支出/收入 -->
    <van-row>
      <van-col span="12">
        <slot name="cashName"></slot>
      </van-col>
      <van-col span="12">
        <slot name="cashGold"></slot>
      </van-col>
    </van-row>
    <!-- 交易对象 -->
    <van-row>
      <van-col span="12">交易对象</van-col>
      <slot name="company_name"></slot>
    </van-row>
    <!-- 收/付款方式 -->
    <van-row>
      <van-col span="12">
        <slot name="cashMode"></slot>
      </van-col>
      <van-col span="12">
        <slot name="cashModeMenu"></slot>
      </van-col>
    </van-row>
    <!-- 首笔付款 -->
    <van-row id="firstcash">
      <van-col span="12">
        <slot name="first"></slot>
      </van-col>
      <van-col span="12">
        <slot name="firstGold"></slot>
      </van-col>
    </van-row>
    <!-- 收/付款账户 -->
    <van-row>
      <van-col span="12">
        <slot name="cashAccount"></slot>
      </van-col>
      <van-col span="12">
        <slot name="cashAccountMenu"></slot>
      </van-col>
    </van-row>
    <!-- 收/支出类别 -->
    <van-row>
      <van-col span="12">
        <slot name="cashCategory"></slot>
      </van-col>
      <van-col span="12">
        <slot name="cashCategoryMenu"></slot>
      </van-col>
    </van-row>
    <!-- 收/付款日期 -->
    <van-row>
      <van-col span="12">
        <slot name="cashDate"></slot>
      </van-col>
      <van-col span="12">
        <slot name="cashDateMenu"></slot>
      </van-col>
    </van-row>
    <!-- 上传凭证 -->
    <van-row>
      <van-col span="12">
        <slot name="cashVoucher"></slot>
      </van-col>
      <van-col span="12">
        <slot name="cashVoucherImg"></slot>
      </van-col>
    </van-row>
    <!-- 备注 -->
    <van-row>
      <slot name="cashRemark"></slot>
    </van-row>
  </div>
</template>
<script>

export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="less">
</style>
