<script setup>
import { defineEmits, defineProps } from 'vue'
const emit = defineEmits(['execute'])
const props = defineProps({
  buttonTop: {
    type: Number,
    default: null,
  },
})

function handleExecuteQuery() {
  emit('execute')
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-head">
      <h2>Sidebar</h2>
    </div>
    <div class="sidebar-body">
      <p>This is a sidebar component.</p>
      <button class="execute-btn" @click="handleExecuteQuery" type="button">Execute query</button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  /* position in layout as a left column, not fixed above everything */
  position: relative; /* allow absolute positioning of the footer */
  height: 100%;
  width: 260px;
  flex: 0 0 260px;
  min-width: 220px;

  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 0.5rem;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-head {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-body {
  flex: 1 1 auto;
  overflow: auto;
  margin-bottom: 0.5rem;
}

/* remove unused footer styles - keep for backward compatibility if needed */
.sidebar-foot {
  display: none;
}

.execute-btn {
  background: hsl(160, 100%, 37%);
  color: white;
  border: 0;
  padding: 0.75rem 1rem; /* larger button */
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 220px;
  margin-top: 1rem;
}

.execute-btn:hover {
  filter: brightness(0.95);
}

.execute-btn:focus {
  outline: 3px solid rgba(60, 180, 120, 0.18);
  outline-offset: 2px;
}
</style>
