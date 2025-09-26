<script setup>
import { ref } from 'vue'
import Input from '../components/Input.vue'
import Shell from '../components/Shell.vue'
import Sidebar from '@/components/Sidebar.vue'
import { Toast } from 'primevue'
import { useToast } from 'primevue'

const query = ref('')
const topHeight = ref(300)
const output = ref([])
const columns = ref([])
const toast = useToast()

// calls to the backend and puts JSON Data into the output and column fields
async function execute() {
  console.log('Execute query in parent:', query.value)
  try {
    const payload = JSON.stringify({ query: query.value })
    // debug: log the exact payload we're sending so we can inspect escaping
    console.debug('POST /query payload:', payload)
    const res = await fetch('http://localhost:8080/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: payload,
    })

    if (!res.ok) {
      output.value = [{ error: `Error: ${res.status} ${res.statusText}` }]
      columns.value = [{ field: 'error' }]
      return
    }

  // debug: capture raw response text for easier troubleshooting
  const rawText = await res.clone().text()
  console.debug('POST /query raw response text:', rawText)

  const ct = res.headers.get('content-type') || ''
    let data
    if (ct.includes('application/json')) {
      data = await res.json()
      // expect data.header.columns (array of column names) and data.data (array of rows)
      const arr = []
      if (data && data.header && Array.isArray(data.header.columns)) {
        for (const colName of data.header.columns) {
          arr.push({ field: colName })
        }
      }
      columns.value = arr.length ? arr : []
      output.value = Array.isArray(data.data) ? data.data : []
    } else {
      data = await res.text()
      output.value = [{ output: data }]
      columns.value = [{ field: 'output' }]
    }
  } catch (err) {
    output.value = [{ error: `Fetch error: ${err.message}` }]
    columns.value = [{ field: 'error' }]
  }
  // update the URL 'query' parameter to reflect the executed statement
  try {
    const params = new URLSearchParams(window.location.search)
    // let URLSearchParams handle percent-encoding for us
    params.set('query', query.value)
    const newUrl = window.location.pathname + '?' + params.toString()
    window.history.replaceState({}, '', newUrl)
  } catch (e) {
    // ignore URL errors
  }
}

// shows a toast depending on the status uf the call to the backend
// realized in backend by limiting the result size of the Query to 1MB to save time
async function checkSemantic() {
  console.log('Check semantics in parent:', query.value)
  try {
    const res = await fetch('http://localhost:8080/semanticCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: JSON.stringify({ query: query.value }),
    })

    if (!res.ok) {
      console.log('Semantic Check Failed')
      toast.add({
        severity: 'error',
        summary: 'Semantic Check Failed',
        detail: `Error: ${res.status} ${res.statusText}`,
        life: 3000,
      })
      return
    } else {
      console.log('Semantic Check Passed')
      toast.add({
        severity: 'success',
        summary: 'Semantic Check Passed',
        detail: 'No issues found.',
        life: 3000,
      })
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Fetching from Backend failed',
      detail: `Fetch error: ${err.message}`,
      life: 3000,
    })
  }
}
</script>

<template>
  <main class="layout">
    <div class="content">
      <Toast class="toast" />
      <Shell />
      <Input
        v-model="query"
        :top-height="topHeight"
        @update:topHeight="(val) => (topHeight = val)"
        :output="output"
        :columns="columns"
      />
    </div>
    <!-- execute and checkSemantic function calls are emitted from the Sidebar component
        necessary for access to the textareas in the Input component  -->
    <Sidebar @execute="execute" :button-top="topHeight" @checkSemantic="checkSemantic" />
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.toast {
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 1rem;
}
</style>
