// Copies self-hosted fonts and icons from node_modules into assets/ (run via `npm run copy:vendor`)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const inter = path.join(root, 'node_modules/@fontsource-variable/inter/files');
const fa = path.join(root, 'node_modules/@fortawesome/fontawesome-free');

fs.mkdirSync(path.join(root, 'assets/fonts'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/fontawesome/css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/fontawesome/webfonts'), { recursive: true });

for (const file of ['inter-latin-wght-normal.woff2', 'inter-latin-ext-wght-normal.woff2']) {
    fs.copyFileSync(path.join(inter, file), path.join(root, 'assets/fonts', file));
}

// Only the solid and brands styles are used on the page
const css = ['fontawesome.min.css', 'solid.min.css', 'brands.min.css']
    .map(file => fs.readFileSync(path.join(fa, 'css', file), 'utf8'))
    .join('\n');
fs.writeFileSync(path.join(root, 'assets/fontawesome/css/fontawesome.min.css'), css);

for (const file of ['fa-solid-900.woff2', 'fa-brands-400.woff2']) {
    fs.copyFileSync(path.join(fa, 'webfonts', file), path.join(root, 'assets/fontawesome/webfonts', file));
}
