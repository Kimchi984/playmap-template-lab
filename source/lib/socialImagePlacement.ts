import type { SocialGraphicScale } from './socialRenderer';

/** Frame-based artwork keeps its transparent composition; it is never fitted into a square. */
export const COVER_CORNER_WIDTHS = { small: 360, medium: 540, large: 720 } as const;
export function coverFrameGeometry(placement: 'full-bleed-bottom' | 'top-right' | 'full-frame', scale: SocialGraphicScale) {
  const common = { height: 'auto' as const, maxWidth: 'none' as const, display: 'block' };
  if (placement === 'full-bleed-bottom') return { ...common, width: 1080, left: 0, bottom: 0 };
  if (placement === 'full-frame') return { ...common, width: 1080, right: 0, top: 0 };
  return { ...common, width: COVER_CORNER_WIDTHS[scale], right: 0, top: 0 };
}

/** Read alpha only for text safety; the source image/frame is never cropped or rewritten. */
export function firstVisibleRow(alpha: Uint8ClampedArray, width: number, height: number, left=0, right=width) {
  for(let y=0;y<height;y++)for(let x=Math.max(0,Math.floor(left));x<Math.min(width,Math.ceil(right));x++) {
    if(alpha[(y*width+x)*4+3]>0)return y;
  }
  return null;
}
export function bottomFrameVisibleTop(width:number,height:number,visibleRow:number|null) {
  return visibleRow===null?1350:Math.max(0,Math.min(1350,1350-(height-visibleRow)*1080/width));
}
export function measureBottomFrame(image:HTMLImageElement) {
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)return null;
  context.drawImage(image,0,0);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
  const row=firstVisibleRow(pixels,canvas.width,canvas.height,84/1080*canvas.width,996/1080*canvas.width);
  return bottomFrameVisibleTop(canvas.width,canvas.height,row);
}
