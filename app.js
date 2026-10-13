import {renderRecipe,prepareFonts} from './dist/restored.js?v=c48ca4dfd272';
const $=id=>document.getElementById(id),qs=new URLSearchParams(location.search);
const state={template:qs.get('template')||'editorial-cover',fixture:qs.get('fixture')||''};
let catalog,recipe,fixtureSet,images={},generation=0,listReport=null;
const names={gabarito:'Gabarito','dm-sans':'DM Sans',centre:'Centre','filled-circle':'Filled circle','outlined-circle':'Outlined circle',plain:'Plain',pill:'Pill / tab','last-word':'Last word',auto:'Auto',cycle:'Playmap cycle',none:'None',show:'Show',hide:'Hide','search-pill':'Search pill','bottom-right':'Contained lower right',bottom:'Contained bottom','full-bleed-bottom':'Full-width bottom — preserve transparency','top-right':'Top right','top-left':'Top left','bottom-left':'Bottom left','full-frame':'Full-width overlay','small-accent':'Small accent',warmLight:'Warm light',blueTeal:'Blue teal',poolBlue:'Pool blue',sunshine:'Sunshine','bleed-right':'Bleed right','bleed-top-right':'Bleed top right','bleed-bottom-right':'Bleed bottom right'};
const name=v=>names[v]||v[0].toUpperCase()+v.slice(1);
async function fetchJson(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);return r.json()}
async function loadTemplate(){
 const entry=catalog.templates.find(x=>x.id===state.template)||catalog.templates.find(x=>x.id==='editorial-cover');state.template=entry.id;
 recipe=await fetchJson(entry.path);fixtureSet=await fetchJson(entry.fixtures);
 for(const value of Object.values(images))if(value)URL.revokeObjectURL(value);images={};listReport=null;
 $('template').value=state.template;$('fixture').replaceChildren();
 for(const f of fixtureSet.fixtures){const o=document.createElement('option');o.value=f.id;o.textContent=f.label||f.id;$('fixture').append(o)}
 if(!fixtureSet.fixtures.some(f=>f.id===state.fixture))state.fixture=fixtureSet.fixtures[0].id;$('fixture').value=state.fixture;
 for(const [key,o] of Object.entries(recipe.designOptions)){const q=qs.get(key);state[key]=o.values.includes(q)?q:(o.defaultBy?.values[state[o.defaultBy.control]]||o.default)}
 controls();render();
}
function controls(){
 $('designControls').replaceChildren();
 for(const [key,spec] of Object.entries(recipe.designOptions)){
  const label=document.createElement('label');label.textContent=spec.label;const select=document.createElement('select');select.id=key;select.setAttribute('aria-label',spec.label);
  for(const v of spec.values){const o=document.createElement('option');o.value=v;o.textContent=spec.valueLabels?.[v]||name(v);select.append(o)}
  select.disabled=spec.values.length===1;select.value=state[key];select.onchange=()=>{state[key]=select.value;for(const [dependent,spec] of Object.entries(recipe.designOptions))if(spec.defaultBy?.control===key)state[dependent]=spec.defaultBy.values[state[key]]||spec.default;render()};label.append(select);if(spec.help){const help=document.createElement('small');help.className='control-help';help.textContent=spec.help;label.append(help)}$('designControls').append(label);
 }
 $('assetControls').replaceChildren();const labels={hero:'Hero graphic',accent:'Accent graphic',topHero:'Top panel graphic',bottomHero:'Bottom panel graphic',motif:'Bottom motif',photo:'Photo'};
 for(const key of Object.keys(recipe.assetSlots||{})){
  const label=document.createElement('label');label.textContent=(recipe.assetSlots[key].label||labels[key])+(recipe.assetSlots[key].optional===false?' · required for this treatment':' · optional');const input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp,image/svg+xml';input.id=key+'File';
  const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+(recipe.assetSlots[key].label||labels[key]));remove.hidden=!images[key];remove.onclick=()=>{if(images[key])URL.revokeObjectURL(images[key]);delete images[key];input.value='';remove.hidden=true;render()};input.onchange=()=>{const previous=images[key];images[key]=input.files?.[0]?URL.createObjectURL(input.files[0]):'';remove.hidden=!images[key];render();if(previous)URL.revokeObjectURL(previous)};label.append(input,remove);$('assetControls').append(label);
 }
 $('assetNote').hidden=!Object.keys(recipe.assetSlots||{}).length;
}
function url(){const q=new URLSearchParams({template:state.template,fixture:state.fixture,templateVersion:String(recipe.templateVersion)});for(const k of Object.keys(recipe.designOptions))q.set(k,state[k]);return location.origin+location.pathname+'?'+q}
function row(label,value,kind='pass'){const n=document.createElement('div');n.className='check';const a=document.createElement('span');a.textContent=label;const b=document.createElement('span');b.textContent=value;b.className=kind;n.append(a,b);return n}
// Read alpha only to report overlap. It never changes rendering or fitting.
function coverGraphicWarnings(){
 const copy=$('stage').querySelector('[data-cover-copy],[data-pick-copy]');if(!copy)return [];
 const boxes=[...copy.querySelectorAll('h2,p:not([data-pick-price]),span.inline-block')].map(n=>n.getBoundingClientRect()),messages=[];
 for(const img of $('stage').querySelectorAll('[data-cover-graphic],[data-pick-image]')){
  if(!img.complete||!img.naturalWidth)continue;
  try{
   const frame=img.getBoundingClientRect(),ratio=Math.min(frame.width/img.naturalWidth,frame.height/img.naturalHeight);
   const width=img.naturalWidth*ratio,height=img.naturalHeight*ratio;
   const left=frame.left+(frame.width-width)/2,top=frame.bottom-height;
   const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)continue;ctx.drawImage(img,0,0);
   for(const box of boxes){
    const x=Math.max(0,Math.floor((box.left-left)/ratio)),y=Math.max(0,Math.floor((box.top-top)/ratio));
    const right=Math.min(canvas.width,Math.ceil((box.right-left)/ratio)),bottom=Math.min(canvas.height,Math.ceil((box.bottom-top)/ratio));
    if(right<=x||bottom<=y)continue;
    const pixels=ctx.getImageData(x,y,right-x,bottom-y).data;let opaque=0,total=0;
    for(let i=3;i<pixels.length;i+=16){total++;if(pixels[i]>=32)opaque++}
    if(opaque/total>.01){if(img.closest('[data-copy-protection="soft-fade"]')){messages.push('Image reaches the copy area; soft fade is active. Review readability.');break}messages.push(`${img.hasAttribute('data-pick-image')?'Image':img.dataset.coverGraphic==='main'?'Main graphic':'Additional graphic'} overlaps the copy area. Review its placement or size.`);break}
   }
  }catch{messages.push('Graphic overlap could not be inspected. Review the composition visually.')}
 }
 return messages;
}
function refreshChecks(){
 const nodes=[...$('stage').querySelectorAll('.social-headline-measure')],headlines=[...$('stage').querySelectorAll('h2')],sizes=headlines.map(h=>Math.round(parseFloat(getComputedStyle(h).fontSize)));
 const constrained=nodes.filter(n=>n.dataset.constrained==='true'),overflow=nodes.filter(n=>n.dataset.overflow==='true'),warnings=[];
 if(['editorial-cover','curated-pick'].includes(state.template))warnings.push(...coverGraphicWarnings());
 if(constrained.length)warnings.push(`${constrained.length} text block(s) limited by available space; requested size could not be reached.`);
 if(overflow.length)warnings.push('Some text cannot fit above its minimum size. Shorten the copy.');
 if(state.template==='list'&&state.footerMode==='graphic'&&!images.motif)warnings.push('No image supplied for the graphic footer.');
 if(state.template==='list'&&listReport){if(listReport.overflow)warnings.push('List exceeds the safe area. Shorten copy, use Compact or two columns.');for(const i of listReport.tooManyLines)warnings.push(`Item ${i+1} exceeds three lines.`)}
 if(state.template==='curated-pick'){const count=n=>n?Math.round(n.offsetHeight/parseFloat(getComputedStyle(n).lineHeight)):0;const title=count($('stage').querySelector('[data-pick-name]')||$('stage').querySelector('h2'));const lines=title+count($('stage').querySelector('[data-pick-hook]'))+count($('stage').querySelector('[data-pick-detail]'))+(state.priceAlignment==='left'?count($('stage').querySelector('[data-pick-location]'))+count($('stage').querySelector('[data-pick-price]')):Math.max(count($('stage').querySelector('[data-pick-location]')),count($('stage').querySelector('[data-pick-price]'))));if(lines>7||title>3)warnings.push(`Copy-heavy state (${lines} lines). Shorten copy for a clearer visual hierarchy.`);const copy=$('stage').querySelector('[data-pick-copy]');if(copy&&copy.scrollHeight>copy.clientHeight+1)warnings.push('Pick copy exceeds its safe area. Shorten the title or supporting copy.');if(!images.visual)warnings.push('No image supplied. Upload a photo or illustration for this treatment.');}
 $('checks').replaceChildren(row('Source origin','Lovable ec495d3'),row('Fonts','Bundled real fonts'),row('Rendered headline',sizes.length?sizes.join(' / ')+'px':'Not rendered',sizes.length?'pass':'fail'),...(['editorial-cover','curated-pick'].includes(state.template)?[row('Local images',`${[...$('stage').querySelectorAll('img')].filter(n=>n.complete&&n.naturalWidth).length} / ${Object.values(images).filter(Boolean).length} loaded`)]:[]),...(state.template==='split'?[row('Shared Split size',sizes.length===2&&sizes[0]===sizes[1]?'PASS':'Pending',sizes.length===2&&sizes[0]===sizes[1]?'pass':'warn')]:[]),...(state.template==='list'&&listReport?[row('List fit scale',String(listReport.scale)),row('List fits',listReport.overflow?'Needs adjustment':'PASS',listReport.overflow?'fail':'pass')]:[]),row('Visual acceptance','Awaiting review','warn'));
 $('warnings').textContent=warnings.join(' ');$('warnings').hidden=!warnings.length;
}
function render(){
 for(const [key,o] of Object.entries(recipe.designOptions)){if(o.valuesBy&&$(key)){const allowed=o.valuesBy.values[state[o.valuesBy.control]]||o.values;if(!allowed.includes(state[key]))state[key]=o.defaultBy?.values[state[o.defaultBy.control]]||allowed[0];$(key).replaceChildren(...allowed.map(v=>{const option=document.createElement('option');option.value=v;option.textContent=o.valueLabels?.[v]||name(v);return option}));}if($(key)){$(key).value=state[key];$(key).parentElement.hidden=o.visibleWhen?Object.entries(o.visibleWhen).some(([control,values])=>!values.includes(state[control])):false;}if(o.disabledWhen&&$(key))$(key).disabled=Object.entries(o.disabledWhen).some(([control,values])=>values.includes(state[control]))}
 for(const [key,o] of Object.entries(recipe.assetSlots||{}))if(o.disabledWhen&&$(key+'File'))$(key+'File').disabled=Object.entries(o.disabledWhen).some(([control,values])=>values.includes(state[control]));
 const current=++generation,f=fixtureSet.fixtures.find(x=>x.id===state.fixture);
 const design=Object.fromEntries(Object.keys(recipe.designOptions).map(k=>[k,state[k]]));renderRecipe($('stage'),recipe,f.content,design,images,r=>{listReport=r;refreshChecks()});renderRecipe($('stageMini'),recipe,f.content,design,images);
 $('recipeMeta').textContent=`${recipe.label} v${recipe.templateVersion} · ${recipe.labNote||'restored source baseline'}. ${['editorial-cover','curated-pick'].includes(state.template)?'Mixed-post slide recipe.':''}`;
 $('testUrl').value=url();history.replaceState(null,'',url());updateScale();document.fonts.ready.then(()=>{if(current===generation)requestAnimationFrame(()=>{if(current===generation)refreshChecks()})});
}
function updateScale(){for(const wrap of document.querySelectorAll('.preview-wrap')){const stage=wrap.querySelector('.stage');if(stage){stage.style.transform=`scale(${wrap.clientWidth/1080})`;wrap.style.height=wrap.clientWidth*1.25+'px'}}}
$('template').onchange=()=>{state.template=$('template').value;state.fixture='';loadTemplate().catch(failure)};
$('fixture').onchange=()=>{state.fixture=$('fixture').value;listReport=null;render()};
$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(url());$('copyLink').textContent='Copied'}catch{$('testUrl').select();$('copyLink').textContent='Select + copy URL'}setTimeout(()=>$('copyLink').textContent='Copy test link',1200)};
let checksFrame;
const scheduleChecks=()=>{cancelAnimationFrame(checksFrame);checksFrame=requestAnimationFrame(refreshChecks)};
new MutationObserver(scheduleChecks).observe($('stage'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','data-constrained','data-overflow','data-font-size']});
$('stage').addEventListener('load',scheduleChecks,true);
$('stage').addEventListener('error',scheduleChecks,true);
$('nativeSize').onclick=()=>{document.body.classList.toggle('native-view');updateScale()};
function failure(e){$('status').textContent=e.message;$('status').className='fail'}
new ResizeObserver(updateScale).observe($('work'));window.addEventListener('resize',updateScale);
try{await prepareFonts();catalog=await fetchJson('recipes/catalog.json');for(const group of [...new Set(catalog.templates.map(x=>x.group))]){const g=document.createElement('optgroup');g.label=group;for(const entry of catalog.templates.filter(x=>x.group===group)){const opt=document.createElement('option');opt.value=entry.id;opt.textContent=entry.label;g.append(opt)}$('template').append(g)}await loadTemplate();$('status').textContent='Existing Playmap templates · improve one treatment at a time'}catch(e){failure(e)}
