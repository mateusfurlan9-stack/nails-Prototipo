import { ref } from "vue";
const requested = ref(null),
  visible = ref(false);
export function useBooking() {
  return {
    requested,
    visible,
    open(item = null) {
      requested.value = item;
      visible.value = true;
    },
    close() {
      visible.value = false;
    },
  };
}
