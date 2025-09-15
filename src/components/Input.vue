<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// v-model support
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const isDraggingHoriz = ref(false)
const isDraggingVert = ref(false)
const tocWidth = ref(320)
const topcont = ref(null)
const topHeight = ref(300)
const outer = ref(null)

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

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
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
        <textarea class="tocarea" placeholder="Table of contents" readonly></textarea>
      </div>
      <div class="horizhandler" @mousedown="horizdown"></div>
      <div class="inputwrap">
        <textarea
          class="input"
          :value="modelValue"
          @input="(e) => emit('update:modelValue', e.target.value)"
          placeholder="Enter query ..."
        ></textarea>
      </div>
    </div>
    <div class="verthandler" @mousedown="vertdown"></div>
    <div class="outputwrap">
      <textarea class="output" placeholder="Output ..." readonly></textarea>
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
  /* make outer fill the viewport (accounting for #app's 1rem padding top+bottom and shell height/margin) */
  height: calc(100vh - 7rem);
  min-height: calc(100vh - 7rem);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* prevent page scrolling */
}
.topcont {
  display: flex;
  width: 100%;
  /* let top container grow to fill available vertical space inside .outer */
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

.input:focus {
  outline: none;
  border-color: var(--color-primary);
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
  /* keep output below top and do not force page scroll */
  flex: 1 1 0;
  overflow: hidden;
}

.output {
  width: 100%;
  height: auto;
  flex: 1 1 0;
  resize: none;
  min-height: 0;
  box-sizing: border-box;
}
</style>
