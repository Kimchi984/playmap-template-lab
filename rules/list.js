import {applyType,typeSpec} from './typography.js';
import {monotonicHeadline} from './fitting.js';

const C={teal:'#0F7C78',mint:'#D8F1E6',yellow:'#F4D84A',pink:'#F59AC2',blue:'#6EC5E9',orange:'#F7A046',lilac:'#A999F5',paper:'#F7F8F5'};
function el(tag,cls,text,parent){const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;if(parent)parent.append(n);return n;}
function box(n,x,y,w,h){Object.assign(n.style,{position:'absolute',left:`${x}px`,top:`${y}px`,width:`${w}px`,...(h===undefined?{}:{height:`${h}px`})});}
// These are composition rules, not alternate manifests. The recipe chooses the registered rule.
const grammars={
  'list-clean-composition-v2': {name:'clean',headline:{x:84,y:152,w:912,maxH:360,targets:{small:92,default:112,large:136}},
    rows:{x:84,w:912,gap:20,colGap:42,number:52,textGap:20,inset:0,base:46,floor:32,meta:26,third:23},headerGap:38,bottom:1210},
  'list-playful-composition-v2': {name:'playful',headline:{x:82,y:152,w:860,maxH:395,targets:{small:108,default:132,large:160}},
    rows:{x:82,w:916,gap:17,colGap:40,number:80,textGap:22,inset:24,base:46,floor:32,meta:26,third:23},headerGap:36,bottom:1194},
  'list-poster-composition-v2': {name:'poster',headline:{x:186,y:159,w:814,maxH:430,targets:{small:126,default:154,large:184}},
    rows:{x:62,w:956,gap:28,colGap:34,number:90,textGap:16,inset:0,base:46,floor:32,meta:26,third:23},headerGap:42,bottom:1190}
};
function rowLayout(c,g,cols,measurer,fontSize){
  const r=g.rows,per=Math.ceil(c.items.length/cols),colW=(r.w-r.colGap*(cols-1))/cols;
  const inset=g.name==='playful'&&cols===1?r.inset:0;
  const width=colW-r.number-r.textGap-inset;
  const primary=typeSpec('dm-sans','support',{weight:800,lineHeight:1.08,tracking:-.018});
  const meta=typeSpec('dm-sans','metadata',{lineHeight:1.18});
  const scale=fontSize/r.base,metaSize=Math.max(21,Math.round(r.meta*scale)),thirdSize=Math.max(20,Math.round(r.third*scale));
  const entries=c.items.map((item,i)=>{
    const p=measurer.measure(item.primary,width,fontSize,primary),s=measurer.measure(item.secondary||'',width,metaSize,meta),t=measurer.measure(item.third||'',width,thirdSize,meta);
    const textHeight=p.height+(s.height?7+s.height:0)+(t.height?5+t.height:0);
    return {item,index:i,width,col:Math.floor(i/per),height:Math.max(textHeight,g.name==='poster'?fontSize*1.6:r.number),p,s,t};
  });
  const groups=Array.from({length:cols},(_,i)=>entries.filter(x=>x.col===i));
  const heights=groups.map(xs=>xs.reduce((sum,x)=>sum+x.height,0)+Math.max(0,xs.length-1)*r.gap);
  return {entries,groups,height:Math.max(...heights),heights,colW,inset,fontSize,metaSize,thirdSize,primary,meta,
    fitsWidth:entries.every(x=>[x.p,x.s,x.t].every(m=>m.width<=width))};
}
function graphic(stage,g,headerBottom){
  if(g.name==='playful'){
    const rail=el('div','list-colour-rail',undefined,stage);box(rail,0,headerBottom+20,30,g.bottom-headerBottom-20);
    rail.style.background=C.pink;
    // A flat route/arrow motif owns the top-right gutter, rather than filling list whitespace.
    const motif=el('div','list-route',undefined,stage);box(motif,944,123,88,260);
    motif.innerHTML='<svg viewBox="0 0 88 260" width="88" height="260" aria-hidden="true"><path d="M10 8h45v85H20v80h48v52" fill="none" stroke="#F59AC2" stroke-width="17" stroke-linecap="square"/><path d="m40 216 28 30 20-30" fill="none" stroke="#F4D84A" stroke-width="13"/></svg>';
  }
  if(g.name==='poster'){
    const ribbon=el('div','list-ribbon',undefined,stage);box(ribbon,-24,100,1200,22);ribbon.style.background=C.pink;ribbon.style.transform='rotate(-3deg)';
    const count=el('div','list-count',String(stage.dataset.count).padStart(2,'0'),stage);box(count,-12,161,182,190);
    applyType(count,typeSpec('gabarito','display',{tracking:-.08,lineHeight:1}),172);count.style.color=C.teal;
  }
}
export function renderList(stage,c,design,recipe,measurer){
  const rule=recipe.compositions[design.artDirection].layoutRule,g=grammars[rule];
  if(!g)throw new Error(`Unregistered List composition: ${rule}`);
  stage.replaceChildren();stage.className=`stage list-art list-${g.name}`;stage.dataset.count=c.items.length;
  stage.style.background=g.name==='clean'?C.paper:g.name==='playful'?C.teal:C.yellow;
  const h=g.headline,display=typeSpec(design.displayFont,'display',{lineHeight:g.name==='poster'?.93:.96});
  const cols=design.columns==='auto'?(c.items.length>8?2:g.name==='poster'&&c.items.length>=5?2:1):Number(design.columns);
  const minRows=rowLayout(c,g,cols,measurer,g.rows.floor);
  const subSpec=typeSpec('dm-sans','support'),subHeight=measurer.measure(c.subheading||'',h.w,28,subSpec).height;
  const headerRoom=Math.min(h.maxH,g.bottom-h.y-g.headerGap-minRows.height-(subHeight?18+subHeight:0));
  const fit=monotonicHeadline(measurer,c.headline,h.w,headerRoom,h.targets,56,display),fontSize=fit.sizes[design.headlineSize];
  const headlineMetrics=measurer.measure(c.headline,h.w,fontSize,display);
  const headerBottom=h.y+headlineMetrics.height+(subHeight?18+subHeight:0),rowTop=headerBottom+g.headerGap;
  let rows;
  for(let size=g.rows.base;size>=g.rows.floor;size--){
    rows=rowLayout(c,g,cols,measurer,size);if(rows.height<=g.bottom-rowTop&&rows.fitsWidth)break;
  }
  const rowFits=rows.height<=g.bottom-rowTop&&rows.fitsWidth;
  const wordmark=el('div','list-wordmark','the playmap',stage);box(wordmark,84,58,750);applyType(wordmark,typeSpec('dm-sans','support',{weight:800,tracking:-.045}),36);
  const head=el('h2','list-headline',undefined,stage);box(head,h.x,h.y,h.w);applyType(head,display,fontSize);
  if(g.name==='playful'){
    const match=c.headline.match(/^(.*?)(\S+\s*)$/s);if(match){head.append(document.createTextNode(match[1]));el('span','list-headline-accent',match[2],head);}else head.textContent=c.headline;
  }else head.textContent=c.headline;
  if(c.subheading){const sub=el('div','list-subheading',c.subheading,stage);box(sub,h.x,h.y+headlineMetrics.height+18,h.w);applyType(sub,subSpec,28);}
  graphic(stage,g,headerBottom);
  if(g.name==='playful'){const panel=el('div','list-playful-panel',undefined,stage);box(panel,54,rowTop-20,1026,1230-rowTop);panel.style.background=C.mint;}
  if(g.name==='poster'){
    const panel=el('div','list-poster-panel',undefined,stage);box(panel,0,rowTop-20,1080,1350-rowTop+20);panel.style.background=C.teal;
  }
  const list=el('ol','list-rows',undefined,stage);box(list,g.rows.x,rowTop,g.rows.w,Math.max(0,g.bottom-rowTop));
  list.style.overflow='hidden';list.style.padding='0';list.style.margin='0';
  rows.groups.forEach((group,col)=>{
    let y=0;
    const surplus=rowFits?Math.max(0,g.bottom-rowTop-rows.heights[col]):0;
    // Poster stretches its number rhythm. Others preserve header-connected spacing.
    const gap=g.rows.gap+(g.name==='poster'&&group.length>1?Math.min(62,surplus/(group.length-1)):0);
    group.forEach((x,j)=>{
      const shift=g.name==='playful'&&cols===1&&j%2?rows.inset:0;
      const row=el('li','list-row',undefined,list);box(row,col*(rows.colW+g.rows.colGap)+shift,y,rows.colW-shift,x.height);
      row.style.listStyle='none';row.dataset.number=x.index+1;
      const n=el('div','list-number',String(x.index+1).padStart(g.name==='clean'?2:1,'0'),row);
      box(n,0,0,g.rows.number,g.name==='poster'?x.height:g.rows.number);
      applyType(n,typeSpec('dm-sans','support',{weight:900,lineHeight:1,tracking:-.05}),g.name==='poster'?Math.round(rows.fontSize*1.9):g.name==='playful'?42:28);
      if(g.name==='playful')n.style.background=[C.yellow,C.pink,C.blue,C.orange,C.lilac][x.index%5];
      const text=el('div','list-row-copy',undefined,row);box(text,g.rows.number+g.rows.textGap,0,x.width);
      applyType(el('div','list-primary',x.item.primary,text),rows.primary,rows.fontSize);
      if(x.item.secondary){const s=el('div','list-secondary',x.item.secondary,text);s.style.marginTop='7px';applyType(s,rows.meta,rows.metaSize);s.style.marginTop='7px';}
      if(x.item.third){const t=el('div','list-third',x.item.third,text);applyType(t,rows.meta,rows.thirdSize);t.style.marginTop='5px';}
      y+=x.height+gap;
    });
  });
  if(c.cta){const footer=el('div','list-footer',c.cta,stage);box(footer,g.name==='poster'?62:84,1250,g.name==='poster'?956:912);applyType(footer,typeSpec('dm-sans','cta',{weight:800}),24);}
  stage.dataset.fontSize=fontSize;stage.dataset.rowSize=rows.fontSize;
  stage.dataset.expectedHeadlineHeight=headlineMetrics.height;stage.dataset.expectedRowHeight=rows.height;
  const warnings=[];
  if(fit.constrained[design.headlineSize])warnings.push(`${design.headlineSize} target ${h.targets[design.headlineSize]}px limited to ${fontSize}px by real content/geometry.`);
  if(!fit.fits)warnings.push('Headline cannot fit above the 56px floor. Shorten the headline.');
  if(!rowFits)warnings.push('Items cannot fit above the readability floor. Shorten copy or use more than one slide.');
  const footerMetrics=measurer.measure(c.cta||'',g.name==='poster'?920:912,24,typeSpec('dm-sans','cta',{weight:800}));
  const footerFits=footerMetrics.height<=80&&footerMetrics.width<=(g.name==='poster'?920:912);
  if(!footerFits)warnings.push('CTA exceeds the footer area; shorten it.');
  return {fontSize,sizes:fit.sizes,targets:h.targets,monotonic:fit.monotonic,headlineFits:fit.fits,rowFits,footerFits,
    rows,cols,rule,headerBottom,rowTop,warnings,headlineMetrics,display};
}
