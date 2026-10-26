(function(root){
'use strict';
const C=root.ElectaCore,esc=C.esc;
const toolNames={results:'Resultados electorales',hemi:'Hemiciclo',pacts:'Calculadora de pactos',compare:'Comparativa de escaños',turnout:'Participación'};
function validData(data){const result=C.issues(data);if(result.errors.length)throw Error(result.errors.join(' '));return data;}
function buildHTML({css,core,exporter,app,data,tool='results',theme='light'}){
 validData(data);if(!toolNames[tool])throw Error('Herramienta no válida.');
 if([css,core,exporter,app].some(s=>typeof s!=='string'||!s.trim()))throw Error('Faltan recursos para crear el HTML.');
 const pack=C.encode({version:1,data,tool,theme:theme==='dark'?'dark':'light'}),safe=s=>s.replace(/<\/script/gi,'<\\/script');
 const localCSS=css.replace(/@import\s+url\([^)]*\)\s*;/gi,'').replace(/@import\s+["'][^"']+["']\s*;/gi,'');
 return`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(data.title)} · ${toolNames[tool]}</title><style>${localCSS}</style></head><body><div id="app"></div><div id="toast" role="status"></div><script>${safe(core)}\n${safe(exporter)}\nwindow.ELECTA_EMBED=ElectaCore.decode('${pack}');\n${safe(app)}<\/script><\/body><\/html>`;
}
function csv(data){
 validData(data);
 const quote=v=>'"'+(typeof v==='string'&&/^[\s]*[=+\-@]/.test(v)?"'"+v:String(v)).replace(/"/g,'""')+'"';
 return'\ufeff'+[['nombre','votos','porcentaje','escanos','anteriores','color'],...data.parties.map(p=>[p.name,p.votes,p.pct,p.seats,p.previous,p.color])].map(r=>r.map(quote).join(';')).join('\r\n');
}
function publicURL(value){const url=new URL(String(value).trim());if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw Error('Introduce una dirección pública http o https sin credenciales.');return url.href;}
function iframe({url,data,tool}){
 validData(data);if(!toolNames[tool])throw Error('Herramienta no válida.');const n=data.parties.length;
 const h=tool==='pacts'?420+n*80:tool==='results'?300+n*60:tool==='hemi'?640:tool==='compare'?310+n*75:560;
 return`<iframe src="${esc(publicURL(url))}" title="${toolNames[tool]} · ${esc(data.title)}" width="100%" height="${h}" style="display:block;width:100%;border:0;border-radius:12px" loading="lazy"></iframe>`;
}
function wrap(value,width){const text=String(value).replace(/\s+/g,' ').trim();const lines=[];let line='';for(const word of text.split(' ')){if(!word)continue;const pieces=word.length>width?word.match(new RegExp('.{1,'+width+'}','gu')):[word];for(const piece of pieces){if(line&&line.length+piece.length+1>width){lines.push(line);line='';}line+=(line?' ':'')+piece;}}if(line)lines.push(line);return lines.length?lines:[''];}
function svg(data,{sort='seats',dateLabel=''}={}){
 validData(data);const format=(v,d=0)=>new Intl.NumberFormat('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
 const titleLines=wrap(data.title,48),territoryLines=wrap(data.territory+(data.demo?' · SIMULACIÓN':''),110),sourceLines=wrap('Fuente: '+data.source,105);
 const header=30+territoryLines.length*17+titleLines.length*36+40,footer=50+sourceLines.length*17,H=header+data.parties.length*62+footer;
 const parties=[...data.parties].sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'es'):b[sort]-a[sort]||b.seats-a.seats),max=Math.max(1,...parties.map(p=>p.pct));
 const text=(x,y,value,size=16,fill='#33432f',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
 let body=territoryLines.map((s,i)=>text(45,32+i*17,s,11,'#65775c')).join('');
 const titleTop=32+territoryLines.length*17+19;body+=titleLines.map((s,i)=>text(45,titleTop+i*36,s,30,'#253b2c','font-weight="700"')).join('');
 body+=text(810,header-13,'% VOTO',11,'#65775c')+text(950,header-13,'ESC.',11,'#65775c','text-anchor="end"');
 for(const [i,p]of parties.entries()){
  const y=header+i*62,short=[...p.name].length>25?[...p.name].slice(0,24).join('')+'…':p.name;
  body+=`<g><title>${esc(p.name)}</title><rect x="45" y="${y}" width="9" height="25" rx="3" fill="${p.color}"/>${text(68,y+19,short,16)}<rect x="310" y="${y}" width="${p.pct/max*470}" height="27" rx="4" fill="${p.color}"/>${text(810,y+20,format(p.pct,1)+' %',18,'#33432f','font-weight="700"')}${text(950,y+20,format(p.seats),18,'#65775c','text-anchor="end"')}</g>`;
 }
 const footY=header+data.parties.length*62;body+=`<line x1="45" x2="955" y1="${footY}" y2="${footY}" stroke="#e4e8dc"/>`;
 body+=sourceLines.map((s,i)=>text(45,footY+23+i*17,s,11,'#65775c')).join('');
 body+=text(45,H-13,dateLabel,10,'#65775c')+text(955,H-13,'electa · Dröma',14,'#33503b','text-anchor="end"');
 return`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${H}" viewBox="0 0 1000 ${H}" role="img" aria-label="${esc(data.title)}"><rect width="100%" height="100%" fill="#fff"/><g font-family="Arial,sans-serif">${body}</g></svg>`;
}
root.ElectaExports={buildHTML,csv,iframe,publicURL,svg};
})(typeof window!=='undefined'?window:globalThis);
