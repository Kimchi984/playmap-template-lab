import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
fs.mkdirSync('.test-build',{recursive:true});
await build({entryPoints:['source/lib/labFitting.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/fitting.mjs'});
await build({entryPoints:['lab/restored.tsx'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/restored.mjs',jsx:'automatic',alias:{'@':'./source'},loader:{'.css':'empty'},define:{'process.env.NODE_ENV':'"production"'}});
const r=spawnSync(process.execPath,['--test','tests/restored.test.mjs'],{stdio:'inherit'});process.exit(r.status||0);
