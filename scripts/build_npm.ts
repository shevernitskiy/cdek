console.log("removing previous files..");
try {
  Deno.removeSync("./npm/", { recursive: true });
  Deno.createSync("./npm/");
} catch (_err) {
  //
}

console.log("compiling stuff...");

const cmd = new Deno.Command("deno", {
  args: ["run", "-A", "https://deno.land/x/deno2node/src/cli.ts"],
});
await cmd.output();

console.log("writing package.json...");

const pakcage = {
  name: "cdek",
  description: "CDEK APIv2 client",
  version: "1.0.0",
  license: "MIT",
  engines: {
    node: ">= 18",
  },
  repository: {
    type: "git",
    url: "https://github.com/shevernitskiy/cdek",
  },
  main: "./src/cdek.js",
  types: "./out/cdek.d.ts",
  dependencies: {
    "ts-mixer": "6.0.3",
  },
  keywords: [
    "cdek",
    "api",
    "client",
    "library",
    "wrapper",
  ],
};

Deno.writeTextFileSync("./npm/package.json", JSON.stringify(pakcage, null, 2), { create: true });

console.log("copy some stuff...");
Deno.copyFileSync("./README.md", "./npm/README.md");
Deno.copyFileSync("./LICENSE", "./npm/LICENSE");
