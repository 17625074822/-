import Vue from 'vue'
import Router from 'vue-router'
import Record from '../pages/record'
import Me from '../pages/me'
import Home from '../pages/home'
import Create from '../pages/create'
import Login from '../pages/login'
import Account from '../pages/account'
import Info from '../pages/info'
import CashType from '../pages/cashType'
import Payment from '../pages/payment'
import ChangePayment from '../pages/changePayment'
import ChangeTouXiang from '../pages/changetouxiang.vue'
import Book from '../pages/book'
import Numbers from '../pages/number'
import IdeaBack from '../pages/ideaback'
import Follow from '../pages/follow'
import Nocashin from '../pages/nocashin'
import Nocashout from '../pages/nocashout'
import Choose from '../pages/choose.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/me',
      name: 'me',
      component: Me
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/create',
      name: 'create',
      component: Create
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/record',
      name: 'record',
      component: Record
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/info',
      component: Info
    },
    {
      path: '/cashType/:id',
      component: CashType
    },
    {
      path: '/payment/:id',
      name: 'payment',
      component: Payment
    },
    {
      path: '/payment',
      component: Payment
    },
    {
      path: '/nocashin',
      component: Nocashin
    },
    {
      path: '/nocashin/:id',
      component: Nocashin
    },
    {
      path: '/nocashout',
      component: Nocashout
    },
    {
      path: '/nocashout/:id',
      component: Nocashout
    },
    {
      path: '/changePayment/:id',
      component: ChangePayment
    },
    {
      path: '/changetouxiang',
      component: ChangeTouXiang
    },
    {
      path: '/book',
      component: Book
    },
    {
      path: '/number',
      component: Numbers
    },
    {
      path: '/ideaback',
      component: IdeaBack
    },
    {
      path: '/follow/:id',
      component: Follow
    },
    {
      path: '/choose',
      component: Choose
    },
    {
      path: '*',
      redirect: '/',
      component: Login
    }
  ]
})
