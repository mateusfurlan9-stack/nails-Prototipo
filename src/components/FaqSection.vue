<script setup>
import { computed, ref } from "vue";
import { siteConfig as c } from "../config/siteConfig";
import Icon from "./Icon.vue";
const query = ref(""),
  checked = ref([]);
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const filtered = computed(() =>
  c.faq.filter((f) =>
    normalize(`${f.q} ${f.a}`).includes(normalize(query.value)),
  ),
);
function download() {
  const content = [
    c.brand.name,
    c.care.title,
    "",
    ...c.care.items.map(
      (item, i) => `${checked.value.includes(i) ? "[x]" : "[ ]"} ${item}`,
    ),
    "",
    c.care.note,
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "guia-de-cuidados.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>
<template>
  <section id="duvidas" class="section wrap faq-section">
    <div>
      <p class="eyebrow">PERGUNTAS FREQUENTES</p>
      <h2>Um pouco mais<br />sobre seu cuidado.</h2>
      <p>Informação para escolher com tranquilidade.</p>
      <details class="care-guide">
        <summary>
          <span>{{ c.care.title }}</span
          ><span aria-hidden="true">+</span>
        </summary>
        <div class="care-content">
          <label v-for="(item, i) in c.care.items" :key="item"
            ><input v-model="checked" type="checkbox" :value="i" />{{
              item
            }}</label
          >
          <p>{{ c.care.note }}</p>
          <button class="button outline full" @click="download">
            Baixar meu guia <Icon name="arrow" />
          </button>
        </div>
      </details>
    </div>
    <div>
      <label class="search-field faq-search"
        ><span class="sr-only">Pesquisar perguntas frequentes</span
        ><input
          v-model="query"
          type="search"
          placeholder="Busque uma dúvida, como manutenção…"
      /></label>
      <p class="sr-only" role="status">
        {{ filtered.length }} perguntas encontradas
      </p>
      <details v-for="(faq, i) in filtered" :key="faq.q" name="faq">
        <summary>
          <span
            ><small>0{{ i + 1 }}</small
            >{{ faq.q }}</span
          ><span aria-hidden="true">+</span>
        </summary>
        <p>{{ faq.a }}</p>
      </details>
      <p class="empty" v-if="!filtered.length">
        Nenhuma pergunta encontrada. Fale com o estúdio.
      </p>
    </div>
  </section>
</template>
