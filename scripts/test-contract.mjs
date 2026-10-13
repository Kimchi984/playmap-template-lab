import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
fs.mkdirSync('.test-build',{recursive:true});
await build({entryPoints:['renderer/index.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/public-renderer.mjs',jsx:'automatic',external:['react','react-dom','react/*','react-dom/*','lucide-react'],alias:{'@':'./source'},loader:{'.css':'empty'},define:{'process.env.NODE_ENV':'"production"'}});
const r=spawnSync(process.execPath,['--test','tests/renderer-contract.test.mjs'],{stdio:'inherit'});process.exit(r.status||0);
