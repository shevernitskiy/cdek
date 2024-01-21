import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { Cdek } from "../src/cdek.ts";

const incoming_webhook = {
  type: "ORDER_STATUS",
  date_time: "2020-08-10T21:32:14+0700",
  uuid: "72753031-2801-4186-a091-0be58cedfee7",
  attributes: {
    is_return: false,
    cdek_number: "1106321645",
    code: "RECEIVED_AT_SHIPMENT_WAREHOUSE ",
    status_code: "3",
    status_date_time: "2020-08-10T21:32:12+0700",
    city_name: "Новосибирск",
    city_code: "270",
  },
} as const;

Deno.test("webhook should work properly", async () => {
  const cdek = new Cdek({
    account: "EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI",
    password: "PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG",
    url_base: "https://api.edu.cdek.ru/v2",
  });

  cdek.on("ORDER_STATUS", (ctx) => console.log(`order ${ctx.attributes.cdek_number} => status ${ctx.attributes.code}`));

  const server = Deno.serve({
    port: 4545,
  }, cdek.webhookHandler());

  const res = await fetch("http://localhost:4545/", {
    method: "POST",
    body: JSON.stringify(incoming_webhook),
  });

  assertEquals(res.status, 200);
  assertEquals(await res.text(), "OK");

  await server.shutdown();
});
