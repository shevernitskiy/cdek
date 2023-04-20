import { Cdek } from "../src/cdek.ts";
import { ApiError } from "../src/errors/api.ts";
import { HttpError } from "../src/errors/http.ts";

const client = new Cdek({
  account: "EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI",
  password: "PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG",
  url_base: "https://api.edu.cdek.ru/v2",
});
try {
  const data = await client.calculatorCustoms({
    "weight": 100000,
    "cost": 5000000,
  });
  console.log(data);

  const data2 = await client.calculatorByTariff({
    type: 2,
    date: "2020-11-03T11:49:32+0700",
    currency: 1,
    tariff_code: 11,
    from_location: {
      code: 270,
    },
    to_location: {
      code: 44,
    },
    services: [{
      code: "CARTON_BOX_XS",
      parameter: "2",
    }],
    packages: [
      {
        height: 10,
        length: 10,
        weight: 4000,
        width: 10,
      },
    ],
  });
  console.log(data2);
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.response);
  } else if (err instanceof HttpError) {
    console.error(err);
  } else {
    console.error("Unknown Error", err);
  }
}
