# CDEK API Client

[![npm](https://img.shields.io/npm/v/cdek?logo=npm&style=flat&labelColor=000)](https://www.npmjs.com/package/cdek)
[![deno module](https://shield.deno.dev/x/cdek)](https://deno.land/x/cdek/mod.ts)
[![JSR](https://jsr.io/badges/@shevernitskiy/cdek)](https://jsr.io/@shevernitskiy/cdek)
![dependencies](https://img.shields.io/badge/dependencies-0-green?style=flat&labelColor=000)
[![license](https://img.shields.io/github/license/shevernitskiy/amo?style=flat&labelColor=000)](https://github.com/shevernitskiy/cdek/blob/main/LICENSE)

A fully-typed, simple wrapper for CDEK REST API v2. This library covers almost all API endpoints with precise TypeScript definitions.

## 🚀 Quick Start

### Installation

```bash
# Node.js
npm install cdek
# or
yarn add cdek
# or
pnpm add cdek

# Deno
deno add @shevernitskiy/cdek

# Bun
bun add cdek

# JSR (any runtime)
npx jsr add @shevernitskiy/cdek
```

### Basic Usage

```typescript
import { Cdek } from "cdek";

const client = new Cdek({
  account: "YOUR_ACCOUNT",
  password: "YOUR_PASSWORD",
  // Optional: use test environment
  // url_base: "https://api.edu.cdek.ru/v2"
});

// Get regions
const regions = await client.getRegions({ country_codes: ["RU"], size: 5 });
console.log(regions);
```

## 📚 Core API

### Location

```typescript
// Get regions
const regions = await client.getRegions({ country_codes: ["RU"], size: 10 });

// Get cities
const cities = await client.getCities({ region_code: 77, size: 20 });

// Get city by coordinates
const city = await client.getCityByCoordinates(55.7558, 37.6176);
```

### Orders

```typescript
// Create order
const order = await client.addOrder({
  type: 1,
  number: "ORDER-123",
  tariff_code: 1,
  recipient: {
    name: "John Doe",
    phones: [{ number: "+79123456789" }],
  },
  to_location: { code: 44 },
  packages: [{
    number: "PKG-001",
    weight: 1000,
    length: 20,
    width: 15,
    height: 10,
  }],
});

// Get order by UUID
const orderInfo = await client.getOrderByUUID("order-uuid-here");

// Get order by CDEK number
const orderInfo = await client.getOrderByCdekNumber(123456789);
```

### Calculators

```typescript
// Calculate by tariff
const calculation = await client.calculatorByTariff({
  type: 2,
  tariff_code: 11,
  from_location: { code: 270 },
  to_location: { code: 44 },
  packages: [{ weight: 1000, length: 20, width: 15, height: 10 }],
});

// Get available tariffs
const tariffs = await client.availableTariffs("ru");
```

### Webhooks

```typescript
import { Cdek } from "cdek";

const client = new Cdek({/* config */});

// Handle order status changes
client.on("ORDER_STATUS", (event) => {
  console.log(`Order ${event.attributes.order_uuid} status: ${event.attributes.code}`);
});

// Handle print form events
client.on("PRINT_FORM", (event) => {
  console.log(`Print form ready: ${event.attributes.url}`);
});

// Generic HTTP server example
const server = new HttpServer();
server.post("/webhook/cdek", async (req, res) => {
  const response = await client.webhookHandler()(req);
  res.status(response.status).send(response.body);
});
```

## 🛡️ Error Handling

The library provides comprehensive error handling with specific error types and an optional global error handler.

### Error Types

```typescript
import { ApiError, AuthError, Cdek, HttpError } from "cdek";

const client = new Cdek({/* config */});

try {
  const result = await client.getRegions({ invalid_param: "test" });
} catch (error) {
  if (error instanceof ApiError) {
    // API returned validation errors
    console.error("API Error:", error.response);
  } else if (error instanceof AuthError) {
    // Authentication failed
    console.error("Auth Error:", error.message);
  } else if (error instanceof HttpError) {
    // Network or HTTP errors
    console.error("HTTP Error:", error.message);
  } else {
    // Unknown error
    console.error("Unexpected Error:", error);
  }
}
```

### Global Error Handler

You can set a global error handler that will be called for all API errors:

```typescript
const client = new Cdek({
  account: "YOUR_ACCOUNT",
  password: "YOUR_PASSWORD",

  // Global error handler - called for all API errors
  on_error: (error) => {
    // Log to external service
    console.error("CDEK API Error:", error);

    // Send to monitoring system
    // monitoring.trackError(error);

    // Handle specific error types
    if (error instanceof ApiError) {
      // API validation errors
      console.log("Validation failed:", error.response.requests);
    } else if (error instanceof AuthError) {
      // Authentication issues
      console.log("Auth failed, refreshing token...");
    }
  }
});

// The on_error callback will be triggered for any API call that fails
const regions = await client.getRegions({ country_codes: ["RU"] });
```

### Simple Error Handling

For quick implementations, you can use a simpler approach:

```typescript
try {
  const regions = await client.getRegions({ country_codes: ["RU"] });
  console.log("Success:", regions.length, "regions found");
} catch (error) {
  console.error("Something went wrong:", error.message);
}
```

## 🚀 Advanced Usage

### Configuration

```typescript
const client = new Cdek({
  account: "YOUR_ACCOUNT",
  password: "YOUR_PASSWORD",

  // Optional configuration
  grant_type: "client_credentials", // Default
  url_base: "https://api.cdek.ru/v2", // Production (default)
  // url_base: "https://api.edu.cdek.ru/v2", // Test environment

  // Optional global error handler
  on_error: (error) => {
    console.error("CDEK API Error:", error);
  },
});
```

### Complete Order Example

```typescript
const order = await client.addOrder({
  type: 1, // Delivery
  number: "WEB-12345",
  tariff_code: 1, // Economy delivery
  recipient: {
    name: "Иван Иванов", // Required
    company: "ИП Иванов",
    email: "client@example.com",
    phones: [{ number: "+79123456789" }], // Required
  },
  sender: {
    name: "Петр Петров", // Required
    company: "ООО Ромашка",
    email: "sender@example.com",
    phones: [{ number: "+79234567890" }], // Required
  },
  from_location: {
    code: 44, // Moscow
    address: "ул. Тверская, д. 1",
  },
  to_location: {
    code: 137, // Novosibirsk
    address: "ул. Ленина, д. 10",
  },
  services: [
    { code: "CASH_ON_DELIVERY", parameter: "5000" }, // COD 5000 RUB
  ],
  packages: [{
    number: "BOX-001",
    weight: 2000,
    length: 30,
    width: 20,
    height: 15,
    items: [{
      name: "Телефон",
      ware_key: "PHONE-001",
      payment: { value: 25000 },
      cost: 25000,
      amount: 1,
      weight: 200,
    }],
  }],
});

console.log("Order created:", order.uuid);
```

### Courier Integration

```typescript
// Request courier pickup
const courier = await client.addCourier({
  date: "2024-01-15",
  time_begin: "09:00",
  time_end: "18:00",
  weight: 10000,
  length: 50,
  width: 40,
  height: 30,
  sender: {
    name: "Иван Иванов",
    company: "ООО Ромашка",
    phones: [{ number: "+79123456789" }],
  },
  from_location: {
    code: 44,
    address: "ул. Тверская, д. 1",
  },
});

console.log("Courier request:", courier.uuid);
```

### Print Documents

```typescript
import { createWriteStream } from "fs";

// Create order receipt
const receipt = await client.createOrderReceipt({
  orders: [{ order_uuid: "order-uuid-here" }],
});

// Download PDF
const pdfStream = await client.downloadOrderReceiptByUUID(receipt.uuid);

// Save to file
const file = createWriteStream("receipt.pdf");
pdfStream.pipe(file);
```

## 📦 Package Information

- **Node.js**: `>= 18`
- **TypeScript**: Full support with precise types
- **Dependencies**: None (zero dependencies)
- **Bundle size**: Minimal, tree-shakeable

## 🤝 Contributing

Pull requests, issues, and feedback are very welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `deno test -A ./tests/`
5. Format code: `deno fmt`
6. Submit PR

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [CDEK API Documentation](https://apidoc.cdek.ru/)
- [GitHub Repository](https://github.com/shevernitskiy/cdek)
- [NPM Package](https://www.npmjs.com/package/cdek)
- [Deno Module](https://deno.land/x/cdek)

