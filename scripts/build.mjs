import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
await build({entryPoints:['lab/restored.tsx'],bundle:true,format:'esm',minify:true,outfile:'dist/restored.js',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},alias:{'@':'./source'},loader:{'.woff2':'file'},assetNames:'fonts/[name]-[hash]'});
execFileSync('./node_modules/.bin/tailwindcss',['-i','lab/artwork.css','-o','dist/artwork.css','--minify'],{stdio:'inherit'});
