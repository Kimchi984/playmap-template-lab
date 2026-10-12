import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
fs.mkdirSync('dist',{recursive:true});
await build({entryPoints:['lab/restored.tsx'],bundle:true,format:'esm',minify:true,outfile:'dist/restored.js',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},alias:{'@':'./source'},loader:{'.woff2':'file'},assetNames:'fonts/[name]-[hash]'});
execFileSync('./node_modules/.bin/tailwindcss',['-i','lab/artwork.css','-o','dist/artwork.css','--minify'],{stdio:'inherit'});

// A new recipe must not run against cached renderer or UI code on GitHub Pages.
const digest=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex').slice(0,12);
const app=fs.readFileSync('app.js','utf8').replace(/\.\/dist\/restored\.js(?:\?v=[a-f0-9]+)?/,`./dist/restored.js?v=${digest('dist/restored.js')}`);
fs.writeFileSync('app.js',app);
let html=fs.readFileSync('index.html','utf8');
for(const path of ['app.js','dist/restored.css','dist/artwork.css','styles.css']) {
  const escaped=path.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  html=html.replace(new RegExp(`(src|href)="${escaped}(?:\\?v=[a-f0-9]+)?"`,'g'),`$1="${path}?v=${digest(path)}"`);
}
fs.writeFileSync('index.html',html);
