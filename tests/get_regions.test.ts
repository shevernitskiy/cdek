import test from "node:test";
import assert from "node:assert/strict";

import { Cdek } from "../src/cdek.ts";
import { json, mockApi } from "./mock.ts";

test("getRegions should return regions", async (t) => {
  t.mock.method(global, "fetch", mockApi((url, init) => {
    assert.equal(url, "https://api.cdek.ru/v2/location/regions?country_codes=TH&size=1");
    assert.equal(init?.method, "GET");
    assert.equal((init?.headers as Record<string, string>)["Authorization"], "Bearer token");

    return json([
      {
        country_code: "TH",
        country: "Таиланд",
        region: "Провинция Яла",
        region_code: 1451,
      },
    ]);
  }));

  const client = new Cdek({
    account: "account",
    password: "password",
  });

  const data = await client.getRegions({ country_codes: ["TH"], size: 1 });

  assert.deepStrictEqual(data, [
    {
      country_code: "TH",
      country: "Таиланд",
      region: "Провинция Яла",
      region_code: 1451,
    },
  ]);
});

test("getRegions should return null when on_error is set", async (t) => {
  t.mock.method(global, "fetch", mockApi(() => new Response("Nope", { status: 500 })));

  let caught: unknown;

  const client = new Cdek({
    account: "account",
    password: "password",
    on_error: (err) => {
      caught = err;
    },
  });

  const data = await client.getRegions({ size: 1 });

  assert.equal(data, null);
  assert.match((caught as Error).message, /^HttpError/);
});
