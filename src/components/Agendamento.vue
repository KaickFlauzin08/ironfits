<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const voltar = () => {
  router.push('/home')
}

const dataAgendamento = ref('')
const servico = ref('')
const alunoId = ref('')
const personalId = ref('')
const agendamentos = ref<any[]>([])

const Url = 'http://localhost:5188/api/Agendamento'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// GET
const GetAgendamentos = async () => {
  try {
    const res = await fetch(Url, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (!res.ok) throw new Error('Falha ao obter agendamentos')
    agendamentos.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

// POST
const CadastrarAgendamento = async () => {
  if (!dataAgendamento.value || !alunoId.value || !personalId.value) return

  try {
    const res = await fetch(Url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: 0,
        dataAgendamento: new Date(dataAgendamento.value).toISOString(),
        servico: servico.value,
        alunoId: Number(alunoId.value),
        personalId: Number(personalId.value)
      })
    })
    if (!res.ok) throw new Error('Falha ao cadastrar agendamento')

    LimparCampos()
    await GetAgendamentos()
  } catch (err: any) {
    console.error(err.message)
  }
}

// PUT
const AtualizarAgendamento = async (item: any) => {
  const novaData = prompt('Nova Data/Hora (AAAA-MM-DDTHH:mm):', item.dataAgendamento.substring(0, 16))
  const novoAlunoId = prompt('Novo ID do Aluno:', item.alunoId)
  const novoPersonalId = prompt('Novo ID do Personal:', item.personalId)
  const novoservico = prompt('Novo Serviço:', item.servico)

  if (!novaData || !novoAlunoId || !novoPersonalId || !novoservico) return

  try {
    const res = await fetch(Url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: item.id,
        dataAgendamento: new Date(novaData).toISOString(),
        servico: novoservico,
        alunoId: Number(novoAlunoId),
        personalId: Number(novoPersonalId)
      })
    })
    if (!res.ok) throw new Error('Falha ao atualizar agendamento')

    await GetAgendamentos()
  } catch (err: any) {
    console.error(err.message)
  }
}

// DELETE
const DeletarAgendamento = async (id: number) => {
  if (!confirm('Deseja excluir este agendamento?')) return

  try {
    const res = await fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok) throw new Error('Falha ao excluir agendamento')

    await GetAgendamentos()
  } catch (err: any) {
    console.error(err.message)
  }
}

const LimparCampos = () => {
  dataAgendamento.value = ''
  servico.value = ''
  alunoId.value = ''
  personalId.value = ''
}

onMounted(GetAgendamentos)
</script>

<template>
  <button @click="voltar">Voltar para Home</button>
  <div>
    <h2>Agendamento</h2>

    <form @submit.prevent="CadastrarAgendamento" novalidate>
      <div>
        <label for="data">Data/Hora:</label>
        <input type="datetime-local" id="data" v-model="dataAgendamento" required />
      </div>

      <div>
        <label for="alunoId">ID do Aluno:</label>
        <input type="number" id="alunoId" v-model="alunoId" required />
      </div>

      <div>
        <label for="personalId">ID do Personal:</label>
        <input type="number" id="personalId" v-model="personalId" required />
      </div>

      <div>
        <label for="servico">Serviço:</label>
        <input type="text" id="servico" v-model="servico" required />
      </div>

      <button type="submit">Agendar</button>
    </form>

    <hr />

    <h2>Lista de Agendamentos</h2>

    <ul v-if="agendamentos.length > 0">
      <li v-for="item in agendamentos" :key="item.id" style="margin-bottom: 8px;">
        <strong>Data:</strong> {{ item.dataAgendamento }} | 
        <strong>Aluno:</strong> {{ item.nomeAluno || item.alunoId }} | 
        <strong>Personal:</strong> {{ item.nomePersonal || item.personalId }} | 
        <strong>Serviço:</strong> {{ item.servico }}
        
        <button @click="AtualizarAgendamento(item)" style="margin-left: 10px;">Editar</button>
        <button @click="DeletarAgendamento(item.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhum agendamento encontrado.</p>
  </div>
</template>