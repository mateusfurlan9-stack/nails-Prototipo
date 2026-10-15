<script setup>
defineProps({ name: { type: String, default: "arrow" } });
const paths = {
  arrow: "M7 17 17 7M7 7h10v10",
  chevron: "m9 5 7 7-7 7",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  sparkles: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-5",
  flower:
    "M12 8c-8-12-14 3-6 5-7 7 7 14 8 5 9 5 14-9 5-10 3-9-12-12-12-3M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
  gem: "m3 8 4-5h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18",
  pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  clock: "M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M17 7h.01",
  whatsapp:
    "M21 11.5a9 9 0 0 1-13.4 8L3 21l1.5-4.6A9 9 0 1 1 21 11.5ZM8 7c0 5 4 9 9 9l1-3-3-1-1 2c-2-1-3-2-4-4l2-1-1-3-3 1Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  access: "M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4M4 9h16M12 9v5m0 0-5 7m5-7 5 7",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6",
  check: "m5 12 4 4L19 6",
  star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6",
};
</script>
<template>
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.arrow" />
  </svg>
</template>
