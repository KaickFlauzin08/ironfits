<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const senha = ref('')

const carregando = ref(false)
const erro = ref<string | null>(null)
const sucesso = ref(false)

const fazerLogin = async () => {
  carregando.value = true
  erro.value = null
  sucesso.value = false

  try {
    const resposta = await fetch('http://localhost:5188/api/Login/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value
      })
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      throw new Error(dados.error || dados.message || 'Falha ao autenticar')
    }

    localStorage.setItem('token', dados.token)
    sucesso.value = true

    // Redireciona para a página Home
    await router.push('/home')
  } catch (err: any) {
    erro.value = err.message
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div>
    <h2>Login</h2>

    <p v-if="carregando">Entrando...</p>
    <p v-if="erro" style="color: red;">Erro: {{ erro }}</p>
    <p v-if="sucesso" style="color: green;">Login realizado com sucesso!</p>

    <form @submit.prevent="fazerLogin" novalidate>
      <div>
        <label for="email">E-mail:</label>
        <input 
          id="email"
          type="text" 
          v-model="email" 
          required 
        />
      </div>

      <br />

      <div>
        <label for="senha">Senha:</label>
        <input 
          id="senha"
          type="password" 
          v-model="senha" 
          required 
        />
      </div>

      <br />

      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Aguarde...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>