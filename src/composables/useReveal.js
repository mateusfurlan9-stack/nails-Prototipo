import { onMounted, onUnmounted } from "vue";
export function useReveal(root) {
  let observer;
  onMounted(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    root.value?.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("will-reveal");
      observer.observe(el);
    });
  });
  onUnmounted(() => observer?.disconnect());
}
