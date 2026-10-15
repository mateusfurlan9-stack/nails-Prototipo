<script setup>
import { ref, watch, onUnmounted } from "vue";
import Modal from "./Modal.vue";
import Icon from "./Icon.vue";

const open = ref(false);
const contrast = ref(false);
const underline = ref(false);
const readable = ref(false);
const size = ref(100);
const status = ref("");
const loading = ref(false);
const libras = ref(false);
const speaking = ref(false);
const paused = ref(false);
let widget;

const motion = ref(false);
watch(motion, (value) =>
  document.documentElement.classList.toggle("motion-off", value),
);
watch([contrast, underline, readable, size], () => {
  document.documentElement.classList.toggle(
    "accessible-contrast",
    contrast.value,
  );
  document.documentElement.classList.toggle(
    "accessible-links",
    underline.value,
  );
  document.documentElement.classList.toggle(
    "accessible-readable",
    readable.value,
  );
  document.documentElement.style.fontSize = `${size.value}%`;
});

function stopReading() {
  window.speechSynthesis?.cancel();
  speaking.value = false;
  paused.value = false;
}

function reset() {
  contrast.value = false;
  underline.value = false;
  readable.value = false;
  size.value = 100;
  motion.value = false;
  stopReading();
}

function readPage() {
  if (!("speechSynthesis" in window)) {
    status.value = "A leitura em voz alta não é compatível com este navegador.";
    return;
  }

  window.speechSynthesis.cancel();
  const text = document
    .querySelector("main")
    ?.innerText?.replace(/\s+/g, " ")
    .trim();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  utterance.onstart = () => {
    speaking.value = true;
    paused.value = false;
    status.value = "Leitura da página iniciada.";
  };
  utterance.onend = () => {
    speaking.value = false;
    paused.value = false;
    status.value = "Leitura concluída.";
  };
  utterance.onerror = () => {
    speaking.value = false;
    paused.value = false;
    status.value = "A leitura foi interrompida.";
  };
  window.speechSynthesis.speak(utterance);
}

function togglePause() {
  if (!speaking.value) return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    paused.value = false;
    status.value = "Leitura retomada.";
  } else {
    window.speechSynthesis.pause();
    paused.value = true;
    status.value = "Leitura pausada.";
  }
}

async function loadLibras() {
  if (loading.value) return;
  loading.value = true;
  status.value = "Carregando o tradutor de Libras…";

  try {
    await new Promise((resolve, reject) => {
      if (window.VLibras) return resolve();
      const script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      const timeout = setTimeout(() => reject(new Error("timeout")), 15000);
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error("network"));
      };
      document.head.appendChild(script);
    });

    if (!widget)
      widget = new window.VLibras.Widget("https://vlibras.gov.br/app");
    const launcher = await new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const button = document
          .querySelector("#vlibras-access-wrapper")
          ?.shadowRoot?.querySelector("#vlibras-button");
        if (button) return resolve(button);
        if (Date.now() - start > 15000) return reject(new Error("timeout"));
        setTimeout(check, 100);
      };
      check();
    });
    launcher.click();
    libras.value = true;
    status.value = "";
    open.value = false;
  } catch {
    status.value =
      "Não foi possível carregar o VLibras. Verifique sua conexão e tente novamente.";
  } finally {
    loading.value = false;
  }
}

onUnmounted(() => {
  stopReading();
  widget?.destroy?.();
});
</script>
<template>
  <div class="accessibility-widget">
    <button
      class="floating-button access-button"
      aria-label="Opções de acessibilidade"
      :aria-expanded="open"
      @click="open = true"
    >
      <Icon name="access" />
    </button>
  </div>
  <Modal :open="open" label="Opções de acessibilidade" @close="open = false"
    ><div class="access-panel">
      <p class="eyebrow">UMA EXPERIÊNCIA PARA TODAS</p>
      <h2>Acessibilidade</h2>
      <p>Personalize sua navegação e leitura.</p>
      <div class="size-controls">
        <strong>Tamanho do texto</strong
        ><button
          class="icon-button"
          aria-label="Diminuir fonte"
          :disabled="size <= 100"
          @click="size -= 10"
        >
          A−</button
        ><output aria-live="polite">{{ size }}%</output
        ><button
          class="icon-button"
          aria-label="Aumentar fonte"
          :disabled="size >= 200"
          @click="size += 10"
        >
          A+
        </button>
      </div>
      <label><input v-model="contrast" type="checkbox" /> Alto contraste</label
      ><label
        ><input v-model="underline" type="checkbox" /> Destacar links</label
      ><label
        ><input v-model="readable" type="checkbox" /> Espaçamento de
        leitura</label
      ><label
        ><input v-model="motion" type="checkbox" /> Reduzir animações</label
      ><button v-if="!speaking" class="button outline full" @click="readPage">
        Ler conteúdo em voz alta</button
      ><template v-else
        ><button class="button outline full" @click="togglePause">
          {{ paused ? "Continuar leitura" : "Pausar leitura" }}</button
        ><button class="text-button" @click="stopReading">
          Parar leitura
        </button></template
      ><button
        class="button outline full"
        :disabled="loading"
        @click="loadLibras"
      >
        {{ loading ? "Carregando…" : "Ativar tradução em Libras" }}</button
      ><button class="text-button" @click="reset">Restaurar padrão</button>
      <p role="status">{{ status }}</p>
    </div></Modal
  >
  <div v-show="libras" vw class="enabled">
    <div vw-access-button class="active" />
    <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper" /></div>
  </div>
</template>
