/** The recipe owns all allowed values. Layout and measurement remain in renderer code. */
export type RecipeManifest = {
 templateId:string; templateVersion:number;
 contentSlots:Record<string,{type:string;required?:boolean;maxLength?:number;minItems?:number;maxItems?:number;fields?:Record<string,{required?:boolean}>}>;
 designOptions:Record<string,{values:any[];default:any;defaultBy?:{control:string;values:Record<string,any>}}>;
 assetSlots?:Record<string,any>;rules:Record<string,string>;invariants:string[];
};
export type SavedTemplate = {templateId:string;templateVersion:number;content:Record<string,any>;design?:Record<string,any>};
export function resolveDesign(recipe:RecipeManifest, supplied:Record<string,any>={}){
 const result:Record<string,any>={};
 for(const key of Object.keys(supplied))if(!recipe.designOptions[key])throw new Error(`Unknown design choice: ${key}`);
 const resolving=new Set<string>();
 const resolve=(key:string):any=>{
  if(Object.hasOwn(result,key))return result[key];
  if(resolving.has(key))throw new Error(`Cyclic recipe default: ${key}`);
  const option=recipe.designOptions[key];if(!option)throw new Error(`Unknown default control: ${key}`);
  resolving.add(key);
  const value=supplied[key]??(option.defaultBy?.values[resolveDefault(option)]??option.default);
  if(!option.values.includes(value))throw new Error(`Unsupported ${key}: ${value}`);
  resolving.delete(key);return result[key]=value;
 };
 const resolveDefault=(option:RecipeManifest['designOptions'][string])=>option.defaultBy?resolve(option.defaultBy.control):'';
 for(const key of Object.keys(recipe.designOptions))resolve(key);
 return result;
}
export function validateContent(recipe:RecipeManifest,content:Record<string,any>){
 const errors:string[]=[],warnings:string[]=[];
 if(!content||typeof content!=='object'||Array.isArray(content))return {errors:['Content must be an object'],warnings};
 for(const key of Object.keys(content))if(!recipe.contentSlots[key])errors.push(`Unknown content field: ${key}`);
 for(const [key,slot] of Object.entries(recipe.contentSlots)){
  const value=content[key];
  if(value===undefined||value===null||value===''){if(slot.required)errors.push(`${key} is required`);continue;}
  if(slot.type==='string'){
   if(typeof value!=='string')errors.push(`${key} must be text`);
   else if(slot.maxLength&&value.length>slot.maxLength)warnings.push(`${key} exceeds the recipe copy guide; keep text intact and inspect fitting`);
  }else if(slot.type==='object[]'){
   if(!Array.isArray(value)){errors.push(`${key} must be a list`);continue;}
   if(slot.minItems&&value.length<slot.minItems||slot.maxItems&&value.length>slot.maxItems)errors.push(`${key} count is outside recipe bounds`);
   value.forEach((item:any,i:number)=>{
    if(!item||typeof item!=='object'||Array.isArray(item)){errors.push(`${key}[${i}] must be an object`);return;}
    for(const field of Object.keys(item))if(!slot.fields?.[field])errors.push(`Unknown ${key}[${i}] field: ${field}`);
    for(const [field,def] of Object.entries(slot.fields||{})){
     if(def.required&&!item[field]?.trim?.())errors.push(`${key}[${i}].${field} is required`);
     if(item[field]!=null&&typeof item[field]!=='string')errors.push(`${key}[${i}].${field} must be text`);
    }
   });
  }else errors.push(`Unsupported content contract: ${slot.type}`);
 }
 return {errors,warnings};
}
export function deriveCapabilities(recipe:RecipeManifest){
 return {templateId:recipe.templateId,templateVersion:recipe.templateVersion,contentSlots:recipe.contentSlots,designOptions:recipe.designOptions,assetSlots:recipe.assetSlots||{},rules:recipe.rules,invariants:recipe.invariants};
}
export function resolveSavedTemplate(recipes:RecipeManifest[],input:SavedTemplate){
 const recipe=recipes.find(r=>r.templateId===input.templateId&&r.templateVersion===input.templateVersion);
 if(!recipe)throw new Error(`Unavailable pinned template: ${input.templateId}@${input.templateVersion}`);
 const checked=validateContent(recipe,input.content);if(checked.errors.length)throw new Error(checked.errors.join('; '));
 return {recipe,content:input.content,design:resolveDesign(recipe,input.design),warnings:checked.warnings};
}
