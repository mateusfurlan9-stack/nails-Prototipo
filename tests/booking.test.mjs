import { test } from "node:test";
import assert from "node:assert/strict";
import {
  discount,
  saving,
  money,
  whatsappUrl,
  bookingMessage,
  localDate,
} from "../src/utils/booking.js";
import { siteConfig as c } from "../src/config/siteConfig.js";
test("descontos e economia em todos os serviços e combos", () => {
  for (const item of [...c.services, ...c.promotions]) {
    assert.equal(
      discount(item),
      Math.round((1 - item.price / item.original) * 100),
    );
    assert.equal(saving(item), item.original - item.price);
  }
  assert.equal(discount(c.services[4]), 20);
  assert.equal(discount({ original: 0, price: 5 }), 0);
});
test("WhatsApp sem destinatário válido não cria link", () => {
  for (const phone of ["", "123", "javascript:alert(1)", "5511999999999999"])
    assert.equal(whatsappUrl(phone, "oi"), null);
});
test("WhatsApp codifica nome, preço e preferências", () => {
  const message = bookingMessage({
    item: c.services[4],
    name: "Ana & Bia",
    date: "2026-12-02",
    time: "Tarde",
    demo: true,
  });
  const url = new URL(whatsappUrl("5511999999999", message));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.searchParams.get("text"), message);
  assert.match(message, /02\/12\/2026/);
  assert.match(message, /demonstrativo/);
  assert.match(message, /Aguardo confirmação/);
  assert.match(message, /175,00/);
  assert.match(message, /Ana & Bia/);
});
test("solicitação sem procedimento não promete disponibilidade", () => {
  const message = bookingMessage({});
  assert.match(message, /solicitar um atendimento/);
  assert.match(message, /confirmação/);
  assert.doesNotMatch(message, /undefined/);
});
test("data local e moeda brasileira", () => {
  assert.equal(localDate(new Date(2026, 0, 9, 12)), "2026-01-09");
  assert.match(money(35), /35,00/);
});
test("configuração mantém demonstração e contatos sem dados fictícios", () => {
  assert.equal(c.demo, true);
  assert.equal(c.contact.whatsapp, "");
  assert.equal(c.contact.address, "");
  assert.equal(c.services.length, 9);
  assert.equal(c.gallery.length, 7);
});
