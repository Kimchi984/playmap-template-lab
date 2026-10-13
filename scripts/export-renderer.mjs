import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const out='releases/v1.0.0';fs.mkdirSync(out,{recursive:true});fs.mkdirSync('.test-build',{recursive:true});
// Once the lock exists, rebuilding may reproduce it but cannot replace it with new behaviour.
const lockPath=path.join(out,'baseline-lock.json');
if(fs.existsSync(lockPath)){
 const locked=JSON.parse(fs.readFileSync(lockPath));
 for(const [file,expected] of Object.entries(locked.sourceSha256)){
  if(!fs.existsSync(file)||createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==expected)
   throw new Error(`Frozen release drift in ${file}. Preserve v1.0.0 and create a new release/version.`);
 }
 for(const [name,version] of Object.entries(locked.dependencyVersions)){
  if(JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`)).version!==version)
   throw new Error(`Frozen dependency drift: ${name}`);
 }
}

await build({entryPoints:['renderer/contract.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/contract.mjs'});
const {deriveCapabilities}=await import('../.test-build/contract.mjs');
const catalog=JSON.parse(fs.readFileSync('recipes/catalog.json','utf8'));
const registry=JSON.parse(fs.readFileSync('rules/registry.json','utf8'));
const recipes=catalog.templates.map(t=>JSON.parse(fs.readFileSync(t.path,'utf8')));
const fixtures=catalog.templates.map(t=>JSON.parse(fs.readFileSync(t.fixtures,'utf8')));
const rules=Object.fromEntries([...new Set(recipes.flatMap(r=>Object.values(r.rules)))].sort().map(id=>{if(!registry.rules[id])throw new Error(`Missing rule: ${id}`);return [id,registry.rules[id]]}));
const write=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n');
write('contract.json',{releaseVersion:'1.0.0',schemaVersion:'0.1',recipes,fixtures,rules});
write('capabilities.json',{releaseVersion:'1.0.0',templates:recipes.map(deriveCapabilities)});
await build({entryPoints:['renderer/index.ts'],bundle:true,format:'esm',minify:true,outfile:path.join(out,'index.js'),jsx:'automatic',external:['react','react-dom','react-dom/*','react/*','lucide-react','@fontsource-variable/*'],alias:{'@':'./source'},define:{'process.env.NODE_ENV':'"production"'}});
fs.copyFileSync('dist/artwork.css',path.join(out,'index.css'));
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
write('package.json',{name:'@playmap/templates',version:'1.0.0',private:true,type:'module',exports:{'.':'./index.js','./style.css':'./index.css','./contract.json':'./contract.json','./capabilities.json':'./capabilities.json'},sideEffects:['*.css','index.js'],peerDependencies:{react:'>=18 <20','react-dom':'>=18 <20'},dependencies:Object.fromEntries(Object.keys(pkg.dependencies).filter(name=>!['react','react-dom'].includes(name)).map(name=>[name,JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`)).version])),files:['index.js','index.css','contract.json','capabilities.json','baseline-lock.json','README.md']});
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files=[...catalog.templates.flatMap(t=>[t.path,t.fixtures]),'recipes/catalog.json','rules/registry.json','renderer/contract.ts','renderer/index.ts','lab/restored.tsx','lab/artwork.css','scripts/export-renderer.mjs','app.js','package-lock.json'];
for(const folder of ['source/lib','source/components']){
 const walk=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(ts|tsx)$/.test(p))files.push(p)}};walk(folder);
}
write('baseline-lock.json',{releaseVersion:'1.0.0',reviewedDesignSourceCommit:'2c1abf2c45d6480d0360f03c6fdcd8e3274d99ae',approval:'Alina: ready for first version, then lets do it (13 October 2026, Sydney)',status:'reviewed-design-baseline-packaged',dependencyVersions:Object.fromEntries(Object.keys(pkg.dependencies).map(name=>[name,JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`)).version])),templates:catalog.templates.map(t=>({templateId:t.id,templateVersion:t.version,recipeSha256:hash(t.path),fixturesSha256:hash(t.fixtures),reviewScope:['big-type','split'].includes(t.id)?'retained source baseline':'reviewed incremental Lab refinements'})),sourceSha256:Object.fromEntries(files.sort().map(p=>[p,hash(p)])),artifactSha256:Object.fromEntries(['index.js','index.css','contract.json','capabilities.json','package.json'].map(p=>[p,hash(path.join(out,p))])),referenceSnapshots:{status:'not-yet-frozen',reason:'Existing screenshots are UI/viewport evidence; exact native accepted artwork with private asset references is not yet recorded. Do not treat missing-image Pick evidence as an accepted complete composition.'},productionIntegration:{status:'not-applied',requiresVisualParity:true},experimental:['Editorial Cover expanded copy allocation','Arbitrary long-copy/image overlaps beyond reviewed states','Multiple simultaneous display-font choices: current font selector is shared module state'],immutability:'Do not overwrite this release after publication. New recipe behaviour requires new template/release versions.'});
execFileSync('npm',['pack','./'+out,'--pack-destination',out],{stdio:'inherit'});
