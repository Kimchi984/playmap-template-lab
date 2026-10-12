import { resolveWordmarkVisible } from "@/lib/socialRenderer";
import { forwardRef, useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import { SocialDisplayText } from "./SocialDisplayText";
import { Wordmark } from "@/components/Wordmark";
import {
  SOCIAL_GRAPHIC_SIZES, SOCIAL_PALETTE, SOCIAL_SPLIT_PANEL_HEIGHT, SOCIAL_SPLIT_FOOTER_HEIGHT, TEXT_NUDGE_PX, TEXT_SIZE_MULTIPLIER,
  bigTypeOverlays, bigTypeTextLayout, defaultTextStyle, overlaySize, normaliseSocialText, textColour, splitFooterLayout, socialTextAlign,
  headlineFitBox, DISPLAY_CEILINGS, displayTypography, type SocialTextSize,
  type SocialGraphicAsset, type SocialGraphicSlot, type SocialPostSpec, type SocialTextBlock, type SplitPanelSpec,
} from "@/lib/socialRenderer";
import {
  LIST_FOOTER_HEIGHT, LIST_MIN_FIT_SCALE, LIST_PADDING_X, LIST_COLUMN_GAP,
  listPrimaryFontWeight, listVerticalLayout, sameListFitReport, listFooterSlots, columnWidth, defaultListSpec, distributeListColumns, listFitReport, listMetrics, listNumberColour, listNumberTreatment, resolveListColumns,
  type ListFitReport, type SocialListSpec,
} from "@/lib/socialList";

import { EDITORIAL_COVER_HERO_SIZES, CURATED_GRAPHIC_BOXES, CURATED_PHOTO_HEIGHT, clampSlideIndex, curatedPost, normaliseCoverAccents, pickNumber, resolvePickVisual, curatedNumberTreatment, curatedCopyMask, type EditorialCoverSlideSpec, type CuratedPickSlideSpec } from "@/lib/socialCurated";
import { BOTTOM_MOTIF_HEIGHTS, bottomMotifGeometry, ctaInlineLayout, splitCtaAccents } from "@/lib/socialFooter";
import { socialTypography, waitForSocialFont } from "@/lib/socialTypography";

export const SOCIAL_ARTWORK_WIDTH = 1080;
export const SOCIAL_ARTWORK_HEIGHT = 1350;
type Fit = { fontSize: number; height: number; target?: number; constrained?: boolean; overflow?: boolean };
import { measureFittedText } from "@/lib/labFitting";
import { coverFrameGeometry, coverHeadlineHeight } from "@/lib/socialImagePlacement";

function useHeadlineFit(text: string, boxWidth: number, boxMaxHeight: number, minSize: number, boxMaxSize: number, lineHeight: number, size: SocialTextSize = "default", display = false, weight = 700) {
  const role = display ? "display" : "support";
  const typography = socialTypography(role, size, weight, lineHeight);
  const { fontFamily, fontWeight, letterSpacing, lineHeight: measuredLineHeight } = typography;
  const measureNode = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit>({fontSize:boxMaxSize,height:boxMaxSize*measuredLineHeight});
  const measure = useCallback(() => {
    const node=measureNode.current;if(!node)return;
    const next=measureFittedText(node,text,boxWidth,boxMaxHeight,minSize,boxMaxSize,size,display,weight,lineHeight);
    node.dataset.fontSize=String(next.fontSize);node.dataset.target=String(next.target);
    node.dataset.constrained=String(next.constrained);node.dataset.overflow=String(next.overflow);
    setFit(current=>JSON.stringify(current)===JSON.stringify(next)?current:next);
  },[text,boxWidth,boxMaxHeight,minSize,boxMaxSize,size,display,weight,lineHeight,fontFamily,fontWeight,letterSpacing]);
  useLayoutEffect(() => { let cancelled = false; void waitForSocialFont(document.fonts, role, fontWeight, text).then(() => { if (!cancelled) measure(); }); return () => { cancelled = true; }; }, [measure, text, role, fontWeight]);
  return { measureRef: measureNode, fit, typography };
}

function HiddenMeasure({ measureRef, text, width, typography, singleLine = false }: { measureRef: Ref<HTMLDivElement>; text: string; width: number; typography: CSSProperties; singleLine?: boolean }) {
  return <div ref={measureRef} data-single-line={singleLine} aria-hidden className="social-headline-measure" style={{ ...typography, width, ...(singleLine ? { whiteSpace: "nowrap" } : {}) }}>{text}</div>;
}

function Brand({ background, spec }: { background: keyof typeof SOCIAL_PALETTE; spec: Pick<SocialPostSpec, "wordmark"> }) {
  if (!resolveWordmarkVisible(spec)) return null;
  return <div className="social-artwork-logo absolute left-[84px] top-[70px] z-30" style={{ color: textColour({ colour: "auto", size: "default", nudge: 0 }, background) }}><Wordmark size="lg" color="inherit" className="text-[40px]!" /></div>;
}

function textStyle(block: SocialTextBlock, background: keyof typeof SOCIAL_PALETTE, baseSize: number): CSSProperties {
  return { fontFamily: socialTypography("support").fontFamily, textAlign: socialTextAlign(block.style), color: textColour(block.style, background), fontSize: baseSize * TEXT_SIZE_MULTIPLIER[block.style.size], transform: `translateY(${TEXT_NUDGE_PX[block.style.nudge]}px)` };
}

function Copy({ block, background, className, baseSize, expressive = false }: { block: SocialTextBlock; background: keyof typeof SOCIAL_PALETTE; className?: string; baseSize: number; expressive?: boolean }) {
  const text = normaliseSocialText(block.text);
  if (!text) return null;
  return <p className={className} style={textStyle(block, background, baseSize)}>{expressive ? <SocialDisplayText text={text} colour={textColour(block.style, background)} style={block.style} /> : text}</p>;
}

function findAsset(slot: SocialGraphicSlot, assets: SocialGraphicAsset[]) {
  return slot.assetId ? assets.find((candidate) => candidate.id === slot.assetId) ?? null : null;
}

/**
 * Every graphic renders inside a fixed square box with object-contain, so its
 * footprint is predictable. Assets are expected to be tightly cropped; large
 * transparent padding inside the file simply makes the visible artwork smaller.
 */
function SlotImage({ asset, size, className, style }: { asset: SocialGraphicAsset; size: number; className?: string; style?: CSSProperties }) {
  return <img src={asset.url} alt="" aria-hidden className={`flex-none object-contain ${className ?? ""}`} style={{ width: size, height: size, ...style }} />;
}

function BigTypeAccents({ spec, assets }: { spec: SocialPostSpec; assets: SocialGraphicAsset[] }) {
  const headline = normaliseSocialText(spec.headline.text, "Find somewhere new");
  const layout = bigTypeTextLayout(spec);
  const supportText = normaliseSocialText(spec.supporting.text);
  const fit = useHeadlineFit(headline, layout.copyWidth, layout.headlineMaxHeight, 20, DISPLAY_CEILINGS.bigType, displayTypography(spec.headline.style.size).lineHeight, spec.headline.style.size, true);
  const supportFit = useHeadlineFit(supportText, layout.supportWidth, 120, 18, 40, 1.18, spec.supporting.style.size, false, 500);

  return <div className="social-artwork-stage" style={{ backgroundColor: SOCIAL_PALETTE[spec.background].value }}>
    <Brand background={spec.background} spec={spec} />
    <HiddenMeasure measureRef={fit.measureRef} typography={fit.typography} text={headline} width={layout.copyWidth} />
    <HiddenMeasure measureRef={supportFit.measureRef} typography={supportFit.typography} text={supportText} width={layout.supportWidth} />
    <div className="absolute z-20" style={{ left: layout.left, right: layout.right, top: layout.top, bottom: layout.bottom }}>
      <h2 className="social-artwork-headline" style={{ textAlign: socialTextAlign(spec.headline.style), color: textColour(spec.headline.style, spec.background), fontSize: fit.fit.fontSize, ...displayTypography(spec.headline.style.size), transform: `translateY(${TEXT_NUDGE_PX[spec.headline.style.nudge]}px)` }}><SocialDisplayText text={headline} colour={textColour(spec.headline.style, spec.background)} style={spec.headline.style} /></h2>
      {supportText ? <p className="mt-[40px] font-medium leading-[1.18]" style={{ ...textStyle(spec.supporting, spec.background, 40), ...supportFit.typography, fontSize: supportFit.fit.fontSize }}><SocialDisplayText text={supportText} colour={textColour(spec.supporting.style, spec.background)} style={spec.supporting.style} /></p> : null}
    </div>
    <div className="absolute bottom-[90px] left-[88px] z-20 w-[780px]"><Copy block={spec.lower} background={spec.background} baseSize={31} className="font-bold leading-[1.15]" /></div>
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden>
      {bigTypeOverlays(spec).map((overlay) => {
        const asset = findAsset(overlay, assets);
        return asset ? <SlotImage key={overlay.id} asset={asset} size={overlaySize(overlay)} className="absolute" style={{ left: overlay.x, top: overlay.y }} /> : null;
      })}
    </div>
  </div>;
}

const PANEL_HEIGHT = SOCIAL_SPLIT_PANEL_HEIGHT;
const PANEL_X = 84;

function SplitPanel({ panel, assets, position, sharedSize }: { panel: SplitPanelSpec; assets: SocialGraphicAsset[]; position: "top" | "bottom"; sharedSize: number }) {
  const headline = normaliseSocialText(panel.headline.text, position === "top" ? "Find your next" : "family adventure");
  const topPad = position === "top" ? 160 : 70;
  const graphic = findAsset(panel.graphic, assets);
  const graphicSize = SOCIAL_GRAPHIC_SIZES.splitHero[panel.graphic.scale];
  const copyWidth = SOCIAL_ARTWORK_WIDTH - PANEL_X * 2 - (graphic ? graphicSize + 32 : 0);
  const supportText = normaliseSocialText(panel.supporting.text);
  const supportFit = useHeadlineFit(supportText, copyWidth, 100, 1, 32, 1.2, panel.supporting.style.size, false, 500);
  const maxHeadline = PANEL_HEIGHT - topPad - 70 - 56 - (supportText ? 126 : 0);

  return <div className="relative flex flex-none items-center justify-between overflow-hidden" style={{ height: PANEL_HEIGHT, paddingLeft: PANEL_X, paddingRight: PANEL_X, paddingTop: topPad, paddingBottom: 70, backgroundColor: SOCIAL_PALETTE[panel.background].value }}>

    <HiddenMeasure measureRef={supportFit.measureRef} typography={supportFit.typography} text={supportText} width={copyWidth} />
    <div className="relative z-20 flex-none" style={{ width: copyWidth }}>
      <h2 className="social-artwork-headline" style={{ textAlign: socialTextAlign(panel.headline.style), color: textColour(panel.headline.style, panel.background), fontSize: sharedSize, ...displayTypography(panel.headline.style.size), transform: `translateY(${TEXT_NUDGE_PX[panel.headline.style.nudge]}px)` }}><SocialDisplayText text={headline} colour={textColour(panel.headline.style, panel.background)} style={panel.headline.style} /></h2>
      {supportText ? <p className="mt-[26px] font-medium leading-[1.2]" style={{ ...textStyle(panel.supporting, panel.background, 32), ...supportFit.typography, fontSize: supportFit.fit.fontSize }}><SocialDisplayText text={supportText} colour={textColour(panel.supporting.style, panel.background)} style={panel.supporting.style} /></p> : null}
    </div>
    {graphic ? <SlotImage asset={graphic} size={graphicSize} className="relative z-10" /> : null}
  </div>;
}

/** The accents and text are one bounded inline composition, shared by List and Split. */
function CtaComposition({ block, background, assets, before, after, width, pill = false, maxHeight = 48 }: {
  block: SocialTextBlock; background: keyof typeof SOCIAL_PALETTE; assets: SocialGraphicAsset[];
  before: SocialGraphicSlot; after: SocialGraphicSlot; width: number; pill?: boolean; maxHeight?: number;
}) {
  const text = normaliseSocialText(block.text);
  const beforeAsset = findAsset(before, assets), afterAsset = findAsset(after, assets);
  const layout = ctaInlineLayout(width, beforeAsset ? before : null, afterAsset ? after : null, block.style, pill);
  const fit = useHeadlineFit(text, layout.textWidth, maxHeight, 1, (pill ? 32 : 31) * TEXT_SIZE_MULTIPLIER[block.style.size], 1.15);
  return <>
    <HiddenMeasure measureRef={fit.measureRef} typography={fit.typography} text={text} width={layout.textWidth} singleLine />
    {text ? <div className="flex w-full items-center" style={{ justifyContent: layout.justifyContent, transform: `translateY(${Math.max(-36, Math.min(36, TEXT_NUDGE_PX[block.style.nudge]))}px)` }}>
      <div className={`flex max-w-full items-center ${pill ? "rounded-full px-[34px] py-[20px]" : ""}`} style={{ gap: layout.gap, ...(pill ? { backgroundColor: SOCIAL_PALETTE.white.value, color: SOCIAL_PALETTE.teal.value } : { color: textColour(block.style, background) }) }}>
        {beforeAsset ? <SlotImage asset={beforeAsset} size={layout.beforeSize} /> : null}
        {pill ? <svg className="flex-none" aria-hidden width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg> : null}
        <p className="min-w-0 whitespace-nowrap font-bold leading-[1.15]" style={{ ...fit.typography, fontSize: fit.fit.fontSize, maxWidth: layout.textWidth }}>{text}</p>
        {afterAsset ? <SlotImage asset={afterAsset} size={layout.afterSize} /> : null}
      </div>
    </div> : null}
  </>;
}

function SplitFooter({ spec, assets }: { spec: SocialPostSpec; assets: SocialGraphicAsset[] }) {
  const layout = splitFooterLayout(spec.lower);
  const accents = splitCtaAccents(spec);
  return <div className="relative flex flex-none items-center overflow-hidden px-[84px]" style={{ height: SOCIAL_SPLIT_FOOTER_HEIGHT, backgroundColor: SOCIAL_PALETTE[layout.background].value }}>
    <CtaComposition block={spec.lower} background={layout.background} assets={assets} before={accents.before} after={accents.after} width={layout.width} maxHeight={layout.maxHeight} />
  </div>;
}

function SplitArtwork({ spec, assets }: { spec: SocialPostSpec; assets: SocialGraphicAsset[] }) {
  const panelFit = (panel:SplitPanelSpec,position:"top"|"bottom") => {
    const graphic=findAsset(panel.graphic,assets),width=1080-84*2-(graphic?SOCIAL_GRAPHIC_SIZES.splitHero[panel.graphic.scale]+32:0);
    const maxHeight=PANEL_HEIGHT-(position==="top"?160:70)-70-56-(normaliseSocialText(panel.supporting.text)?126:0);
    return useHeadlineFit(normaliseSocialText(panel.headline.text),width,maxHeight,32,DISPLAY_CEILINGS.split,1,spec.headline.style.size,true);
  };
  const top=panelFit(spec.topPanel,"top"),bottom=panelFit(spec.bottomPanel,"bottom"),sharedSize=Math.min(top.fit.fontSize,bottom.fit.fontSize);
  return <div className="social-artwork-stage flex flex-col" data-shared-headline={sharedSize}>
    <HiddenMeasure measureRef={top.measureRef} typography={top.typography} text={normaliseSocialText(spec.topPanel.headline.text)} width={912}/>
    <HiddenMeasure measureRef={bottom.measureRef} typography={bottom.typography} text={normaliseSocialText(spec.bottomPanel.headline.text)} width={912}/>
    <SplitPanel panel={spec.topPanel} assets={assets} position="top" sharedSize={sharedSize}/>
    <SplitPanel panel={spec.bottomPanel} assets={assets} position="bottom" sharedSize={sharedSize}/>
    <SplitFooter spec={spec} assets={assets}/><Brand background={spec.topPanel.background} spec={spec}/>
  </div>;
}

function ListHeader({ list, maxHeight }: { list: SocialListSpec; maxHeight: number }) {
  const headline = normaliseSocialText(list.headline.text, "Things to do this weekend");
  const sub = normaliseSocialText(list.subheading.text);
  const width = SOCIAL_ARTWORK_WIDTH - LIST_PADDING_X * 2;
  const fit = useHeadlineFit(headline, width, maxHeight, 40, DISPLAY_CEILINGS.list, displayTypography(list.headline.style.size).lineHeight, list.headline.style.size, true);
  return <div data-list-header className="absolute inset-x-0 top-0 z-20" style={{ paddingLeft: LIST_PADDING_X, paddingRight: LIST_PADDING_X, paddingTop: 150 }}>
    <HiddenMeasure measureRef={fit.measureRef} typography={fit.typography} text={headline} width={width} />
    <h2 data-list-header-copy data-nudge={TEXT_NUDGE_PX[list.headline.style.nudge]} className="social-artwork-headline" style={{ textAlign: socialTextAlign(list.headline.style), color: textColour(list.headline.style, list.background), fontSize: fit.fit.fontSize, ...displayTypography(list.headline.style.size), transform: `translateY(${TEXT_NUDGE_PX[list.headline.style.nudge]}px)` }}><SocialDisplayText text={headline} colour={textColour(list.headline.style, list.background)} style={list.headline.style} /></h2>
    {sub ? <p data-list-header-copy data-list-subheading data-nudge={TEXT_NUDGE_PX[list.subheading.style.nudge]} className="mt-[16px] whitespace-nowrap font-medium leading-[1.15]" style={textStyle(list.subheading, list.background, 34)}><SocialDisplayText text={sub} colour={textColour(list.subheading.style, list.background)} style={list.subheading.style} /></p> : null}
  </div>;
}

function BottomMotif({ slot, asset }: { slot: SocialGraphicSlot; asset: SocialGraphicAsset }) {
  const [intrinsic, setIntrinsic] = useState<{ width: number; height: number } | null>(null);
  const geometry = intrinsic ? bottomMotifGeometry(slot.scale, intrinsic.width, intrinsic.height) : null;
  return <img data-list-motif src={asset.url} alt="" aria-hidden className="pointer-events-none absolute bottom-0 z-10 object-contain" onLoad={(event) => {
    const image = event.currentTarget;
    setIntrinsic({ width: image.naturalWidth, height: image.naturalHeight });
  }} style={{ left: geometry?.left ?? 0, width: geometry?.width ?? "auto", height: geometry?.height ?? BOTTOM_MOTIF_HEIGHTS[slot.scale], visibility: geometry ? "visible" : "hidden" }} />;
}

function ListFooter({ list, assets }: { list: SocialListSpec; assets: SocialGraphicAsset[] }) {
  const slots = listFooterSlots(list.footer);
  const motif = findAsset(slots.bottomMotif, assets);
  return <>
    {motif ? <BottomMotif key={`${motif.id}-${motif.url}`} slot={slots.bottomMotif} asset={motif} /> : null}
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center" style={{ height: LIST_FOOTER_HEIGHT, paddingLeft: LIST_PADDING_X, paddingRight: LIST_PADDING_X, paddingBottom: 30 }}>
      <CtaComposition block={list.footer.cta} background={list.background} assets={assets} before={slots.accentBefore} after={slots.accentAfter} width={SOCIAL_ARTWORK_WIDTH - LIST_PADDING_X * 2} pill={list.footer.variant === "search-pill"} />
    </div>
  </>;
}

function ListRows({list, groups, metrics, scale, minimum=false}: {list:SocialListSpec;groups:{item:SocialListSpec['items'][number];index:number}[][];metrics:ReturnType<typeof listMetrics>;scale:number;minimum?:boolean}) {
  const s=(value:number)=>Math.round(value*scale),columns=groups.length as 1|2,width=columnWidth(columns),bodyText=textColour(defaultTextStyle(),list.background);
  return <>{groups.map((group, column) => <div key={column} data-list-column={minimum ? undefined : ""} data-list-min-column={minimum ? "" : undefined} className="flex flex-none flex-col" style={{ width, gap: s(metrics.gap) }}>
        {group.map(({ item, index }) => {
          let treatment = listNumberTreatment(list.numberStyle, listNumberColour(list.numberColour, index, list.background), bodyText, s(metrics.number));
          if(list.numberStyle === 'plain' && list.background !== 'teal' && list.background !== 'blueTeal')treatment={...treatment,color:bodyText};
          return <div key={item.id} data-list-item={index} className="flex items-start" style={{ gap: s(24) }}>
            <div className="flex flex-none items-center justify-center font-bold leading-none" style={treatment}>{index + 1}</div>
            <div className="min-w-0 flex-1" style={{ color: bodyText }}>
              <p data-list-line className="break-words" style={{ fontSize: s(metrics.primary), lineHeight: 1.08, fontWeight: listPrimaryFontWeight(list.primaryWeight) }}>{normaliseSocialText(item.primary, `Item ${index + 1}`)}</p>
              {normaliseSocialText(item.secondary) ? <p data-list-line className="mt-[4px] break-words font-medium" style={{ fontSize: s(metrics.secondary), lineHeight: 1.15, opacity: .84 }}>{normaliseSocialText(item.secondary)}</p> : null}
              {normaliseSocialText(item.third) ? <p data-list-line data-list-third className="mt-[2px] break-words font-semibold" style={{ fontSize: s(metrics.third), lineHeight: 1.18, opacity: .95 }}>{normaliseSocialText(item.third)}</p> : null}
            </div>
          </div>;
        })}
      </div>)}</>;
}

function ListArtwork({ spec, list: slideList, assets, onListFit }: { spec: Pick<SocialPostSpec, "wordmark" | "list">; list?: SocialListSpec; assets: SocialGraphicAsset[]; onListFit?: (report: ListFitReport) => void }) {
  const list = slideList ?? spec.list ?? defaultListSpec();
  const columns = resolveListColumns(list.columns, list.items.length);
  const groups = distributeListColumns(list.items.map((item, index) => ({ item, index })), columns);
  const metrics = listMetrics(list.density, list.items.length, columns);
  const motifSlot = listFooterSlots(list.footer).bottomMotif;
  const motifAsset = findAsset(motifSlot, assets);
  const contentKey = JSON.stringify([list.items, columns, list.density, list.primaryWeight, list.numberStyle, list.headline, list.subheading, list.position, list.footer.cta.text, motifSlot, motifAsset?.url]);
  const [fitState, setFitState] = useState({ key: contentKey, scale: 1, headerBottom: -1 });
  const scale = fitState.key === contentKey ? fitState.scale : 1;
  const zone = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(264);
  const [placement, setPlacement] = useState(() => listVerticalLayout(150, 0));
  const lastReport = useRef<ListFitReport | null>(null);
  const report = useRef(onListFit); report.current = onListFit;
  useLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const node = zone.current;
      const root = stage.current;
      if (cancelled || !node || !root) return;
      const headerBottom = Math.max(150, ...Array.from(root.querySelectorAll<HTMLElement>("[data-list-header-copy]")).map((copy) => copy.offsetTop + copy.offsetHeight + Number(copy.dataset.nudge ?? 0)));
      const listHeight = Math.max(0, ...Array.from(node.querySelectorAll<HTMLElement>("[data-list-column]")).map((column) => column.offsetHeight));
      const motif = root.querySelector<HTMLElement>("[data-list-motif]");
      const motifHeight = motifAsset ? (motif?.offsetHeight ?? BOTTOM_MOTIF_HEIGHTS[motifSlot.scale]) : 0;
      const footerHeight = normaliseSocialText(list.footer.cta.text) ? LIST_FOOTER_HEIGHT : motifAsset ? 0 : 60;
      const safeBottom = listVerticalLayout(150,0,list.position,motifHeight,footerHeight).safeBottom;
      const minimumHeight = Math.max(0,...Array.from(root.querySelectorAll<HTMLElement>('[data-list-min-column]')).map(n=>n.offsetHeight));
      const subheadingHeight = root.querySelector<HTMLElement>('[data-list-subheading]')?.offsetHeight ?? 0;
      const budget = Math.max(40,Math.min(280,safeBottom-150-(subheadingHeight ? subheadingHeight+16 : 0)-32-minimumHeight));
      setHeaderHeight(current=>current===budget?current:budget);
      const next = listVerticalLayout(headerBottom, listHeight, list.position, motifHeight,footerHeight);
      setPlacement((current) => current.top === next.top && current.availableHeight === next.availableHeight && current.safeBottom === next.safeBottom && current.overflow === next.overflow ? current : next);
      if (fitState.key !== contentKey || fitState.headerBottom !== headerBottom) {
        setFitState({key:contentKey,scale:1,headerBottom});
        return;
      }
      const overflow = next.overflow;
      if (overflow && scale > LIST_MIN_FIT_SCALE + .001) { setFitState({ key: contentKey, headerBottom, scale: Math.max(LIST_MIN_FIT_SCALE, Math.round((scale - .05) * 100) / 100) }); return; }
      const measurements = Array.from(node.querySelectorAll<HTMLElement>("[data-list-item]")).map((item) => ({
        index: Number(item.dataset.listItem),
        lines: Array.from(item.querySelectorAll<HTMLElement>("[data-list-line]")).reduce((sum, line) => sum + Math.max(1, Math.round(line.offsetHeight / parseFloat(getComputedStyle(line).lineHeight))), 0),
      }));
      const nextReport = listFitReport(measurements, overflow, scale);
      if (!sameListFitReport(lastReport.current, nextReport)) {
        lastReport.current = nextReport;
        report.current?.(nextReport);
      }
    };
    const observer = new ResizeObserver(measure);
    stage.current?.querySelectorAll<HTMLElement>("[data-list-header-copy], [data-list-column], [data-list-min-column], [data-list-motif]").forEach((node) => observer.observe(node));
    measure();
    void document.fonts.ready.then(measure);
    return () => { cancelled = true; observer.disconnect(); };
  }, [contentKey, scale, fitState.headerBottom, list.position, motifAsset, motifSlot.scale]);
  const s = (value: number) => Math.round(value * scale);
  const bodyText = textColour(defaultTextStyle(), list.background);
  const width = columnWidth(columns);
  return <div ref={stage} className="social-artwork-stage" style={{ backgroundColor: SOCIAL_PALETTE[list.background].value }}>
    <Brand background={list.background} spec={spec} />
    <ListHeader list={list} maxHeight={headerHeight} />
    <div aria-hidden className="absolute flex items-start" style={{left:LIST_PADDING_X,top:0,width:SOCIAL_ARTWORK_WIDTH-LIST_PADDING_X*2,gap:LIST_COLUMN_GAP,visibility:'hidden'}}>
      <ListRows list={list} groups={groups} metrics={metrics} scale={LIST_MIN_FIT_SCALE} minimum />
    </div>
    <div ref={zone} className="absolute z-20 flex items-start" style={{ top: placement.top, height: placement.availableHeight, left: LIST_PADDING_X, right: LIST_PADDING_X, gap: LIST_COLUMN_GAP }}>
      <ListRows list={list} groups={groups} metrics={metrics} scale={scale} />
    </div>
    <ListFooter list={list} assets={assets} />
  </div>;
}

