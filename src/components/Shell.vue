<script setup>
// shell no longer emits execute — button moved to Sidebar
</script>

<template>
  <div class="shell">
    <h1><b>JFR Query Tool</b></h1>
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
  justify-content: flex-start;
}

.shell h1 {
  margin: 0; /* remove default h1 margins so padding controls spacing */
  font-size: 2rem; /* slightly larger heading */
  font-weight: 800;
}
</style>
