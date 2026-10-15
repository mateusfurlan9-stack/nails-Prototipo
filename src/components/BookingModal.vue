<script setup>
import { computed, ref, watch, nextTick } from "vue";
import Modal from "./Modal.vue";
import Icon from "./Icon.vue";
import { useBooking } from "../composables/useBooking";
import { siteConfig as c } from "../config/siteConfig";
import {
  money,
  localDate,
  bookingMessage,
  whatsappUrl,
} from "../utils/booking";
const { visible, requested, close } = useBooking();
const selection = ref(""),
  name = ref(""),
  date = ref(""),
  time = ref(""),
  ready = ref(false),
  copied = ref(false),
  error = ref(""),
  summary = ref(),
  today = ref(localDate());
watch(visible, (value) => {
  if (value) {
    selection.value = requested.value?.id || "";
    name.value = "";
    date.value = "";
    time.value = "";
    ready.value = false;
    copied.value = false;
    error.value = "";
    today.value = localDate();
  }
});
const items = computed(() => [
  ...c.services,
  ...c.promotions.filter((p) => !p.validUntil || p.validUntil >= localDate()),
]);
const item = computed(() => items.value.find((s) => s.id === selection.value));
const message = computed(() =>
  bookingMessage({
    item: item.value,
    name: name.value,
    date: date.value,
    time: time.value,
    demo: c.demo,
  }),
);
const url = computed(() => whatsappUrl(c.contact.whatsapp, message.value));
watch(ready, async (value) => {
  await nextTick();
  if (value) summary.value?.focus();
  else if (visible.value) document.getElementById("service")?.focus();
});
function review() {
  if (date.value && date.value < localDate()) {
    error.value = "Escolha uma data de hoje em diante.";
    return;
  }
  error.value = "";
  ready.value = true;
}
async function copy() {
  try {
    await navigator.clipboard.writeText(message.value);
    copied.value = true;
  } catch {
    copied.value = false;
    error.value =
      "Não foi possível copiar automaticamente. Selecione e copie o resumo acima.";
  }
}
</script>
<template>
  <Modal :open="visible" label="Solicitar agendamento" @close="close"
    ><div class="booking">
      <p class="eyebrow">SEU MOMENTO DE CUIDADO</p>
      <h2>Vamos escolher<br />seu próximo estilo?</h2>
      <p>
        Envie uma solicitação. A data e o valor serão confirmados pelo estúdio.
      </p>
      <form v-if="!ready" @submit.prevent="review">
        <label for="service">Procedimento</label
        ><select id="service" v-model="selection">
          <option value="">Quero orientação para escolher</option>
          <option v-for="s in items" :key="s.id" :value="s.id">
            {{ s.name }} · {{ money(s.price) }}
          </option>
        </select>
        <p v-if="item" class="field-note">
          {{ item.description }}
          <span v-if="item.duration"
            >Duração estimada: {{ item.duration }} min.</span
          >
        </p>
        <label for="client-name">Seu nome <span>(opcional)</span></label
        ><input
          id="client-name"
          v-model="name"
          autocomplete="given-name"
          maxlength="80"
          placeholder="Como podemos chamar você?"
        />
        <div class="form-grid">
          <div>
            <label for="date">Preferência de data</label
            ><input id="date" v-model="date" type="date" :min="today" />
          </div>
          <div>
            <label for="time">Preferência de horário</label
            ><select id="time" v-model="time">
              <option value="">A combinar</option>
              <option>Manhã</option>
              <option>Tarde</option>
              <option>Final do dia</option>
            </select>
          </div>
        </div>
        <p class="notice" v-if="c.demo">
          Demonstração: preços e durações ilustrativos. Não há agenda conectada.
        </p>
        <p v-if="error" role="alert">{{ error }}</p>
        <button class="button full" type="submit">
          Conferir solicitação <Icon name="arrow" />
        </button>
      </form>
      <div v-else>
        <h3 ref="summary" tabindex="-1">Seu resumo</h3>
        <p class="message-preview">{{ message }}</p>
        <p class="notice" role="status" v-if="!url">
          WhatsApp ainda não configurado. Nenhuma mensagem será enviada. Este é
          um ambiente de demonstração.
        </p>
        <a
          v-if="url"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="button full"
          ><Icon name="whatsapp" /> Enviar solicitação pelo WhatsApp</a
        ><button v-else class="button full" @click="copy">
          {{ copied ? "Mensagem copiada" : "Copiar solicitação de exemplo" }}
        </button>
        <p v-if="error" role="alert">{{ error }}</p>
        <p v-if="copied" role="status">Mensagem copiada.</p>
        <button class="text-button" @click="ready = false">
          Voltar e editar
        </button>
      </div>
    </div></Modal
  >
</template>