/** Editorial Cover: kicker label → dominant full-width headline → supporting line; hero lives in the lower zone. */
function EditorialCover({ slide, spec, assets }: { slide: EditorialCoverSlideSpec; spec: SocialPostSpec; assets: SocialGraphicAsset[] }) {
  const hero = slide.hero.assetId ? assets.find((a) => a.id === slide.hero.assetId) ?? null : null;
  const heroSize = EDITORIAL_COVER_HERO_SIZES[slide.hero.scale];
  const bottom = slide.hero.placement === "bottom";
  const fullWidthBottom = slide.hero.placement === "full-bleed-bottom";
  const corner = slide.corner?.assetId ? assets.find(a => a.id === slide.corner?.assetId) ?? null : null;
  const width = SOCIAL_ARTWORK_WIDTH - 84 * 2;
  const kicker = normaliseSocialText(slide.kicker.text);
  const headline = normaliseSocialText(slide.headline.text, "Our top picks");
  const support = normaliseSocialText(slide.supporting.text);
  // Template-owned copy geometry never changes when either optional upload loads.
  const maxHeight = coverHeadlineHeight(slide.hero.placement, slide.hero.scale, Boolean(support), slide.copySpace);
  const fit = useHeadlineFit(headline, width, maxHeight, 48, DISPLAY_CEILINGS.editorial, displayTypography(slide.headline.style.size).lineHeight, slide.headline.style.size, true);
  const kickerColour = textColour(slide.kicker.style, slide.background);
  const align = socialTextAlign(slide.kicker.style);
  return <div className="social-artwork-stage" style={{ backgroundColor: SOCIAL_PALETTE[slide.background].value }}>
    <Brand background={slide.background} spec={spec} />
    <HiddenMeasure measureRef={fit.measureRef} typography={fit.typography} text={headline} width={width} />
    {hero ? <img data-cover-graphic="main" src={hero.url} alt="" aria-hidden className="absolute z-10 object-contain" style={fullWidthBottom ? coverFrameGeometry("full-bleed-bottom", slide.hero.scale) : bottom ? { width: heroSize * 1.3, height: heroSize, left: (SOCIAL_ARTWORK_WIDTH - heroSize * 1.3) / 2, bottom: -30, objectPosition: "center bottom" } : { width: heroSize, height: heroSize, right: -40, bottom: -20, objectPosition: "right bottom" }} /> : null}
    {corner && slide.corner ? <img data-cover-graphic="additional" src={corner.url} alt="" aria-hidden className="pointer-events-none absolute z-10" style={coverFrameGeometry(slide.corner.placement, slide.corner.scale)} /> : null}
    <div data-cover-copy className="absolute z-20" style={{ left: 84, right: 84, top: 200 }}>
      {kicker ? <div style={{ textAlign: align, transform: `translateY(${TEXT_NUDGE_PX[slide.kicker.style.nudge]}px)` }}><span className="inline-block rounded-full font-bold uppercase leading-none tracking-[0.06em]" style={{ backgroundColor: kickerColour, color: SOCIAL_PALETTE[slide.background].value, fontSize: 34 * TEXT_SIZE_MULTIPLIER[slide.kicker.style.size], padding: "14px 28px", maxWidth: width }}><SocialDisplayText text={kicker} colour={SOCIAL_PALETTE[slide.background].value} style={slide.kicker.style} /></span></div> : null}
      <h2 className="social-artwork-headline mt-[36px]" style={{ width, textAlign: socialTextAlign(slide.headline.style), color: textColour(slide.headline.style, slide.background), fontSize: fit.fit.fontSize, ...displayTypography(slide.headline.style.size), transform: `translateY(${TEXT_NUDGE_PX[slide.headline.style.nudge]}px)` }}><SocialDisplayText text={headline} colour={textColour(slide.headline.style, slide.background)} style={slide.headline.style} /></h2>
      {support ? <p className="mt-[32px] font-semibold leading-[1.18]" style={{ ...textStyle(slide.supporting, slide.background, 40), maxWidth: width }}><SocialDisplayText text={support} colour={textColour(slide.supporting.style, slide.background)} style={slide.supporting.style} /></p> : null}
    </div>
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden>
      {normaliseCoverAccents(slide.accents).map((overlay) => { const asset = findAsset(overlay, assets); return asset ? <SlotImage key={overlay.id} asset={asset} size={overlaySize(overlay)} className="absolute" style={{ left: overlay.x, top: overlay.y }} /> : null; })}
    </div>
  </div>;
}

