<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const voltar = () => {
  router.push('/home')
}

const nomeAluno = ref('')
const cpfAluno = ref('')
const alunos = ref<any[]>([])

const Url = 'http://localhost:5188/api/CadastroAluno'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// GET
const GetAluno = async () => {
  try {
    const res = await fetch(Url, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (!res.ok) throw new Error('Falha ao obter lista')
    alunos.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

// POST
const CadastrarAluno = async () => {
  if (!nomeAluno.value || !cpfAluno.value) return

  try {
    const res = await fetch(Url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: 0,
        nomeAluno: nomeAluno.value,
        cpfAluno: cpfAluno.value
      })
    })
    if (!res.ok) throw new Error('Falha ao cadastrar')

    LimparCampos()
    await GetAluno()
  } catch (err: any) {
    console.error(err.message)
  }
}

// PUT
const AtualizarAluno = async (item: any) => {
  const novoNome = prompt('Novo nome:', item.nomeAluno)
  const novoCpf = prompt('Novo CPF:', item.cpfAluno)

  if (!novoNome || !novoCpf) return

  try {
    const res = await fetch(Url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: item.id,
        nomeAluno: novoNome,
        cpfAluno: novoCpf
      })
    })
    if (!res.ok) throw new Error('Falha ao atualizar')

    await GetAluno()
  } catch (err: any) {
    console.error(err.message)
  }
}

// DELETE
const DeletarAluno = async (id: number) => {
  if (!confirm('Deseja excluir este aluno?')) return

  try {
    const res = await fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok) throw new Error('Falha ao excluir')

    await GetAluno()
  } catch (err: any) {
    console.error(err.message)
  }
}

const LimparCampos = () => {
  nomeAluno.value = ''
  cpfAluno.value = ''
}

onMounted(GetAluno)
</script>

<template>
  <button @click="voltar">Voltar para Home</button>
  <div>
    <h2>Cadastro de Aluno</h2>

    <form @submit.prevent="CadastrarAluno" novalidate>
      <div>
        <label for="nomeAluno">Nome:</label>
        <input type="text" id="nomeAluno" v-model="nomeAluno" required />
      </div>

      <div>
        <label for="cpfAluno">CPF:</label>
        <input type="text" id="cpfAluno" v-model="cpfAluno" required />
      </div>

      <button type="submit">Cadastrar</button>
    </form>

    <hr />

    <h2>Lista de Alunos</h2>

    <ul v-if="alunos.length > 0">
      <li v-for="item in alunos" :key="item.id" style="margin-bottom: 8px;">
        <strong>{{ item.nomeAluno }}</strong> - CPF: {{ item.cpfAluno }}
        <button @click="AtualizarAluno(item)" style="margin-left: 10px;">Editar</button>
        <button @click="DeletarAluno(item.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhum aluno cadastrado.</p>
  </div>
</template>