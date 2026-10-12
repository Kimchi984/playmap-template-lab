// One specification is applied to the real DOM and its untransformed measurer.
export const FONTS = {gabarito:'Gabarito', 'dm-sans':'DM Sans'};
export function typeSpec(font='gabarito', role='display', overrides={}) {
  return {family:role==='display'?FONTS[font]:'DM Sans', weight:role==='display'?900:600,
    tracking:role==='display'?-.035:0, lineHeight:role==='display'?.96:1.2,
    opticalSizing:'none', ...overrides};
}
export function applyType(node,spec,size) {
  Object.assign(node.style,{fontFamily:`"${spec.family}",sans-serif`,fontWeight:String(spec.weight),
    fontSize:`${size}px`,letterSpacing:`${spec.tracking}em`,lineHeight:String(spec.lineHeight),
    fontOpticalSizing:spec.opticalSizing,fontKerning:'normal',whiteSpace:'pre-wrap',
    overflowWrap:'normal',wordBreak:'normal',margin:'0'});
}
export async function requireFonts() {
  for(const family of Object.values(FONTS)) {
    for(const weight of [600,800,900]) {
      const loaded=await document.fonts.load(`${weight} 40px "${family}"`,'Melbourne weekend 013');
      if(!loaded.length) throw new Error(`${family} ${weight} did not load; fitting is paused.`);
    }
  }
  await document.fonts.ready;
}
export class TextMeasurer {
  constructor(){
    this.node=document.createElement('div'); this.node.dataset.measurement='real-font-measurement-v2';
    Object.assign(this.node.style,{position:'fixed',left:'-20000px',top:'0',visibility:'hidden',
      boxSizing:'border-box',padding:'0',border:'0',transform:'none',height:'auto'});
    this.node.setAttribute('aria-hidden','true'); document.body.append(this.node); this.cache=new Map();
  }
  measure(text,width,size,spec){
    const key=JSON.stringify([text,width,size,spec]); if(this.cache.has(key))return this.cache.get(key);
    this.node.style.width=`${width}px`; applyType(this.node,spec,size);this.node.textContent=text;
    const height=text?this.node.getBoundingClientRect().height:0;
    const metrics={height,width:this.node.scrollWidth,lines:text?Math.round(height/(size*spec.lineHeight)):0};
    this.cache.set(key,metrics);return metrics;
  }
  fit(text,width,height,min,max,spec){
    let low=min,high=max,best=null;
    while(low<=high){const size=Math.floor((low+high)/2),m=this.measure(text,width,size,spec);
      if(m.height<=height+.1 && m.width<=width){best=size;low=size+1;}else high=size-1;}
    return {size:best??min,fits:best!==null,metrics:this.measure(text,width,best??min,spec)};
  }
}