/** One visual-above composition for every medium. Fit/focus never move the copy or number. */
function CuratedPickComposed({ slide, number, spec, assets }: { slide: CuratedPickSlideSpec; number: string; spec: SocialPostSpec; assets: SocialGraphicAsset[] }) {
  const below = slide.treatment === 'visual-below';
  const copyTop = below ? 286 : 700, copyHeight = below ? 500 : 566;
  const width = 912;
  const fg = textColour(defaultTextStyle(), slide.background);
  const name = normaliseSocialText(slide.name.text, 'Pick name');
  const hook = normaliseSocialText(slide.hook.text);
  const detail = normaliseSocialText(slide.detail);
  const location = normaliseSocialText(slide.location), price = normaliseSocialText(slide.price);
  const leftPrice = slide.priceAlignment === 'left' || (!slide.priceAlignment && below);
  const locationWidth = !leftPrice && location && price ? width-360-24 : width;
  const hookFit = useHeadlineFit(hook, width, 110, 28, 38, 1.18, 'default', false, 600);
  const detailFit = useHeadlineFit(detail, width, 76, 26, 30, 1.25, 'default', false, 500);
  const locationFit = useHeadlineFit(location, locationWidth, 102, 30, 42, 1.16, 'default', false, 800);
  const priceFit = useHeadlineFit(price, 312, 58, 28, 42, 1.12, 'default', false, 800);
  const locationHeight = location ? locationFit.fit.height : 0, priceHeight = price ? priceFit.fit.height+24 : 0;
  const metaHeight = leftPrice ? locationHeight+priceHeight+(location && price ? 12 : 0) : Math.max(locationHeight,priceHeight);
  const remainingHeight = copyHeight - (hook ? hookFit.fit.height + 20 : 0) - (detail ? detailFit.fit.height + 14 : 0) - (location || price ? metaHeight + 28 : 0);
  const nameFit = useHeadlineFit(name, width, Math.max(100, remainingHeight), 54, 144, displayTypography(slide.name.style.size).lineHeight, slide.name.style.size, true);
  const visual = slide.visual;
  const copy = useRef<HTMLDivElement>(null);
  const [copyBottom,setCopyBottom] = useState(copyTop+copyHeight);
  useLayoutEffect(()=>{
    const node=copy.current;if(!node)return;
    const measure=()=>{const bottom=copyTop+Math.max(0,...Array.from(node.children).map(child=>{const n=child as HTMLElement;return n.offsetTop+n.offsetHeight}));setCopyBottom(current=>current===bottom?current:bottom)};
    const observer=new ResizeObserver(measure);Array.from(node.children).forEach(n=>observer.observe(n));measure();
    return ()=>observer.disconnect();
  },[copyTop,name,hook,detail,location,price,leftPrice]);
  const protection = below && visual?.fit==='frame' && slide.overlapTreatment!=='none';
  const mask = protection ? curatedCopyMask(copyBottom) : undefined;
  const numberTreatment = curatedNumberTreatment(slide.numberStyle||'pill',slide.numberColour||'auto',slide.background,below);
  const asset = visual?.assetId ? assets.find(a => a.id === visual.assetId) : null;
  return <div className="social-artwork-stage" data-pick-treatment={slide.treatment} style={{ backgroundColor: SOCIAL_PALETTE[slide.background].value }}>
    <Brand background={slide.background} spec={spec} />
    <HiddenMeasure measureRef={nameFit.measureRef} typography={nameFit.typography} text={name} width={width} />
    <HiddenMeasure measureRef={hookFit.measureRef} typography={hookFit.typography} text={hook} width={width} />
    <HiddenMeasure measureRef={detailFit.measureRef} typography={detailFit.typography} text={detail} width={width} />
    <HiddenMeasure measureRef={locationFit.measureRef} typography={locationFit.typography} text={location} width={locationWidth} />
    <HiddenMeasure measureRef={priceFit.measureRef} typography={priceFit.typography} text={price} width={312} />
    {below && visual?.fit === 'frame' ? <div data-pick-visual data-copy-protection={protection?'soft-fade':'none'} data-copy-bottom={copyBottom} className="absolute inset-0" style={{maskImage:mask,WebkitMaskImage:mask}}>
      {asset ? <img data-pick-image src={asset.url} alt="" aria-hidden className="absolute" style={{width:{small:720,medium:900,large:1080}[visual.scale||'medium'],height:'auto',maxWidth:'none',left:(1080-{small:720,medium:900,large:1080}[visual.scale||'medium'])/2,bottom:0}} /> : null}
    </div> : <div data-pick-visual className="absolute overflow-hidden" style={{left:below?(1080-{small:720,medium:900,large:1080}[visual?.scale||'medium'])/2:0,width:below?{small:720,medium:900,large:1080}[visual?.scale||'medium']:1080,top:below?850:140,height:below?500:460,backgroundColor:SOCIAL_PALETTE[visual?.background||'seafoam'].value}}>
      {asset ? <img data-pick-image src={asset.url} alt="" aria-hidden className="h-full w-full" style={{objectFit:visual?.fit==='contain'?'contain':'cover',objectPosition:`center ${visual?.focus||'center'}`}} /> : null}
    </div>}
    <div data-pick-number className="absolute z-20 flex items-center justify-center" style={{ left: 84, top: below ? 176 : 548, ...numberTreatment, ...displayTypography('default'), fontSize: below ? 68 : 88, lineHeight: 1 }}>{number}</div>
    <div ref={copy} data-pick-copy className="absolute z-20" style={{ left: 84, right: 84, top: copyTop, height: copyHeight, color: fg }}>
      <h2 className="social-artwork-headline" style={{ width, fontSize: nameFit.fit.fontSize, ...nameFit.typography, textAlign: socialTextAlign(slide.name.style) }}><SocialDisplayText text={name} colour={fg} style={slide.name.style} /></h2>
      {hook ? <p data-pick-hook style={{ marginTop: 20, ...hookFit.typography, fontSize: hookFit.fit.fontSize }}><SocialDisplayText text={hook} colour={fg} style={slide.hook.style} /></p> : null}
      {detail ? <p data-pick-detail style={{ marginTop: 14, ...detailFit.typography, fontSize: detailFit.fit.fontSize, opacity: .84 }}>{detail}</p> : null}
      {location || price ? <div data-pick-metadata className="flex items-start" style={{marginTop:28,gap:leftPrice?12:24,flexDirection:leftPrice?'column':'row',justifyContent:leftPrice?'flex-start':location?'space-between':'flex-end'}}>
        {location ? <p data-pick-location style={{width:locationWidth,...locationFit.typography,fontSize:locationFit.fit.fontSize}}>{location}</p> : null}
        {price ? <div data-pick-price-tag style={{flexShrink:0,width:'max-content',maxWidth:360,padding:'12px 24px',borderRadius:12,backgroundColor:fg,color:SOCIAL_PALETTE[slide.background].value}}><p data-pick-price style={{...priceFit.typography,fontSize:priceFit.fit.fontSize,maxWidth:312}}>{price}</p></div> : null}
      </div> : null}
    </div>
  </div>;
}

