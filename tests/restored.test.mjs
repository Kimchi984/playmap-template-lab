import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {measureFittedText} from '../.test-build/fitting.mjs';
import {makeSpec,coverFrameGeometry,coverHeadlineHeight} from '../.test-build/restored.mjs';
// Synthetic metrics test policy only. Hosted browser checks verify actual typography separately.
function metricNode(){return {style:{},dataset:{},textContent:'',get scrollWidth(){const w=parseFloat(this.style.width),s=parseFloat(this.style.fontSize);return this.style.whiteSpace==='nowrap'?Math.max(w,this.textContent.length*s*.5):w},get scrollHeight(){const s=parseFloat(this.style.fontSize),w=parseFloat(this.style.width),lh=Number(this.style.lineHeight);return this.textContent.split('\n').reduce((sum,line)=>sum+Math.max(1,Math.ceil(line.length*s*.5/w)),0)*s*lh}}}
test('restored fitting preserves geometry and monotonic intent across headline stress cases',()=>{
 for(const text of ['Go play.','6 things to do with kids this weekend','What’s actually worth doing with the kids around Melbourne this weekend?','Little people.\nBig weekend.']){
  const sizes=['small','default','large'].map(intent=>{const n=metricNode(),r=measureFittedText(n,text,912,148,40,112,intent,true,700,1);assert.equal(n.style.width,'912px');return r.fontSize});
  assert.ok(sizes[2]>=sizes[1]&&sizes[1]>=sizes[0],`${text}: ${sizes}`);
 }
});
test('single-line CTA cannot use a wrapped fit',()=>{
 const n=metricNode();n.dataset.singleLine='true';const r=measureFittedText(n,'A long CTA that must remain on one line',250,48,1,31,'default',false,700,1.15);
 assert.equal(n.style.whiteSpace,'nowrap');assert.ok(n.scrollWidth<=250);assert.ok(r.constrained);
});
test('restored bridge retains source list styles and all three content fields',()=>{
 const d={headlineSize:'large',displayFont:'gabarito',columns:'2',numberStyle:'outlined-circle',numberColour:'cycle',density:'standard',position:'auto',primaryWeight:'medium',footerMode:'search-pill'};
 const {spec}=makeSpec('list',{headline:'Plans',items:[{primary:'Name',secondary:'Suburb',third:'Free'}],cta:'Find more'},d);
 assert.equal(spec.list.numberStyle,'outlined-circle');assert.equal(spec.list.columns,2);assert.equal(spec.list.items[0].third,'Free');assert.equal(spec.list.footer.variant,'search-pill');assert.equal(spec.list.headline.style.size,'large');
});
test('cover and pick remain mixed-post slide recipes with original image choices',()=>{
 const cover=makeSpec('editorial-cover',{headline:'Spring plans',kicker:'Our picks'},{heroPlacement:'bottom',graphicScale:'large'},{hero:'blob:preview'});
 assert.equal(cover.spec.recipe,'curated-picks');assert.equal(cover.spec.curated.slides[0].template,'editorial-cover');assert.equal(cover.spec.curated.slides[0].hero.placement,'bottom');
 const pick=makeSpec('curated-pick',{name:'A day out',location:'Melbourne',price:'Free'},{visualMode:'graphic',graphicPlacement:'bleed-top-right'},{hero:'blob:preview'});
 assert.equal(pick.spec.curated.slides[0].graphic.placement,'bleed-top-right');assert.equal(pick.spec.curated.slides[0].visualMode,'graphic');
});
test('active shared manifests expose individual options and no rejected art-direction modes',()=>{
 const catalog=JSON.parse(fs.readFileSync('recipes/catalog.json','utf8')),registry=JSON.parse(fs.readFileSync('rules/registry.json','utf8'));
 for(const entry of catalog.templates){const r=JSON.parse(fs.readFileSync(entry.path,'utf8')),f=JSON.parse(fs.readFileSync(entry.fixtures,'utf8'));assert.equal(r.designOptions.artDirection,undefined);assert.deepEqual(r.artDirectionModes,[]);assert.equal(r.sourceBaseline.commit,'ec495d390df67643d9206f0d65f30902883f4271');for(const id of Object.values(r.rules))assert.ok(registry.rules[id]);for(const fixture of f.fixtures){assert.equal(fixture.expectedRecipeVersion,r.templateVersion);for(const [key,value] of Object.entries(fixture.design))assert.ok(r.designOptions[key].values.includes(value))}}
});

