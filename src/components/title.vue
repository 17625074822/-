<template>
  <div id="title">
    <p class="title-text">
      <slot></slot>
    </p>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="less">
#title {
  height: 65px;
  font-size: 20px;
  color: #fff;
  background-color: #00b355;
  margin-bottom: 20px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  .title-text {
    line-height: 65px;
    text-align: center;
    color: #fff;
    font-size: 20px;
  }
}
</style>
