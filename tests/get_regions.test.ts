import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { Cdek } from "../src/cdek.ts";

Deno.test("checking code below", async () => {
  const client = new Cdek("EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI", "PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG");

  const data = await client.getRegions({ country_codes: ["TH"], size: 1 });

  console.log(data);

  assertEquals(
    data[0],
    {
      country_code: "TH",
      country: "Таиланд",
      region: "Провинция Яла",
      region_code: 1451,
    },
  );
});
