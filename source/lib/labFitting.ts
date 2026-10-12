import { DISPLAY_SIZE_MULTIPLIER, TEXT_SIZE_MULTIPLIER, type SocialTextSize } from './socialRenderer';
import { socialTypography } from './socialTypography';

const INTENTS: SocialTextSize[] = ['small','default','large'];
export function measureFittedText(node: HTMLElement, text: string, width: number, height: number, min: number, ceiling: number, intent: SocialTextSize, display: boolean, weight: number, lineHeight: number) {
  node.textContent=text;node.style.width=`${width}px`;
  node.style.whiteSpace=node.dataset.singleLine==='true'?'nowrap':'pre-wrap';node.style.overflowWrap='normal';node.style.wordBreak='normal';
  let cap=Infinity;
  const multipliers=display?DISPLAY_SIZE_MULTIPLIER:TEXT_SIZE_MULTIPLIER;
  // Fit all typography variants against identical geometry. The shared capacity
  // ensures a wrap/weight transition cannot reverse the size hierarchy.
  for(const size of INTENTS){
    const t=socialTypography(display?'display':'support',size,weight,lineHeight);
    Object.assign(node.style,t);let low=min,high=Math.floor(ceiling*multipliers.large),best=0;
    while(low<=high){const middle=Math.floor((low+high)/2);node.style.fontSize=`${middle}px`;
      if(node.scrollHeight<=height&&node.scrollWidth<=width){best=middle;low=middle+1;}else high=middle-1;}
    cap=Math.min(cap,best);
  }
  const target=Math.round(ceiling*multipliers[intent]);
  const fontSize=Math.max(min,Math.min(target,cap));const typography=socialTypography(display?'display':'support',intent,weight,lineHeight);
  Object.assign(node.style,typography);node.style.fontSize=`${fontSize}px`;
  return {fontSize,height:node.scrollHeight,target,constrained:fontSize<target,overflow:cap<min};
}
