(function(root){
'use strict';
function bounds(points){return points.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);}
function normalize(regions){
 if(!Array.isArray(regions)||regions.length>300)throw Error('La cartografía debe contener hasta 300 territorios.');let count=0;const points=[];
 const result=regions.map((r,i)=>{
  const g=r?.geometry;if(!g||!['Polygon','MultiPolygon'].includes(g.type)||!Array.isArray(g.coordinates))throw Error('Geometría no válida en territorio '+(i+1));
  const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;if(!polys.length)throw Error('El territorio no contiene polígonos.');
  const coordinates=polys.map(poly=>{if(!Array.isArray(poly)||!poly.length)throw Error('Polígono vacío.');return poly.map(ring=>{if(!Array.isArray(ring)||ring.length<4)throw Error('Cada anillo necesita al menos cuatro coordenadas.');return ring.map(p=>{if(!Array.isArray(p)||p.length<2||!p.slice(0,2).every(n=>typeof n==='number'&&Number.isFinite(n)))throw Error('Hay coordenadas inválidas.');if(++count>250000)throw Error('Máximo de 250.000 coordenadas.');const pair=[p[0],p[1]];points.push(pair);return pair;});});});
  return{name:String(r.name||'Territorio '+(i+1)).slice(0,80),geometry:{type:g.type,coordinates:g.type==='Polygon'?coordinates[0]:coordinates},partyName:typeof r.partyName==='string'?r.partyName.slice(0,70):''};
 });
 if(points.length){const b=bounds(points);if(b[0]===b[2]||b[1]===b[3]||!Number.isFinite(b[2]-b[0])||!Number.isFinite(b[3]-b[1])||!Number.isFinite(Math.min(810/(b[2]-b[0]),1000/(b[3]-b[1]))))throw Error('Los límites de la cartografía no son válidos.');}return result;
}
root.ElectaGeometry={normalize,bounds};
})(typeof window!=='undefined'?window:globalThis);
