<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nomeAdmin = ref('')

onMounted(() => {
  // Busca o nome do admin salvo no localStorage ao carregar a tela
  nomeAdmin.value = localStorage.getItem('nomeAdmin') || 'Administrador'
})

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
  localStorage.removeItem('nomeAdmin') // Limpa o nome no logout
  router.push('/')
}
</script>

<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h1>Bem-vindo, {{ nomeAdmin }}!</h1>
    <button @click="logout">Sair</button>
  </div>

  <div style="margin-top: 20px;">
    <button @click="irParaPersonal">Ir para Personal</button>
    <button @click="irParaAluno" style="margin-left: 10px;">Ir para Aluno</button>
    <button @click="irParaAgendamento" style="margin-left: 10px;">Ir para Agendamento</button>
  </div>
</template>