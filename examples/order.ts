import { Cdek } from "../src/cdek.ts";
import { ApiError } from "../src/errors/api.ts";
import { HttpError } from "../src/errors/http.ts";

const client = new Cdek({
  account: "EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI",
  password: "PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG",
  url_base: "https://api.edu.cdek.ru/v2",
});
try {
  const data = await client.getOrderByUUID("72753033-1cf5-447c-a420-c29f4b488ac6");
  console.log(data);

  const data2 = await client.updateOrder({
    uuid: "72753031-5427-4d1b-b1e4-7c4c26be00a0",
    cdek_number: 1105660806,
    tariff_code: 10,
    sender: {
      company: "Pogoda",
      name: "Петров Петр",
      email: "react@cdek.ru",
      phones: [{
        number: "+79134637228",
        additional: "1234",
      }],
    },
    recipient: {
      company: "NUMM",
      name: "Константинов Константин",
      email: "pochta@gmail.com",
      phones: [{
        number: "+79134635628",
        additional: "123",
      }],
    },
    to_location: {
      code: 137,
    },
    from_location: {
      address: "Новосибирск, Большевистская 101",
    },
    services: [{
      code: "DANGER_CARGO",
    }, {
      code: "PACKAGE_1",
      parameter: "1",
    }],
    packages: [{
      number: "bar-666",
      height: 20,
      length: 20,
      weight: 4000,
      width: 20,
      items: [
        {
          name: "Товар",
          ware_key: "00055",
          payment: {
            value: 3000,
          },
          cost: 300,
          amount: 1,
          weight: 700,
        },
      ],
    }],
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
