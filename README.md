# CDEK API client

[![npm](https://img.shields.io/npm/v/cdek?logo=npm&style=flat&labelColor=000)](https://www.npmjs.com/package/cdek)
[![deno module](https://shield.deno.dev/x/cdek)](https://deno.land/x/cdek/mod.ts)
![dependencies](https://img.shields.io/badge/dependencies-0-green?style=flat&labelColor=000)
[![license](https://img.shields.io/github/license/shevernitskiy/amo?style=flat&labelColor=000)](https://github.com/shevernitskiy/cdek/blob/main/LICENSE)

This is fully-typed simple wrapper for CDEK REST api v2. It covers almost all api structure pretty precise. Use official
[docs](https://api-docs.cdek.ru/33828739.html) to read about methods.

## Installation

For Node.js

```powershell
npm i cdek
```

For Deno just import like cool kid.

## Usage

Example for Deno.

```ts
import { ApiError, Cdek, HttpError } from "https://deno.land/x/cdek@v1.0.4/mod.ts";

const client = new Cdek({
  account: "EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI",
  password: "PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG",
  url_base: "https://api.edu.cdek.ru/v2", // forced to use testing endpoint in this case
});

try {
  const data = await client.calculatorCustoms({
    weight: 100000,
    cost: 5000000,
  });
  console.log(data);

  const data2 = await client.getOrderByUUID("72753033-1cf5-447c-a420-c29f4b488ac6");
  console.log(data2);
} catch (err) {
  if (err instanceof ApiError) { // returned in case of Api Error like invalid data, contains api message
    console.error(err.response);
  } else if (err instanceof HttpError) { // returned in case of method not found
    console.error(err);
  } else {
    console.error("Unknown Error", err);
  }
}
```

## Webhook

You could handle incoming webhooks.

```ts
import { Cdek } from "https://deno.land/x/cdek@v1.0.4/mod.ts";

const client = new Cdek(...);

client.on("ORDER_STATUS", (ctx) => console.log(ctx.attributes.code));

Deno.serve(client.webhookHandler(), { port: 6767 });
```

## Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt`.

## License

Copyright 2023, shevernitskiy. MIT license.
