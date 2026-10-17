import test from "node:test";
import assert from "node:assert/strict";

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

test("webhook should work properly", async () => {
  const cdek = new Cdek({
    account: "account",
    password: "password",
    url_base: "https://api.edu.cdek.ru/v2",
  });

  const received: string[] = [];
  cdek.on("ORDER_STATUS", (ctx) => received.push(ctx.attributes.code));

  const server = Bun.serve({
    port: 0,
    fetch: cdek.webhookHandler(),
  });

  const res = await fetch(`http://localhost:${server.port}/`, {
    method: "POST",
    body: JSON.stringify(incoming_webhook),
  });

  assert.equal(res.status, 200);
  assert.equal(await res.text(), "OK");
  assert.deepStrictEqual(received, [incoming_webhook.attributes.code]);

  server.stop(true);
});
