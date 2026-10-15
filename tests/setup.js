import { vi } from "vitest";
window.matchMedia = vi.fn((query) => ({
  matches: query.includes("prefers-reduced-motion"),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));
window.scrollTo = vi.fn();
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
HTMLDialogElement.prototype.close = function () {
  this.open = false;
};
Element.prototype.scrollBy = vi.fn();
