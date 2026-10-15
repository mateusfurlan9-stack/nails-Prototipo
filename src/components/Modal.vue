<script setup>
import { ref, watch, nextTick, onUnmounted } from "vue";
import Icon from "./Icon.vue";
const props = defineProps({ open: Boolean, label: String });
const emit = defineEmits(["close"]);
const dialog = ref();
let previous;
watch(
  () => props.open,
  async (value) => {
    await nextTick();
    if (value) {
      previous = document.activeElement;
      dialog.value?.showModal();
      document.body.classList.add("dialog-open");
    } else {
      dialog.value?.close();
      document.body.classList.toggle(
        "dialog-open",
        Boolean(document.querySelector("dialog[open]")),
      );
      if (previous?.isConnected) previous.focus?.();
    }
  },
  { immediate: true },
);
onUnmounted(() => {
  document.body.classList.toggle(
    "dialog-open",
    Boolean(document.querySelector("dialog[open]")),
  );
  if (previous?.isConnected) previous.focus?.();
});
function outside(event) {
  if (event.target === dialog.value) {
    const r = dialog.value.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      emit("close");
  }
}
</script>
<template>
  <Teleport to="body"
    ><dialog
      ref="dialog"
      class="modal"
      :aria-label="label"
      @cancel.prevent="emit('close')"
      @click="outside"
    >
      <slot /><button
        class="icon-button modal-close"
        aria-label="Fechar janela"
        @click="emit('close')"
      >
        <Icon name="close" />
      </button></dialog
  ></Teleport>
</template>
