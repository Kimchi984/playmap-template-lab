import test from 'node:test';
import assert from 'node:assert/strict';
import {monotonicHeadline} from '../rules/fitting.js';
// The DOM metric source is independently verified in the browser. Here we test the
// sizing policy across arbitrary capacities, including the previous inversion cases.
test('size intent never reverses, even when wrapping creates a shared ceiling',()=>{
  const targets={small:108,default:132,large:160};
  for(let capacity=56;capacity<=190;capacity++){
    const measurer={fit:()=>({size:capacity,fits:true})};
    const r=monotonicHeadline(measurer,'Any real content',860,395,targets,56,{});
    assert.ok(r.sizes.large>=r.sizes.default&&r.sizes.default>=r.sizes.small);
    for(const key of Object.keys(targets)){assert.equal(r.sizes[key],Math.min(capacity,targets[key]));assert.equal(r.constrained[key],capacity<targets[key]);}
  }
});
test('infeasible floor is carried through; cannot report success',()=>{
 const r=monotonicHeadline({fit:()=>({size:56,fits:false})},'Unfittable',200,20,{small:100,default:120,large:140},56,{});
 assert.equal(r.fits,false);assert.deepEqual(r.sizes,{small:56,default:56,large:56});
});
