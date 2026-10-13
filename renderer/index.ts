/** Consumer entry: the Lab and this package reuse the same bridge and renderer components. */
import {makeSpec,prepareFonts,renderRecipe} from '../lab/restored';
import {resolveSavedTemplate,type RecipeManifest,type SavedTemplate} from './contract';
export {resolveDesign,validateContent,deriveCapabilities,resolveSavedTemplate} from './contract';
export {prepareFonts};
export function createTemplateDocument(recipes:RecipeManifest[],input:SavedTemplate,assetUrls:Record<string,string>={}){
 const resolved=resolveSavedTemplate(recipes,input);
 for(const key of Object.keys(assetUrls))if(!resolved.recipe.assetSlots?.[key])throw new Error(`Unknown image slot: ${key}`);
 const document=makeSpec(input.templateId,resolved.content,resolved.design,assetUrls);
 return {...document,pin:{templateId:input.templateId,templateVersion:input.templateVersion},warnings:resolved.warnings};
}
export async function renderTemplate(host:HTMLElement,recipes:RecipeManifest[],input:SavedTemplate,assetUrls:Record<string,string>={},onListFit?:(report:any)=>void){
 const resolved=resolveSavedTemplate(recipes,input);
 createTemplateDocument(recipes,input,assetUrls); // validate slot names before loading/rendering
 await prepareFonts();
 renderRecipe(host,resolved.recipe,resolved.content,resolved.design,assetUrls,onListFit);
 return {pin:{templateId:input.templateId,templateVersion:input.templateVersion},warnings:resolved.warnings};
}
