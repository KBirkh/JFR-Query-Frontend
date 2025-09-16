<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// v-model support + output prop
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  output: {
    type: Array,
    default: [{ testField: 'testValue' }, { testField2: 'testValue2' }],
  },
  columns: {
    type: Array,
    default: [{ field: 'testField' }, { field: 'testField2' }],
  },
})
const emit = defineEmits(['update:modelValue'])
const isDraggingHoriz = ref(false)
const isDraggingVert = ref(false)
const tocWidth = ref(320)
const topcont = ref(null)
const topHeight = ref(300)
const outer = ref(null)
const events = ref(null)

function horizdown(e) {
  console.log('horizdown', e)
  isDraggingHoriz.value = true
  document.body.style.userSelect = 'none'
}

function vertdown(e) {
  console.log('vertdown', e)
  isDraggingVert.value = true
  document.body.style.userSelect = 'none'
}

function onMouseMove(e) {
  if (isDraggingHoriz.value && topcont.value) {
    const rect = topcont.value.getBoundingClientRect()
    let newWidth = e.clientX - rect.left - 20
    // clamp widths so both panes remain usable
    const min = 320
    const max = Math.max(rect.width - 320, min)
    if (newWidth < min) newWidth = min
    if (newWidth > max) newWidth = max
    tocWidth.value = newWidth
  } else if (isDraggingVert.value && outer.value) {
    const rect = outer.value.getBoundingClientRect()
    let newHeight = e.clientY - rect.top - 20
    // clamp heights so both panes remain usable
    const min = 200
    const max = Math.max(rect.height - min, min)
    if (newHeight < min) newHeight = min
    if (newHeight > max) newHeight = max
    topHeight.value = newHeight
  }
}

function onMouseUp() {
  if (isDraggingHoriz.value || isDraggingVert.value) {
    isDraggingHoriz.value = false
    isDraggingVert.value = false
    document.body.style.userSelect = ''
  }
}

async function initEvents() {
  try {
    const res = await fetch('http://localhost:8080/showEvents', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
    })

    if (!res.ok) {
      events.value = `Error: ${res.status} ${res.statusText}`
      return
    }

    const ct = res.headers.get('content-type') || ''
    let data
    if (ct.includes('application/json')) {
      data = await res.json()
      let processed = ''
      for (const event of data.events) {
        processed += `${event.name}\n`
      }
      events.value = processed
    } else {
      data = await res.text()
      events.value = data
    }
  } catch (err) {
    events.value = `Fetch error: ${err.message}`
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  initEvents()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>
<template>
  <div class="outer" ref="outer">
    <div class="topcont" ref="topcont" :style="{ height: topHeight + 'px' }">
      <div class="toc" :style="{ flexBasis: tocWidth + 'px' }">
        <textarea
          class="tocarea"
          placeholder="Table of contents"
          :value="events"
          readonly
        ></textarea>
      </div>
      <div class="horizhandler" @mousedown="horizdown"></div>
      <div class="inputwrap">
        <textarea
          class="input"
          :value="props.modelValue"
          @input="(e) => emit('update:modelValue', e.target.value)"
          placeholder="Enter query ..."
        ></textarea>
      </div>
    </div>
    <div class="verthandler" @mousedown="vertdown"></div>
    <div class="outputwrap">
      <DataTable class="output" :value="props.output">
        <Column
          v-for="col of props.columns"
          :key="col.field"
          :field="col.field"
          :header="col.field"
        ></Column>
      </DataTable>
      <!-- <textarea class="output" placeholder="Output ..." readonly :value="props.output"></textarea> -->
    </div>
  </div>
</template>

<style scoped>
.horizhandler {
  width: 5px;
  cursor: ew-resize;
  background-color: var(--color-border);
  border-radius: 3px;
}

.verthandler {
  height: 5px;
  cursor: ns-resize;
  background-color: var(--color-border);
  border-radius: 3px;
  margin: 1rem 0;
}

.outer {
  /* make outer fill the viewport (accounting for header/shell and #app padding) */
  height: calc(100vh - 8rem);
  min-height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* prevent page scrolling */
}
.topcont {
  display: flex;
  width: 100%;
  /* let top container size by explicit inline height (topHeight) */
  flex: 0 0 auto;
  gap: 1rem;
  align-items: stretch; /* children stretch to same height */
  min-height: 0; /* allow children to shrink inside flex */
}

/* keep a fixed-width table-of-contents and let the input area fill remaining space */
.topcont > .toc {
  flex: 0 0 auto;
}
.topcont > .inputwrap {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0; /* allow textarea to shrink inside flex */
}

.input {
  flex: 1 1 auto; /* fill the inputwrap fully */
  width: 100%;
  min-height: 0; /* allow textarea to size by flex, not by content */
  resize: none;
  box-sizing: border-box;
}

.tocarea {
  width: 100%;
  height: 100%;
  resize: none;
  min-height: 0;
  box-sizing: border-box;
}

.outputwrap {
  display: flex;
  /* take remaining vertical space below topcont */
  flex: 1 1 0;
  min-height: 0;
  overflow: auto; /* allow scrolling when DataTable is taller than the container */

  /* keep a visible background/border while scrolling */
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem;
  box-sizing: border-box;
}

.output {
  width: 100%;
  /* let the DataTable fill the outputwrap height */
  height: 100%;
  min-height: 100%;
  flex: 1 1 0;
  box-sizing: border-box;
  background: transparent; /* container provides background */
}

/* textarea theming */
.input,
.output,
.tocarea {
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  border-radius: 6px;
  caret-color: hsl(160, 100%, 37%);
  outline: none;
}

.input:focus,
.output:focus,
.tocarea:focus {
  box-shadow: 0 0 0 4px rgba(60, 180, 120, 0.08);
  border-color: var(--color-border-hover);
}
</style>
