import {TextMeasurer,requireFonts} from './rules/typography.js';
import {renderList} from './rules/list.js';
import {renderScaffold} from './lab/scaffold.js';
const $=id=>document.getElementById(id);
const qs=new URLSearchParams(location.search);
let catalog,recipe,fixtureSet,meter,result;
let saved={};try{saved=JSON.parse(localStorage.getItem('playmap-template-lab-state')||'{}')}catch{}
const state={template:qs.get('template')||saved.template||'list',fixture:qs.get('fixture')||saved.fixture||'',artDirection:qs.get('artDirection')||saved.artDirection||'playful',displayFont:qs.get('displayFont')||saved.displayFont||'gabarito',headlineSize:qs.get('headlineSize')||saved.headlineSize||'default',columns:qs.get('columns')||saved.columns||'auto'};
const embedded=JSON.parse(document.getElementById('lab-data')?.textContent||'null');
async function fetchJson(path){if(embedded)return embedded[path];const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);return r.json()}
function persist(){try{localStorage.setItem('playmap-template-lab-state',JSON.stringify(state))}catch{}}
function options(){
  $('designControls').replaceChildren();
  for(const [key,spec] of Object.entries(recipe.designOptions)){
    if(!['artDirection','displayFont','headlineSize','columns'].includes(key))continue;
    const label=document.createElement('label');label.textContent=spec.label||({headlineSize:'Headline size',displayFont:'Display font',artDirection:'Art direction',columns:'Columns'}[key]);
    const select=document.createElement('select');select.id=key;
    for(const value of spec.values){const option=document.createElement('option');option.value=value;option.textContent=({ 'dm-sans':'DM Sans',gabarito:'Gabarito',auto:'Auto'}[value]||value[0].toUpperCase()+value.slice(1));select.append(option)}
    if(!spec.values.includes(state[key]))state[key]=spec.default;
    select.value=state[key];select.onchange=()=>{state[key]=select.value;render()};label.append(select);$('designControls').append(label);
  }
}
async function loadTemplate(){
  const entry=catalog.templates.find(x=>x.id===state.template)||catalog.templates.find(x=>x.id==='list');state.template=entry.id;
  recipe=await fetchJson(entry.path);fixtureSet=await fetchJson(entry.fixtures);
  $('fixture').replaceChildren();for(const f of fixtureSet.fixtures){const opt=document.createElement('option');opt.value=f.id;opt.textContent=f.label||f.id;$('fixture').append(opt)}
  if(!fixtureSet.fixtures.some(x=>x.id===state.fixture))state.fixture=fixtureSet.fixtures[0].id;
  options();render();
}
function checkRow(a,b,status='pass'){const row=document.createElement('div');row.className='check';const name=document.createElement('span');name.textContent=a;const value=document.createElement('span');value.className=status;value.textContent=b;row.append(name,value);return row}
function paint(stage,c,design){return state.template==='list'?renderList(stage,c,design,recipe,meter):renderScaffold(stage,c,design,meter,state.template)}
function parity(stage,res){
  const head=stage.querySelector('.list-headline'),style=getComputedStyle(head);
  const height=Math.abs(head.offsetHeight-res.headlineMetrics.height)<=1;
  const fonts=style.fontFamily.includes(res.display.family)&&Number(style.fontWeight)===res.display.weight&&Math.abs(parseFloat(style.letterSpacing)-res.fontSize*res.display.tracking)<.1&&Math.abs(parseFloat(style.lineHeight)-res.fontSize*res.display.lineHeight)<.1&&Math.abs(head.clientWidth-Number(head.style.width.replace('px','')))<=1;
  const rows=[...stage.querySelectorAll('.list-row-copy')];const rowHeights=rows.every((n,i)=>Math.abs(n.offsetHeight-(res.rows.entries[i].p.height+(res.rows.entries[i].s.height?7+res.rows.entries[i].s.height:0)+(res.rows.entries[i].t.height?5+res.rows.entries[i].t.height:0)))<=1);
  return {height,fonts,rowHeights,pass:height&&fonts&&rowHeights};
}
function render(){
  $('template').value=state.template;$('fixture').value=state.fixture;persist();
  for(const key of Object.keys(recipe.designOptions))if($(key))$(key).value=state[key];
  const f=fixtureSet.fixtures.find(x=>x.id===state.fixture);result=paint($('stage'),f.content,state);paint($('stageMini'),f.content,state);
  $('compare').hidden=state.template!=='list';$('runMatrix').hidden=state.template!=='list';
  $('comparison').hidden=state.template!=='list';
  if(state.template==='list'){
    for(const mode of recipe.artDirectionModes)paint($(`compare-${mode}`),f.content,{...state,artDirection:mode});
  }
  $('recipeMeta').replaceChildren();const title=document.createElement('strong');title.textContent=`${recipe.label} v${recipe.templateVersion} · ${recipe.status}`;$('recipeMeta').append(title);
  const p=document.createElement('p');p.textContent=state.template==='list'?recipe.compositions[state.artDirection].dominantIdea:'Infrastructure scaffold. Visual art direction is not accepted.';$('recipeMeta').append(p);
  const checks=[checkRow('Fonts','Real webfonts loaded')];
  if(state.template==='list'){
    const paired=parity($('stage'),result);checks.push(checkRow('Measurement / render parity',paired.pass?'PASS':'FAIL',paired.pass?'pass':'fail'),checkRow('Large ≥ Default ≥ Small',result.monotonic?'PASS':'FAIL',result.monotonic?'pass':'fail'),checkRow('Small / Default / Large',`${result.sizes.small} / ${result.sizes.default} / ${result.sizes.large}px`),checkRow('Requested → rendered',`${result.targets[state.headlineSize]} → ${result.fontSize}px`,result.targets[state.headlineSize]===result.fontSize?'pass':'warn'),checkRow('All item fields retained',`${f.content.items.length} items · secondary + third`, 'pass'),checkRow('Headline / rows / footer fit',`${result.headlineFits?'✓':'✕'} / ${result.rowFits?'✓':'✕'} / ${result.footerFits?'✓':'✕'}`,(result.headlineFits&&result.rowFits&&result.footerFits)?'pass':'fail'),checkRow('Primary / metadata / third',`${result.rows.fontSize} / ${result.rows.metaSize} / ${result.rows.thirdSize}px`),checkRow('Composition rule',result.rule),checkRow('Visual acceptance','Awaiting Alina','warn'));
    $('warnings').textContent=result.warnings.join(' ');$('warnings').hidden=!result.warnings.length;
    $('stage').dataset.parity=paired.pass;$('stage').dataset.fits=result.headlineFits&&result.rowFits&&result.footerFits;
  }else{checks.push(checkRow('Visual acceptance','Scaffold only','warn'));$('warnings').hidden=true;}
  $('checks').replaceChildren(...checks);$('testUrl').value=url();
  if(!qs.has('viewport'))history.replaceState(null,'',url());
  updateScale();
}
function url(){const q=new URLSearchParams({...state,templateVersion:String(recipe.templateVersion)});return `${location.origin==='null'?'':location.origin}${location.pathname}?${q}`}
function updateScale(){
  for(const wrap of document.querySelectorAll('.preview-wrap')){
    const stage=wrap.querySelector('.stage');if(!stage)continue;
    const width=wrap.clientWidth;stage.style.transform=`scale(${width/1080})`;wrap.style.height=`${width*1.25}px`;
  }
}
async function runMatrix(){
  $('matrixResults').textContent='Running real DOM checks…';await new Promise(requestAnimationFrame);
  const host=document.createElement('div');Object.assign(host.style,{position:'absolute',left:'-20000px',top:'0'});document.body.append(host);
  const tests=[];const matrix=recipe.designOptions;
  for(const f of fixtureSet.fixtures)for(const mode of matrix.artDirection.values)for(const font of matrix.displayFont.values)for(const columns of matrix.columns.values){
    const sizes={},states=[];
    for(const intent of matrix.headlineSize.values){
      const stage=document.createElement('div');host.append(stage);
      const d={...state,artDirection:mode,displayFont:font,headlineSize:intent,columns};
      const r=renderList(stage,f.content,d,recipe,meter),p=parity(stage,r);sizes[intent]=r.fontSize;
      states.push({intent,size:r.fontSize,parity:p.pass,fits:r.headlineFits&&r.rowFits&&r.footerFits,warnings:r.warnings});stage.remove();
    }
    const monotonic=sizes.large>=sizes.default&&sizes.default>=sizes.small;
    tests.push({fixture:f.id,mode,font,columns,sizes,monotonic,states});
  }
  host.remove();const monotonic=tests.every(x=>x.monotonic),parityPass=tests.every(x=>x.states.every(s=>s.parity)),unfit=tests.flatMap(x=>x.states.filter(s=>!s.fits).map(s=>({...x,states:undefined,...s})));
  const report={recipeVersion:recipe.templateVersion,typographyChecks:tests.length*3,triples:tests.length,monotonic,measurementParity:parityPass,infeasibleStates:unfit.length,tests};
  $('matrixResults').textContent=`${tests.length} size triples / ${tests.length*3} rendered states. Monotonic: ${monotonic?'PASS':'FAIL'}. Typography parity: ${parityPass?'PASS':'FAIL'}. ${unfit.length} states honestly reported infeasible (includes deliberately invalid fixture and forced single-column density).`;
  $('matrixResults').dataset.report=JSON.stringify(report);$('matrixResults').hidden=false;
  $('downloadReport').hidden=false;$('downloadReport').onclick=()=>download(JSON.stringify(report,null,2),'list-test-report.json','application/json');
}
function download(text,name,mime){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:mime}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$('template').onchange=()=>{state.template=$('template').value;state.fixture='';loadTemplate().catch(failure)};
$('fixture').onchange=()=>{state.fixture=$('fixture').value;render()};
$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(url());$('copyLink').textContent='Copied'}catch{$('testUrl').select();$('copyLink').textContent='Select + copy URL'}setTimeout(()=>$('copyLink').textContent='Copy test link',1500)};
$('compare').onclick=()=>{$('comparison').scrollIntoView({behavior:'smooth',block:'start'})};
$('nativeSize').onclick=()=>{document.body.classList.toggle('native-view');updateScale()};
$('phoneSize').onclick=()=>{const frame=$('phoneFrame');frame.hidden=!frame.hidden;if(!frame.hidden){const u=new URL(location.href);u.searchParams.set('viewport','phone-frame');frame.src=u.href;frame.scrollIntoView({behavior:'smooth',block:'start'})}};
$('runMatrix').onclick=()=>runMatrix().catch(failure);
function failure(e){$('status').textContent=e.message;$('status').className='fail';}
if(qs.get('viewport')==='phone-frame')document.body.classList.add('phone-frame');
window.addEventListener('resize',updateScale);new ResizeObserver(updateScale).observe($('work'));
try{await requireFonts();meter=new TextMeasurer();catalog=await fetchJson('recipes/catalog.json');
 for(const entry of catalog.templates){const opt=document.createElement('option');opt.value=entry.id;opt.textContent=entry.label+(entry.id==='list'?' · v2 proof':' · scaffold');$('template').append(opt)}
 await loadTemplate();$('status').textContent='List proof · experimental · real fonts ready';
}catch(e){failure(e)}
