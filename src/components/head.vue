<template>
  <div id="head">
    <p class="title">
      {{book_name}}
    </p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      book_name: ''
    }
  },
  created () {
    // 获取账户信息
    this.axios.get('http://jizhang-api-dev.it266.com/api/book/get-default?token=' + localStorage.getItem('accessToken')).then((data) => {
      this.book_name = data.data.data.name
      localStorage.setItem('personInfo', this.book_name)
    }).catch((error) => {
      this.$toast({
        message: '数据异常'
      })
      return error
    })
  }
}
</script>
<style lang="less">
#head {
  height: 65px;
  font-size: 20px;
  color: #fff;
  background-color: #00b355;
  margin-bottom: 20px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  .title {
    line-height: 65px;
  }
}
</style>
