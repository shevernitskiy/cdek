console.log("removing previous files..");
try {
  Deno.removeSync("../npm/src/", { recursive: true });
} catch (_err) {
  //
}
console.log("compiling stuff...");
const cmd = new Deno.Command("deno", {
  args: ["run", "-A", "https://deno.land/x/deno2node/src/cli.ts"],
});
await cmd.output();
