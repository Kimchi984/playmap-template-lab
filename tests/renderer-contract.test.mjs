import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {resolveDesign,resolveSavedTemplate,deriveCapabilities,createTemplateDocument} from '../.test-build/public-renderer.mjs';
const contract=JSON.parse(fs.readFileSync('releases/v1.0.0/contract.json'));
test('Every shared fixture passes the reusable API without changing semantic content',()=>{
 for(const fixtureSet of contract.fixtures)for(const fixture of fixtureSet.fixtures){
  const input={templateId:fixtureSet.templateId,templateVersion:fixtureSet.templateVersion,content:fixture.content,design:fixture.design};
  const result=resolveSavedTemplate(contract.recipes,input);assert.equal(result.content,input.content);
  const doc=createTemplateDocument(contract.recipes,input);assert.equal(doc.pin.templateVersion,fixture.expectedRecipeVersion);
  assert.ok(doc.spec);assert.ok(Array.isArray(doc.assets));
 }
});
test('Package recipes, fixtures and capabilities are derived from the live shared contract',()=>{
 const catalog=JSON.parse(fs.readFileSync('recipes/catalog.json')),caps=JSON.parse(fs.readFileSync('releases/v1.0.0/capabilities.json'));
 for(const entry of catalog.templates){
  const recipe=JSON.parse(fs.readFileSync(entry.path)),fixtures=JSON.parse(fs.readFileSync(entry.fixtures));
  assert.deepEqual(contract.recipes.find(r=>r.templateId===entry.id),recipe);assert.deepEqual(contract.fixtures.find(r=>r.templateId===entry.id),fixtures);
  assert.deepEqual(caps.templates.find(r=>r.templateId===entry.id),deriveCapabilities(recipe));
 }
});
test('Pins and bounded choices cannot silently fall back to latest or adapter defaults',()=>{
 const input={templateId:'curated-pick',templateVersion:8,content:{name:'Plans',hook:'Go outside'}};
 assert.throws(()=>resolveSavedTemplate(contract.recipes,{...input,templateVersion:7}),/Unavailable pinned/);
 assert.throws(()=>resolveSavedTemplate(contract.recipes,{...input,design:{artDirection:'poster'}}),/Unknown design/);
 assert.throws(()=>resolveSavedTemplate(contract.recipes,{...input,design:{numberStyle:'star'}}),/Unsupported/);
 assert.throws(()=>createTemplateDocument(contract.recipes,input,{nonexistent:'blob:image'}),/Unknown image slot/);
});
test('Composition-dependent defaults come from the recipe and respond to control order',()=>{
 const recipe=contract.recipes.find(r=>r.templateId==='curated-pick');
 const above=resolveDesign(recipe,{treatment:'visual-above'}),below=resolveDesign(recipe,{treatment:'visual-below'});
 assert.equal(above.priceAlignment,'right');assert.equal(below.priceAlignment,'left');assert.equal(below.imageFit,'frame');
 const reversed={...recipe,designOptions:Object.fromEntries(Object.entries(recipe.designOptions).reverse())};assert.deepEqual(resolveDesign(reversed,{treatment:'visual-below'}),below);
});
test('Optional price/number work; copy guides warn without deleting text; list overflow is rejected',()=>{
 const recipe=contract.recipes.find(r=>r.templateId==='curated-pick'),name='A'.repeat(121);
 const input={templateId:recipe.templateId,templateVersion:recipe.templateVersion,content:{name,hook:'Go outside',price:''},design:{numberStyle:'none'}};
 const doc=createTemplateDocument(contract.recipes,input);assert.equal(doc.spec.curated.slides[0].name.text,name);assert.equal(doc.spec.curated.slides[0].price,'');assert.ok(doc.warnings.length);
 const list=contract.recipes.find(r=>r.templateId==='list');assert.throws(()=>createTemplateDocument(contract.recipes,{templateId:list.templateId,templateVersion:list.templateVersion,content:{headline:'Plans',items:Array.from({length:14},()=>({primary:'Place'}))}}),/count is outside/);
});
test('Baseline fingerprints detect source or release drift',()=>{
 const lock=JSON.parse(fs.readFileSync('releases/v1.0.0/baseline-lock.json'));
 const digest=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 for(const [p,sha] of Object.entries(lock.sourceSha256))assert.equal(digest(p),sha,p);
 for(const [p,sha] of Object.entries(lock.artifactSha256))assert.equal(digest('releases/v1.0.0/'+p),sha,p);
 assert.equal(lock.referenceSnapshots.status,'not-yet-frozen');assert.equal(lock.productionIntegration.status,'not-applied');
});
