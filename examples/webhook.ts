import { Cdek } from "../src/cdek.ts";

const client = new Cdek({
  account: "EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI",
  password: "PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG",
  url_base: "https://api.edu.cdek.ru/v2",
});

client.on("ORDER_STATUS", (ctx) => console.log(ctx.attributes.code));

Bun.serve({ port: 6767, fetch: client.webhookHandler() });
