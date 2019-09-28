<template>
  <div id="choose">
    <m-title>账面收支筛选</m-title>
    <div class="date-box box">

      <!-- 开始时间 -->
      <van-row>
        <van-col span="12">
          <P>开始日期</P>
        </van-col>
        <van-col span="12">
          <van-button class="date-text"
                      @click="startDatePopup">
            {{start}}
          </van-button>
        </van-col>
      </van-row>

      <!-- 结束时间 -->
      <van-row>
        <van-col span="12">
          <P>结束日期</P>
        </van-col>
        <van-col span="12">
          <van-button class="date-text"
                      @click="endDatePopup">
            {{end}}
          </van-button>
        </van-col>
      </van-row>
    </div>
    <!-- 收入支出类别 -->
    <div class="category-box box">
      <van-row>
        <van-col span="12">收入支出</van-col>
        <van-col span="12">
          <van-dropdown-menu>
            <van-dropdown-item v-model="typeValue"
                               :options="type"
                               @change="getType" />
          </van-dropdown-menu>
        </van-col>
      </van-row>
      <!-- 类别 -->
      <van-row>
        <van-col span="12">收支类别</van-col>
        <van-col span="12">
          <van-dropdown-menu>
            <van-dropdown-item v-model="categoryValue"
                               :options="category" />
          </van-dropdown-menu>
        </van-col>
      </van-row>
    </div>
    <!-- 筛选 -->
    <van-button size="large"
                type="primary"
                class="shaixuan"
                @click="choose">
      筛选
    </van-button>
    <!-- 返回 -->
    <van-button icon="arrow-left"
                class="back"
                @click="back">
    </van-button>
    <!-- 开始时间弹框 -->
    <van-popup v-model="startDate"
               position="bottom">
      <van-datetime-picker v-model="currentStartDate"
                           @confirm="getStartDate"
                           @cancel="hidden"
                           type="date" />
    </van-popup>
    <!-- 结束时间时间弹框 -->
    <van-popup v-model="endDate"
               position="bottom">
      <van-datetime-picker v-model="currentEndtDate"
                           @confirm="getEndDate"
                           @cancel="hidden"
                           type="date" />
    </van-popup>
  </div>
</template>
<script>
import mTitle from '../components/title'
import Vue from 'vue'
import { Popup, DatetimePicker, Row, Col, DropdownMenu, DropdownItem, Toast } from 'vant'
Vue.use(Toast)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(DatetimePicker)
Vue.use(Row).use(Col)
Vue.use(Popup)
export default {
  components: {
    mTitle
  },
  data () {
    return {
      Toast: '',
      categorylist: [],
      current: new Date(),
      currentEndtDate: new Date(),
      currentStartDate: new Date(),
      endDate: false,
      startDate: false,
      start: '',
      end: '',
      typeValue: 3,
      categoryValue: '',
      type: [
        { text: '不限', value: 3 },
        { text: '收入', value: 1 },
        { text: '支出', value: 2 }
      ],
      category: [
        { text: '不限', value: '' }
      ]
    }
  },
  methods: {
    startDatePopup () {
      this.startDate = true
    },
    endDatePopup () {
      this.endDate = true
    },
    getStartDate (value) {
      this.startDate = false
      this.start = value.toLocaleDateString().replace(/\//g, '-')
    },
    getEndDate (value) {
      this.endDate = false
      this.end = value.toLocaleDateString().replace(/\//g, '-')
    },
    hidden () {
      this.startDate = false
      this.endDate = false
    },
    getType (value) {
      if (value == 3) {
        this.category = [{ text: '不限', value: '' }]
        return false
      }
      this.typeValue = value
      this.axios.get('/api/category?token=' + localStorage.getItem('accessToken'), {
        params: {
          type: value,
          dataType: '1'
        }
      }).then((data) => {
        for (const iterator of data.data.data) {
          this.category.push(JSON.parse(JSON.stringify(iterator).replace(/\bid\b/g, 'value').replace(/\bname\b/g, 'text')))
        }
      }).catch((error) => {
        this.$toast('数据异常')
        return error
      })
    },
    choose () {
      this.$router.push({
        name: 'payment',
        params: {
          id: '4',
          begin_date: this.start,
          end_date: this.end,
          type: this.typeValue,
          category_id: this.categoryValue,
          excel: 0,
          page: 1
        }
      })
    },
    back () {
      window.history.go(-1)
    }
  },
  created () {
    let date = new Date()
    this.start = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + '01'
    let day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    this.end = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + day
  }
}
</script>
<style lang="less">
#choose {
  .box {
    background-color: #fff;
    .van-row {
      display: flex;
      align-items: center;
      [class*="van-hairline"]::after {
        border: none;
      }
      border-bottom: 1px solid #f2f2f2;
      padding: 10px;
    }
    button {
      border: none;
      width: 100%;
      text-align: center;
    }
  }
  .shaixuan {
    width: 95%;
    margin-top: 20px;
  }
  .back {
    position: absolute;
    top: 11px;
    left: 13px;
    background-color: transparent;
    border: none;
    color: #fff;
  }
}
</style>
