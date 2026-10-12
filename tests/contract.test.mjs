import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const recipe=read('recipes/list/v2/recipe.json'),fixtures=read('recipes/list/v2/fixtures.json'),registry=read('rules/registry.json');
test('manifest rules resolve and fixture choices stay within shared bounds',()=>{
 for(const id of Object.values(recipe.rules))assert.ok(registry.rules[id],id);
 for(const c of Object.values(recipe.compositions))assert.ok(registry.rules[c.layoutRule]);
 for(const f of fixtures.fixtures){assert.equal(f.expectedRecipeVersion,recipe.templateVersion);for(const [key,value] of Object.entries(f.design))assert.ok(recipe.designOptions[key].values.includes(value));assert.ok(f.content.items.length>=3&&f.content.items.length<=13);assert.equal(f.referenceSnapshot,null);}
 assert.equal(recipe.status,'lab');
});
test('required stress cases retain optional-field and multiline inputs',()=>{
 assert.ok(fixtures.fixtures.some(f=>f.content.items.length===13));assert.ok(fixtures.fixtures.some(f=>f.content.headline.includes('\n')));
 assert.ok(fixtures.fixtures.some(f=>f.content.items.some(x=>!x.secondary&&!x.third)));
 assert.ok(fixtures.fixtures.some(f=>f.content.headline.length>70));
});
