import React from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {SocialArtwork} from '../source/components/admin/SocialArtwork';
import {defaultTextStyle,type SocialPostSpec,type SocialGraphicAsset} from '../source/lib/socialRenderer';
import {defaultListSpec} from '../source/lib/socialList';
import {createEditorialCover,createCuratedPick} from '../source/lib/socialCurated';
import {setLabDisplayFont} from '../source/lib/socialTypography';
import '@fontsource-variable/gabarito';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/instrument-sans';

export const SOURCE_COMMIT='ec495d390df67643d9206f0d65f30902883f4271';
const roots=new WeakMap<HTMLElement,Root>();
function text(value='',d:any={}){return {text:value,style:{...defaultTextStyle(),size:d.headlineSize||'default',align:d.alignment||'left',accentEnding:d.accentEnding||'none',accentColour:d.accentColour||'sunshine'}};}
function support(value=''){return {text:value,style:defaultTextStyle()};}
export function makeSpec(id:string,c:any,d:any,images:any={}){
  const assets:SocialGraphicAsset[]=[];
  function asset(name:string,url:string,role='hero'){const key=`lab-${name}`;if(url)assets.push({id:key,name,url,mimeType:'image/*',category:role,roles:[role as any],tags:[]});return url?key:null;}
  const panel=(which:string)=>({background:d[which+'Background']|| (which==='top'?'teal':'sunshine'),headline:text(c[which+'Headline'],d),supporting:support(c[which+'Supporting']),lower:support(),graphic:{assetId:asset(which,images[which+'Hero']),scale:d.graphicScale||'medium'}});
  const spec:SocialPostSpec={recipe:'big-type-accents',wordmark:d.wordmark||'show',background:d.background||'teal',headline:text(c.headline,d),supporting:support(c.supporting),lower:support(c.cta),topPanel:panel('top'),bottomPanel:panel('bottom'),overlays:[]};
  const hero=asset('hero',images.hero),accent=asset('accent',images.accent,'accent');
  if(id==='big-type'){
    if(hero)spec.overlays!.push({id:'hero',kind:'hero',assetId:hero,scale:d.graphicScale||'medium',x:600,y:740});
    if(accent)spec.overlays!.push({id:'accent',kind:'accent',assetId:accent,scale:'medium',x:840,y:238});
  }
  if(id==='split')spec.recipe='split';
  if(id==='list'){
    spec.recipe='list';const list=defaultListSpec();list.background=d.background||'teal';list.headline=text(c.headline,d);list.subheading=support(c.subheading);
    list.items=(c.items||[]).map((x:any,i:number)=>({id:String(i),primary:x.primary||'',secondary:x.secondary||'',third:x.third||''}));
    list.columns=d.columns==='auto'?'auto':Number(d.columns||1) as 1|2;
    list.numberStyle=d.numberStyle||'filled-circle';list.numberColour=d.numberColour==='cycle'?{mode:'cycle'}:{mode:'single',colour:d.numberColour||'sunshine'};
    list.density=d.density||'standard';list.position=d.position||'auto';list.primaryWeight=d.primaryWeight||'bold';
    list.footer.cta=support(d.footerMode==='none'?'':c.cta);list.footer.variant=d.footerMode==='search-pill'?'search-pill':'plain';
    list.footer.bottomMotif={assetId:asset('motif',images.motif,'bottom_motif'),scale:d.graphicScale||'medium'};spec.list=list;
  }
  if(id==='editorial-cover'){
    const slide=createEditorialCover('lab-cover');slide.background=d.background||'sunshine';slide.kicker=support(c.kicker);slide.headline=text(c.headline,d);slide.supporting=support(c.supporting);
    slide.hero={assetId:hero,scale:d.graphicScale||'large',placement:d.heroPlacement||'bottom-right'};
    slide.copySpace=d.copySpace||'image-reserved';
    if(accent){
      if(d.cornerPlacement==='small-accent')slide.accents=[{id:'accent',kind:'accent',assetId:accent,scale:d.cornerScale||'medium',x:840,y:238}];
      else slide.corner={assetId:accent,scale:d.cornerScale||'medium',placement:d.cornerPlacement||'top-right'};
    }
    spec.recipe='curated-picks';spec.curated={slides:[slide]};
  }
  if(id==='curated-pick'){
    const slide=createCuratedPick('lab-pick');slide.background=d.background||'warmLight';slide.name=text(c.name,d);slide.hook=support(c.hook);slide.detail=c.detail||'';slide.location=c.location||'';slide.price=c.price||'';
    slide.visualMode=d.visualMode||'photo';slide.photo={url:images.photo||c.photoUrl||null,focus:d.photoFocus||'center'};slide.graphic={assetId:hero,placement:d.graphicPlacement||'bleed-right'};
    if(d.treatment==='visual-above'){
      slide.treatment='visual-above';
      slide.visual={assetId:asset('visual',images.visual),fit:d.imageFit||'cover',focus:d.imageFocus||'center',background:d.visualBackground||'seafoam'};
    }
    spec.recipe='curated-picks';spec.curated={slides:[slide]};
  }
  return {spec,assets};
}
export async function prepareFonts(){
  for(const family of ['Gabarito Variable','DM Sans Variable','Instrument Sans Variable']){
    const loaded=await document.fonts.load(`600 32px "${family}"`,'Playmap');
    if(!loaded.length)throw new Error(`${family} did not load. Rendering paused.`);
  }
  await document.fonts.ready;
}
export function renderRestored(host:HTMLElement,id:string,c:any,d:any,images:any={},onListFit?:(r:any)=>void){
  setLabDisplayFont(d.displayFont||'gabarito');const {spec,assets}=makeSpec(id,c,d,images);
  host.className='stage';host.style.background='';
  let root=roots.get(host);if(!root){root=createRoot(host);roots.set(host,root)}
  flushSync(()=>root!.render(<SocialArtwork spec={spec} assets={assets} onListFit={onListFit}/>));
}

export {coverFrameGeometry,coverHeadlineHeight} from '../source/lib/socialImagePlacement';
