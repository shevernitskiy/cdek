import { deepStrictEqual } from "node:assert";

import { Cdek } from "../src/cdek.ts";

Deno.test("checking code below", async () => {
  const client = new Cdek({
    account: "wqGwiQx0gg8mLtiEKsUinjVSICCjtTEP",
    password: "RmAmgvSgSl1yirlz9QupbzOJVqhCxcP5",
    url_base: "https://api.edu.cdek.ru/v2",
  });

  const data = await client.getRegions({ country_codes: ["TH"], size: 1 });

  console.log(data);

  deepStrictEqual(
    data[0],
    {
      country_code: "TH",
      country: "Таиланд",
      region: "Провинция Яла",
      region_code: 1451,
    },
  );
});
