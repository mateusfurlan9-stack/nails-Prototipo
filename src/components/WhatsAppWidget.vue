<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import { useBooking } from "../composables/useBooking";
import { whatsappUrl } from "../utils/booking";
import Icon from "./Icon.vue";
const { open } = useBooking(),
  bubble = ref(false);
let timer;
function dismiss() {
  bubble.value = false;
  try {
    sessionStorage.setItem("luna-whatsapp-seen", "1");
  } catch {}
}
onMounted(() => {
  let seen = false;
  try {
    seen = sessionStorage.getItem("luna-whatsapp-seen") === "1";
  } catch {}
  if (!seen)
    timer = setTimeout(() => {
      if (!document.hidden) {
        bubble.value = true;
        try {
          sessionStorage.setItem("luna-whatsapp-seen", "1");
        } catch {}
      }
    }, c.widget.delay);
});
onUnmounted(() => clearTimeout(timer));
const url = whatsappUrl(
  c.contact.whatsapp,
  "Olá! Vim pelo site e gostaria de conhecer os serviços ou solicitar um agendamento.",
);
</script>
<template>
  <div class="whatsapp-widget">
    <Transition name="bubble"
      ><aside
        v-if="bubble"
        class="whatsapp-bubble"
        aria-label="Convite para contato"
      >
        <button
          class="icon-button"
          aria-label="Fechar convite"
          @click="dismiss"
        >
          <Icon name="close" />
        </button>
        <p>{{ c.widget.message }}</p>
        <button
          class="text-button"
          @click="
            dismiss();
            open();
          "
        >
          Vamos conversar <Icon name="arrow" />
        </button></aside></Transition
    ><a
      v-if="url"
      class="floating-button whatsapp-button"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp, abre em nova aba"
      ><Icon name="whatsapp" /></a
    ><button
      v-else
      class="floating-button whatsapp-button"
      aria-label="Abrir solicitação de agendamento pelo WhatsApp"
      @click="
        dismiss();
        open();
      "
    >
      <Icon name="whatsapp" />
    </button>
  </div>
</template>
