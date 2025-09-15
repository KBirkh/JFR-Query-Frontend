<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['execute'])

function handleExecuteQuery(e) {
  emit('execute')
}
</script>

<template>
  <div class="shell">
    <h1><b>JFR Query Tool</b></h1>
    <button class="execute-btn" @click="handleExecuteQuery" type="button">Execute query</button>
  </div>
</template>

<style scoped>
.shell {
  background-color: var(--color-background-soft);
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  padding: 1.25rem; /* slightly larger inner spacing */
  box-sizing: border-box;
  min-height: 4rem; /* larger minimum height to suit bigger text */
  display: flex;
  align-items: center; /* vertically center the text */
  justify-content: space-between; /* place heading on left and button on right */
}

.shell h1 {
  margin: 0; /* remove default h1 margins so padding controls spacing */
  font-size: 2rem; /* slightly larger heading */
  font-weight: 800;
}

.execute-btn {
  background: hsl(160, 100%, 37%);
  color: white;
  border: 0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}

.execute-btn:hover {
  filter: brightness(0.95);
}

.execute-btn:focus {
  outline: 3px solid rgba(60, 180, 120, 0.18);
  outline-offset: 2px;
}
</style>
