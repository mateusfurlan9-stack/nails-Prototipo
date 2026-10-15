import { ref, onMounted, onUnmounted } from "vue";
export function usePageSize(desktop = 3, mobile = 2) {
  const query =
    typeof window === "undefined"
      ? null
      : window.matchMedia("(max-width: 650px)");
  const size = ref(query?.matches ? mobile : desktop);
  const update = (event) => (size.value = event.matches ? mobile : desktop);
  onMounted(() => query?.addEventListener("change", update));
  onUnmounted(() => query?.removeEventListener("change", update));
  return size;
}
