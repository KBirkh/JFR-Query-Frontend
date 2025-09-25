<script setup>
import { ref } from 'vue'
import Input from '../components/Input.vue'
import Shell from '../components/Shell.vue'
import Sidebar from '@/components/Sidebar.vue'

const query = ref('')
const topHeight = ref(300)
const output = ref([])
const columns = ref([])

async function execute() {
  console.log('Execute query in parent:', query.value)
  try {
    const res = await fetch('http://localhost:8080/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: JSON.stringify({ query: query.value }),
    })

    if (!res.ok) {
      output.value = [{ error: `Error: ${res.status} ${res.statusText}` }]
      columns.value = [{ field: 'error' }]
      return
    }

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
</script>

<template>
  <main class="layout">
    <div class="content">
      <Shell />
      <Input
        v-model="query"
        :top-height="topHeight"
        @update:topHeight="(val) => (topHeight = val)"
        :output="output"
        :columns="columns"
      />
    </div>
    <Sidebar @execute="execute" :button-top="topHeight" />
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 1rem;
  align-items: stretch; /* let children stretch to full height */
}

.content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
</style>
