<template>
  <div id="back-button">
    <van-button @click="back"
                class="back"
                icon="arrow-left"></van-button>
  </div>
</template>
<script>
export default {
  methods: {
    back () {
      window.history.back(-1)
    }
  }
}
</script>
<style lang="less">
#add-button {
  .back {
    position: absolute;
    top: 12px;
    left: 13px;
    color: #fff;
    background-color: transparent;
    border: 1px solid transparent;
  }
}
</style>
