<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const irParaPersonal = () => {
  router.push('/personal')
}

const irParaAluno = () => {
  router.push('/aluno')
}

const irParaAgendamento = () => {
  router.push('/agendamento')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<template>
    <button @click="logout">Sair</button>
  <div>
    <button @click="irParaPersonal">Ir para Personal</button>
    <button @click="irParaAluno" style="margin-left: 10px;">Ir para Aluno</button>
    <button @click="irParaAgendamento" style="margin-left: 10px;">Ir para Agendamento</button>
  </div>
</template>