test('transparent frames anchor to canvas edges without square fitting or aspect-ratio distortion',()=>{
 const bottom=coverFrameGeometry('full-bleed-bottom','small');assert.equal(bottom.width,1080);assert.equal(bottom.left,0);assert.equal(bottom.bottom,0);assert.equal(bottom.height,'auto');
 const corner=coverFrameGeometry('top-right','large');assert.equal(corner.right,0);assert.equal(corner.top,0);assert.equal(corner.height,'auto');assert.ok(corner.width>coverFrameGeometry('top-right','small').width);
 const both=makeSpec('editorial-cover',{headline:'Plans'},{heroPlacement:'full-bleed-bottom',cornerPlacement:'top-right',cornerScale:'large'},{hero:'blob:bottom',accent:'blob:corner'});
 assert.equal(both.spec.curated.slides[0].hero.placement,'full-bleed-bottom');assert.equal(both.spec.curated.slides[0].corner.placement,'top-right');assert.equal(both.spec.curated.slides[0].accents.length,0);
});
test('cover copy geometry is stable and additional graphics keep independent asset IDs',()=>{
 for(const scale of ['small','medium','large'])assert.equal(coverHeadlineHeight('full-bleed-bottom',scale,true),350);
 for(const placement of ['top-left','bottom-left','bottom-right','top-right']){
  const frame=coverFrameGeometry(placement,'medium');assert.equal(frame.width,540);assert.equal(frame.height,'auto');assert.equal(frame[placement.endsWith('left')?'left':'right'],0);assert.equal(frame[placement.startsWith('bottom')?'bottom':'top'],0);
  for(const images of [{},{hero:'blob:bottom'},{accent:'blob:accent'},{hero:'blob:bottom',accent:'blob:accent'}]){
   const {spec,assets}=makeSpec('editorial-cover',{headline:'Plans'},{heroPlacement:'full-bleed-bottom',cornerPlacement:placement},images),slide=spec.curated.slides[0];
   assert.equal(assets.length,Object.keys(images).length);assert.equal(slide.hero.assetId,images.hero?'lab-hero':null);assert.equal(slide.corner?.assetId,images.accent?'lab-accent':undefined);
  }
 }
});

test('Cover copy-space choice expands geometry and remains independent of upload state',()=>{
 assert.ok(coverHeadlineHeight('full-bleed-bottom','large',true,'expanded')>coverHeadlineHeight('full-bleed-bottom','large',true));
 for(const images of [{},{hero:'blob:bottom'},{accent:'blob:accent'},{hero:'blob:bottom',accent:'blob:accent'}]){
  const {spec}=makeSpec('editorial-cover',{headline:'Plans'},{copySpace:'expanded'},images);
  assert.equal(spec.curated.slides[0].copySpace,'expanded');
 }
});
test('Visual-above uses one asset contract for any image and preserves all semantic fields',()=>{
 const content={name:'A day out',hook:'Have a look',detail:'Bring snacks',location:'Brunswick East',price:'Free'};
 for(const url of ['blob:photo','blob:transparent'])for(const fit of ['cover','contain']){
  const {spec,assets}=makeSpec('curated-pick',content,{treatment:'visual-above',imageFit:fit,imageFocus:'bottom',wordmark:'show'},{visual:url});
  const slide=spec.curated.slides[0];assert.equal(slide.treatment,'visual-above');assert.equal(slide.visual.assetId,'lab-visual');assert.equal(slide.visual.fit,fit);assert.equal(slide.visual.focus,'bottom');assert.equal(assets.length,1);assert.equal(assets[0].url,url);assert.equal(slide.detail,content.detail);assert.equal(slide.price,content.price);assert.equal(spec.wordmark,'show');
 }
});
