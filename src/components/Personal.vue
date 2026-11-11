<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const voltar = () => {
  router.push('/home')
}

const nomePersonal = ref('')
const cpfPersonal = ref('')
const personais = ref<any[]>([])

const Url = 'http://localhost:5188/api/CadastroPersonal'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

//GET 
const GetPersonal = async () => {
  try {
    const res = await fetch(Url, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (!res.ok) throw new Error('Falha ao obter lista')
    personais.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

//POST
const CadastrarPersonal = async () => {
  if (!nomePersonal.value || !cpfPersonal.value) return

  try {
    const res = await fetch(Url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: 0,
        nomePersonal: nomePersonal.value,
        cpfPersonal: cpfPersonal.value
      })
    })
    if (!res.ok) throw new Error('Falha ao cadastrar')

    LimparCampos()
    await GetPersonal()
  } catch (err: any) {
    console.error(err.message)
  }
}

//PUT
const AtualizarPersonal = async (item: any) => {
  const novoNome = prompt('Novo nome:', item.nomePersonal)
  const novoCpf = prompt('Novo CPF:', item.cpfPersonal)

  if (!novoNome || !novoCpf) return

  try {
    const res = await fetch(Url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: item.id,
        nomePersonal: novoNome,
        cpfPersonal: novoCpf
      })
    })
    if (!res.ok) throw new Error('Falha ao atualizar')

    await GetPersonal()
  } catch (err: any) {
    console.error(err.message)
  }
}

//DELETE
const DeletarPersonal = async (id: number) => {
  if (!confirm('Deseja excluir este personal?')) return

  try {
    const res = await fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok) throw new Error('Falha ao excluir')

    await GetPersonal()
  } catch (err: any) {
    console.error(err.message)
  }
}

const LimparCampos = () => {
  nomePersonal.value = ''
  cpfPersonal.value = ''
}

onMounted(GetPersonal)
</script>

<template>
    <button @click="voltar">Voltar para Home</button>
  <div>
    <h2>Cadastro de Personal</h2>

    <form @submit.prevent="CadastrarPersonal" novalidate>
      <div>
        <label for="nomePersonal">Nome:</label>
        <input type="text" id="nomePersonal" v-model="nomePersonal" required />
      </div>

      <div>
        <label for="cpfPersonal">CPF:</label>
        <input type="text" id="cpfPersonal" v-model="cpfPersonal" required />
      </div>

      <button type="submit">Cadastrar</button>
    </form>

    <hr />

    <h2>Lista de Personais</h2>

    <ul v-if="personais.length > 0">
      <li v-for="item in personais" :key="item.id" style="margin-bottom: 8px;">
        <strong>{{ item.nomePersonal }}</strong> - CPF: {{ item.cpfPersonal }}
        <button @click="AtualizarPersonal(item)" style="margin-left: 10px;">Editar</button>
        <button @click="DeletarPersonal(item.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhum personal cadastrado.</p>
  </div>
</template>