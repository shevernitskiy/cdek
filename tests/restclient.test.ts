import test from "node:test";
import assert from "node:assert/strict";

import { Cdek } from "../src/cdek.ts";
import { ApiError, AuthError, HttpError } from "../mod.ts";
import { json, mockApi } from "./mock.ts";

const client = () => new Cdek({ account: "account", password: "password" });

test("should send credentials as form-urlencoded on auth", async (t) => {
  t.mock.method(global, "fetch", mockApi((url, init) => {
    assert.equal(url, "https://api.cdek.ru/v2/oauth/token?parameters");
    assert.equal(init?.method, "POST");
    assert.equal((init?.headers as Record<string, string>)["Content-Type"], "application/x-www-form-urlencoded");
    assert.equal(
      String(init?.body),
      "grant_type=client_credentials&client_id=account&client_secret=password",
    );

    return json([]);
  }));

  await assert.rejects(() => client().getRegions({ size: 1 }));
});

test("should return AuthError on failed handshake", async (t) => {
  const denied = () => Promise.resolve(new Response("nope", { status: 403 }));

  t.mock.method(global, "fetch", denied as unknown as typeof fetch);

  await assert.rejects(() => client().getRegions({ size: 1 }), AuthError);
});

test("should return ApiError on json error response", async (t) => {
  const body = {
    requests: [
      {
        request_uuid: "1",
        status: "ERROR",
        error: {
          code: "NOT_FOUND",
          message: "Заказ не найден",
          request_uuid: "1",
        },
      },
    ],
  };

  t.mock.method(global, "fetch", mockApi(() => json(body, 404)));

  await assert.rejects(
    () => client().getOrderByUUID("72753031-86cc-497b-a1cf-a76f59065cb5"),
    (err: unknown) => {
      assert.ok(err instanceof ApiError);
      assert.deepStrictEqual(err.response, body);
      return true;
    },
  );
});

test("should return HttpError on non-json error response", async (t) => {
  t.mock.method(global, "fetch", mockApi(() => new Response("Bad Gateway", { status: 502 })));

  await assert.rejects(() => client().getRegions({ size: 1 }), HttpError);
});

test("should call on_error instead of throwing", async (t) => {
  t.mock.method(global, "fetch", mockApi(() => json({ requests: [] }, 400)));

  const caught: unknown[] = [];
  const cdek = new Cdek({
    account: "account",
    password: "password",
    on_error: (err) => {
      caught.push(err);
    },
  });

  assert.equal(await cdek.getRegions({ size: 1 }), null);
  assert.equal(caught.length, 1);
  assert.ok(caught[0] instanceof ApiError);
});

test("should download binary content", async (t) => {
  const payload = new Uint8Array([80, 37, 70, 73, 76, 69]);

  t.mock.method(global, "fetch", mockApi((url, init) => {
    assert.equal(init?.method, "GET");
    assert.equal(url, "https://api.cdek.ru/v2/print/orders/72753031-86cc-497b-a1cf-a76f59065cb5.pdf");

    return new Response(payload, { headers: { "Content-Type": "application/pdf" } });
  }));

  const stream = await client().downloadOrderReceiptByUUID("72753031-86cc-497b-a1cf-a76f59065cb5");
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) chunks.push(chunk);

  assert.deepStrictEqual(Buffer.concat(chunks), Buffer.from(payload));
});

test("should return empty stream when on_error is set on download", async (t) => {
  t.mock.method(global, "fetch", mockApi(() => new Response("Nope", { status: 500 })));

  const cdek = new Cdek({
    account: "account",
    password: "password",
    on_error: () => {},
  });

  const stream = await cdek.downloadOrderReceiptByURL("https://cdn.cdek.ru/receipt.pdf");
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) chunks.push(chunk);

  assert.equal(chunks.length, 0);
});
