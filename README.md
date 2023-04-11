# CDEK API client

This is fully-typed simple wrapper for CDEK REST api v2. It covers almost all api methods.

## Installation

For Node.js

```sh
npm i cdek
```

For Deno just import like cool kid.

## Usage

Example for Deno.

```ts
import { Cdek } from "https://deno.land/x/cdek@v1.0.0/mod.ts";

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

# Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt`.

# License

Copyright 2023, shevernitskiy. MIT license.
