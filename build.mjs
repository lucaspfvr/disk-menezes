import { readFileSync, writeFileSync } from 'node:fs';
const files = { html: 'index.html', app: 'app.js', loginPage: 'entrar.html', themeCss: 'theme.css' };
const source = Object.entries(files).map(([name, file]) =>
  `export const ${name} = ${JSON.stringify(readFileSync(new URL('./public/' + file, import.meta.url), 'utf8'))};`
).join('\n');
writeFileSync(new URL('./assets.generated.mjs', import.meta.url), source + '\n');
