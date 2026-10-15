export const money = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const discount = (item) =>
  item.original > item.price && item.price >= 0
    ? Math.round((1 - item.price / item.original) * 100)
    : 0;
export const saving = (item) => Math.max(0, item.original - item.price);
export const validPhone = (value) => /^55\d{10,11}$/.test(value);
export function whatsappUrl(phone, message) {
  if (!validPhone(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
export function bookingMessage({
  item,
  name = "",
  date = "",
  time = "",
  demo = false,
}) {
  const details = [
    `Olá! Gostaria de solicitar ${item ? item.name : "um atendimento"}.${item ? ` Valor ${demo ? "demonstrativo" : "informado"}: ${money(item.price)}.` : ""}`,
  ];
  if (name.trim()) details.push(`Meu nome é ${name.trim()}.`);
  if (date) {
    const [y, m, d] = date.split("-");
    details.push(`Minha preferência de data é ${d}/${m}/${y}.`);
  }
  if (time.trim()) details.push(`Preferência de horário: ${time.trim()}.`);
  details.push("Aguardo confirmação de disponibilidade e valor pelo estúdio.");
  return details.join(" ");
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
