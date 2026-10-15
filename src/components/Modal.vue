<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import Icon from "./Icon.vue";
const props = defineProps({
  open: Boolean,
  label: String,
  variant: { type: String, default: "standard" },
});
const emit = defineEmits(["close", "keydown"]);
const dialog = ref();
let previous;
let disposed = false;
function syncLock() {
  document.body.classList.toggle(
    "dialog-open",
    Boolean(document.querySelector("dialog[open]")),
  );
}
watch(
  () => props.open,
  async (value) => {
    await nextTick();
    if (disposed || !dialog.value || value !== props.open) return;
    if (value) {
      previous = document.activeElement;
      if (!dialog.value.open) dialog.value.showModal();
      syncLock();
    } else {
      dialog.value.close();
      syncLock();
      if (previous?.isConnected && !document.querySelector("dialog[open]"))
        previous.focus?.({ preventScroll: true });
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  disposed = true;
  dialog.value?.close();
  syncLock();
  if (previous?.isConnected && !document.querySelector("dialog[open]"))
    previous.focus?.({ preventScroll: true });
});
function outside(event) {
  if (event.target !== dialog.value) return;
  const r = dialog.value.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    emit("close");
}
</script>
<template>
  <Teleport to="body"
    ><dialog
      ref="dialog"
      class="modal"
      :class="`modal-${variant}`"
      :aria-label="label"
      @cancel.prevent="emit('close')"
      @keydown="emit('keydown', $event)"
      @click="outside"
    >
      <div class="modal-toolbar">
        <span>{{ label }}</span
        ><button
          class="icon-button modal-close"
          aria-label="Fechar janela"
          @click="emit('close')"
        >
          <Icon name="close" />
        </button>
      </div>
      <slot /></dialog
  ></Teleport>
</template>
