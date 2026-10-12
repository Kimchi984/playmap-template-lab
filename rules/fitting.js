// Fit capacity is independent of intent. Typography and available geometry stay fixed.
export function monotonicHeadline(measurer,text,width,height,targets,floor,spec){
  const cap=measurer.fit(text,width,height,floor,Math.max(...Object.values(targets)),spec);
  const sizes=Object.fromEntries(Object.entries(targets).map(([intent,target])=>[intent,Math.min(target,cap.size)]));
  return {sizes,capacity:cap.size,fits:cap.fits,
    monotonic:sizes.large>=sizes.default&&sizes.default>=sizes.small,
    constrained:Object.fromEntries(Object.entries(targets).map(([k,target])=>[k,sizes[k]<target]))};
}
