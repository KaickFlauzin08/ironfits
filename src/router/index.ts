import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../components/LoginView.vue'
import Home from '../components/Home.vue'
import Personal from '../components/Personal.vue'
import Aluno from '../components/Aluno.vue'
import Agendamento from '../components/Agendamento.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/personal',
    name: 'personal',
    component: Personal
  },
  {
    path: '/aluno',
    name: 'aluno',
    component: Aluno
  },
  {
    path: '/agendamento',
    name: 'agendamento',
    component: Agendamento
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router