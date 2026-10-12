import {renderRestored,prepareFonts} from './dist/restored.js';
const $=id=>document.getElementById(id),qs=new URLSearchParams(location.search);
const state={template:qs.get('template')||'editorial-cover',fixture:qs.get('fixture')||''};
let catalog,recipe,fixtureSet,images={},generation=0,listReport=null;
const names={gabarito:'Gabarito','dm-sans':'DM Sans',centre:'Centre','filled-circle':'Filled circle','outlined-circle':'Outlined circle',plain:'Plain',pill:'Pill / tab','last-word':'Last word',auto:'Auto',cycle:'Playmap cycle',none:'None',show:'Show',hide:'Hide','search-pill':'Search pill','bottom-right':'Lower right',bottom:'Bottom',warmLight:'Warm light',blueTeal:'Blue teal',poolBlue:'Pool blue',sunshine:'Sunshine','bleed-right':'Bleed right','bleed-top-right':'Bleed top right','bleed-bottom-right':'Bleed bottom right'};
const name=v=>names[v]||v[0].toUpperCase()+v.slice(1);
async function fetchJson(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);return r.json()}
async function loadTemplate(){
 const entry=catalog.templates.find(x=>x.id===state.template)||catalog.templates.find(x=>x.id==='editorial-cover');state.template=entry.id;
 recipe=await fetchJson(entry.path);fixtureSet=await fetchJson(entry.fixtures);
 for(const value of Object.values(images))if(value)URL.revokeObjectURL(value);images={};listReport=null;
 $('template').value=state.template;$('fixture').replaceChildren();
 for(const f of fixtureSet.fixtures){const o=document.createElement('option');o.value=f.id;o.textContent=f.label||f.id;$('fixture').append(o)}
 if(!fixtureSet.fixtures.some(f=>f.id===state.fixture))state.fixture=fixtureSet.fixtures[0].id;$('fixture').value=state.fixture;
 for(const [key,o] of Object.entries(recipe.designOptions)){const q=qs.get(key);state[key]=o.values.includes(q)?q:o.default}
 controls();render();
}
function controls(){
 $('designControls').replaceChildren();
 for(const [key,spec] of Object.entries(recipe.designOptions)){
  const label=document.createElement('label');label.textContent=spec.label;const select=document.createElement('select');select.id=key;
  for(const v of spec.values){const o=document.createElement('option');o.value=v;o.textContent=name(v);select.append(o)}
  select.value=state[key];select.onchange=()=>{state[key]=select.value;render()};label.append(select);$('designControls').append(label);
 }
 $('assetControls').replaceChildren();const labels={hero:'Hero graphic',accent:'Accent graphic',topHero:'Top panel graphic',bottomHero:'Bottom panel graphic',motif:'Bottom motif',photo:'Photo'};
 for(const key of Object.keys(recipe.assetSlots||{})){
  const label=document.createElement('label');label.textContent=labels[key]+' · optional';const input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp,image/svg+xml';input.id=key+'File';
  input.onchange=()=>{if(images[key])URL.revokeObjectURL(images[key]);images[key]=input.files?.[0]?URL.createObjectURL(input.files[0]):'';render()};label.append(input);$('assetControls').append(label);
 }
 $('assetNote').hidden=!Object.keys(recipe.assetSlots||{}).length;
}
function url(){const q=new URLSearchParams({template:state.template,fixture:state.fixture,templateVersion:String(recipe.templateVersion)});for(const k of Object.keys(recipe.designOptions))q.set(k,state[k]);return location.origin+location.pathname+'?'+q}
function row(label,value,kind='pass'){const n=document.createElement('div');n.className='check';const a=document.createElement('span');a.textContent=label;const b=document.createElement('span');b.textContent=value;b.className=kind;n.append(a,b);return n}
function refreshChecks(){
 const nodes=[...$('stage').querySelectorAll('.social-headline-measure')],headlines=[...$('stage').querySelectorAll('h2')],sizes=headlines.map(h=>Math.round(parseFloat(getComputedStyle(h).fontSize)));
 const constrained=nodes.filter(n=>n.dataset.constrained==='true'),overflow=nodes.filter(n=>n.dataset.overflow==='true'),warnings=[];
 if(constrained.length)warnings.push(`${constrained.length} text block(s) limited by available space; requested size could not be reached.`);
 if(overflow.length)warnings.push('Some text cannot fit above its minimum size. Shorten the copy.');
 if(state.template==='list'&&listReport){if(listReport.overflow)warnings.push('List exceeds the safe area. Shorten copy, use Compact or two columns.');for(const i of listReport.tooManyLines)warnings.push(`Item ${i+1} exceeds three lines.`)}
 if(state.template==='curated-pick'&&!images[state.visualMode==='photo'?'photo':'hero'])warnings.push('No image supplied. The original image area stays empty; no filler graphic is invented.');
 $('checks').replaceChildren(row('Baseline','Lovable source ec495d3'),row('Fonts','Bundled real fonts'),row('Rendered headline',sizes.join(' / ')+'px'),...(state.template==='split'?[row('Shared Split size',sizes.length===2&&sizes[0]===sizes[1]?'PASS':'Pending',sizes.length===2&&sizes[0]===sizes[1]?'pass':'warn')]:[]),...(state.template==='list'&&listReport?[row('List fit scale',String(listReport.scale)),row('List fits',listReport.overflow?'Needs adjustment':'PASS',listReport.overflow?'fail':'pass')]:[]),row('Visual acceptance','Awaiting review','warn'));
 $('warnings').textContent=warnings.join(' ');$('warnings').hidden=!warnings.length;
}
function render(){
 const current=++generation,f=fixtureSet.fixtures.find(x=>x.id===state.fixture);
 renderRestored($('stage'),state.template,f.content,state,images,r=>{listReport=r;refreshChecks()});renderRestored($('stageMini'),state.template,f.content,state,images);
 $('recipeMeta').textContent=`${recipe.label} v${recipe.templateVersion} · restored source baseline. ${['editorial-cover','curated-pick'].includes(state.template)?'Mixed-post slide recipe.':''}`;
 $('testUrl').value=url();history.replaceState(null,'',url());updateScale();document.fonts.ready.then(()=>{if(current===generation)requestAnimationFrame(()=>{if(current===generation)refreshChecks()})});
}
function updateScale(){for(const wrap of document.querySelectorAll('.preview-wrap')){const stage=wrap.querySelector('.stage');if(stage){stage.style.transform=`scale(${wrap.clientWidth/1080})`;wrap.style.height=wrap.clientWidth*1.25+'px'}}}
$('template').onchange=()=>{state.template=$('template').value;state.fixture='';loadTemplate().catch(failure)};
$('fixture').onchange=()=>{state.fixture=$('fixture').value;render()};
$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(url());$('copyLink').textContent='Copied'}catch{$('testUrl').select();$('copyLink').textContent='Select + copy URL'}setTimeout(()=>$('copyLink').textContent='Copy test link',1200)};
$('nativeSize').onclick=()=>{document.body.classList.toggle('native-view');updateScale()};
function failure(e){$('status').textContent=e.message;$('status').className='fail'}
new ResizeObserver(updateScale).observe($('work'));window.addEventListener('resize',updateScale);
try{await prepareFonts();catalog=await fetchJson('recipes/catalog.json');for(const group of [...new Set(catalog.templates.map(x=>x.group))]){const g=document.createElement('optgroup');g.label=group;for(const entry of catalog.templates.filter(x=>x.group===group)){const opt=document.createElement('option');opt.value=entry.id;opt.textContent=entry.label;g.append(opt)}$('template').append(g)}await loadTemplate();$('status').textContent='Existing Playmap templates · improve one treatment at a time'}catch(e){failure(e)}
