<script setup>
import { ref, onErrorCaptured } from "vue";
import BookingModal from "./components/BookingModal.vue";
import AccessibilityMenu from "./components/AccessibilityMenu.vue";
import WhatsAppWidget from "./components/WhatsAppWidget.vue";
const error = ref(false);
onErrorCaptured(() => {
  error.value = true;
  return false;
});
</script>
<template>
  <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
  <div v-if="error" class="not-found" role="alert">
    <h1>Não foi possível carregar esta página.</h1>
    <p>Verifique sua conexão e tente novamente.</p>
    <a class="button" href="/">Recarregar</a>
  </div>
  <RouterView v-else /><BookingModal /><AccessibilityMenu /><WhatsAppWidget />
</template>