function CuratedPickLegacy({ slide, number, spec, assets }: { slide: CuratedPickSlideSpec; number: string; spec: SocialPostSpec; assets: SocialGraphicAsset[] }) {
  const visual = resolvePickVisual(slide);
  const photo = slide.visualMode === "photo";
  const fg = textColour(defaultTextStyle(), slide.background);
  const width = SOCIAL_ARTWORK_WIDTH - 84 * 2;
  const name = normaliseSocialText(slide.name.text, "Pick name");
  const top = photo ? CURATED_PHOTO_HEIGHT + 56 : 760;
  const nameFit = useHeadlineFit(name, width, 190, 40, DISPLAY_CEILINGS.pick, displayTypography(slide.name.style.size).lineHeight, slide.name.style.size, true);
  const asset = visual.mode === "graphic" ? assets.find((a) => a.id === visual.assetId) ?? null : null;
  const box = CURATED_GRAPHIC_BOXES[slide.graphic.placement];
  const accent = SOCIAL_PALETTE[slide.background].foreground === "white" ? "#F4D84A" : "#0F7C78";
  return <div className="social-artwork-stage" style={{ backgroundColor: SOCIAL_PALETTE[slide.background].value }}>
    <HiddenMeasure measureRef={nameFit.measureRef} typography={nameFit.typography} text={name} width={width} />
    {photo ? <div className="absolute inset-x-0 top-0 z-0 overflow-hidden bg-black/10" style={{ height: CURATED_PHOTO_HEIGHT }}>{visual.mode === "photo" ? <img src={visual.url} alt="" aria-hidden crossOrigin="anonymous" className="h-full w-full object-cover" style={{ objectPosition: `center ${visual.focus}` }} /> : null}</div>
      : asset ? <img src={asset.url} alt="" aria-hidden className="absolute z-0 object-contain" style={{ left: box.left, top: box.top, width: box.width, height: box.height, objectPosition: box.objectPosition }} /> : null}
    <div className="absolute z-20 font-bold" style={{ fontFamily: socialTypography("support").fontFamily, letterSpacing: 0, left: 64, top: photo ? CURATED_PHOTO_HEIGHT - 150 : 120, fontSize: 230, lineHeight: .8, color: photo ? "#FFFFFF" : accent, textShadow: photo ? "0 6px 30px rgba(0,0,0,.35)" : undefined }}>{number}</div>
    <div className="absolute z-20" style={{ left: 84, right: 84, top, bottom: 170 }}>
      <h2 className="social-artwork-headline" style={{ textAlign: socialTextAlign(slide.name.style), color: textColour(slide.name.style, slide.background), fontSize: nameFit.fit.fontSize, ...displayTypography(slide.name.style.size) }}><SocialDisplayText text={name} colour={textColour(slide.name.style, slide.background)} style={slide.name.style} /></h2>
      <Copy expressive block={slide.hook} background={slide.background} baseSize={36} className="mt-[20px] font-semibold leading-[1.2]" />
      {normaliseSocialText(slide.detail) ? <p className="mt-[14px] text-[28px] font-medium leading-[1.25] opacity-80" style={{ color: fg }}>{normaliseSocialText(slide.detail)}</p> : null}
    </div>
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-[32px] border-t-[3px]" style={{ height: 130, paddingLeft: 84, paddingRight: 84, borderColor: fg, color: fg }}>
      <span className="min-w-0 truncate text-[34px] font-semibold">{normaliseSocialText(slide.location)}</span>
      <span className="flex-none rounded-full px-[28px] py-[10px] text-[34px] font-bold" style={{ backgroundColor: fg, color: SOCIAL_PALETTE[slide.background].value }}>{normaliseSocialText(slide.price, "Price")}</span>
    </div>
    <Brand background={slide.background} spec={{ wordmark: photo ? "hide" : spec.wordmark }} />
  </div>;
}

