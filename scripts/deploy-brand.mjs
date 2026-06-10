// Build and deploy a whitelabel brand to its Netlify site.
//
// Usage:
//   node scripts/deploy-brand.mjs <brandId> [--create]
//
// --create makes the Netlify site (torus-<brandId>) and exits; paste the
// printed site id into brands/<brandId>/meta.json, add the site URL to
// CORS_ORIGINS on the Render backend, then rerun without --create.
//
// VITE_GRAPHQL_API and the other VITE_* backend vars come from the shell
// environment or .env, exactly as for a normal build.
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

// Prefer a globally installed netlify binary; fall back to npx.
const NETLIFY = process.env.NETLIFY_BIN ?? "netlify";

const [brandId, flag] = process.argv.slice(2);

if (!brandId || !existsSync(`brands/${brandId}/meta.json`)) {
  console.error("usage: node scripts/deploy-brand.mjs <brandId> [--create]");
  console.error("brandId must match a folder under brands/ with a meta.json");
  process.exit(1);
}

const meta = JSON.parse(readFileSync(`brands/${brandId}/meta.json`, "utf8"));
const run = (cmd, env = {}) =>
  execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });

if (flag === "--create") {
  run(`${NETLIFY} sites:create --name torus-${brandId}`);
  console.log(
    `\nNext: paste the new Project ID into brands/${brandId}/meta.json (netlifySiteId),\n` +
      `add the site URL to CORS_ORIGINS on the Render backend service,\n` +
      `then run: npm run deploy:brand -- ${brandId}`
  );
  process.exit(0);
}

if (!meta.netlifySiteId) {
  console.error(
    `brands/${brandId}/meta.json is missing netlifySiteId — run with --create first.`
  );
  process.exit(1);
}

run("npm run build", { VITE_BRAND: brandId });
run(
  `${NETLIFY} deploy --prod --dir dist --site ${meta.netlifySiteId} --message "brand:${brandId}"`
);
