<script setup>
import { ref } from 'vue'
import Input from '../components/Input.vue'
import Shell from '../components/Shell.vue'

const query = ref('')

function execute() {
  // placeholder, will be called by Shell via emitted event
  console.log('Execute query in parent:', query.value)
}
</script>

<template>
  <main>
    <Shell @execute="execute" />
    <Input v-model="query" />
  </main>
</template>