/** Mixed post: each slide renders with its own template. */
function PostSlideArtwork({ spec, assets, slideIndex, onListFit }: { spec: SocialPostSpec; assets: SocialGraphicAsset[]; slideIndex: number; onListFit?: (report: ListFitReport) => void }) {
  const slides = curatedPost(spec).slides;
  const index = clampSlideIndex(slides, slideIndex);
  const slide = slides[index];
  if (slide.template === "editorial-cover") return <EditorialCover slide={slide} spec={spec} assets={assets} />;
  if (slide.template === "list") return <ListArtwork key={slide.id} spec={spec} list={slide.list} assets={assets} onListFit={onListFit} />;
  const props = {slide, number: pickNumber(slides, index) ?? '01', spec, assets};
  return slide.treatment ? <CuratedPickComposed {...props} /> : <CuratedPickLegacy {...props} />;
}

export const SocialArtwork = forwardRef<HTMLDivElement, { spec: SocialPostSpec; assets: SocialGraphicAsset[]; onListFit?: (report: ListFitReport) => void; slideIndex?: number }>(function SocialArtwork({ spec, assets, onListFit, slideIndex = 0 }, ref) {
  return <div ref={ref} className="social-artwork-root" data-recipe={spec.recipe}>{spec.recipe === "curated-picks" ? <PostSlideArtwork spec={spec} assets={assets} slideIndex={slideIndex} onListFit={onListFit} /> : spec.recipe === "split" ? <SplitArtwork spec={spec} assets={assets} /> : spec.recipe === "list" ? <ListArtwork spec={spec} assets={assets} onListFit={onListFit} /> : <BigTypeAccents spec={spec} assets={assets} />}</div>;
});

