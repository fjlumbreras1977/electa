(function(root){
'use strict';
const colors=['#d98157','#7e8ab9','#7fa692','#b29cbd','#bba56a'];
const demo=()=>({version:1,title:'Elecciones generales',territory:'Ámbito nacional',totalSeats:120,majority:61,counted:84.6,turnout:71.4,previousTurnout:69.8,source:'Datos de muestra · Sin valor oficial',updated:new Date().toISOString(),demo:true,parties:[{id:'p1',name:'Horizonte',short:'HOR',color:colors[0],votes:1880000,pct:37.6,seats:47,previous:42},{id:'p2',name:'Alianza Cívica',short:'AC',color:colors[1],votes:1340000,pct:26.8,seats:32,previous:37},{id:'p3',name:'Verde Común',short:'VC',color:colors[2],votes:770000,pct:15.4,seats:18,previous:16},{id:'p4',name:'Unión Liberal',short:'UL',color:colors[3],votes:605000,pct:12.1,seats:14,previous:17},{id:'p5',name:'Voz Regional',short:'VR',color:colors[4],votes:405000,pct:8.1,seats:9,previous:8}]});
const esc=s=>String(s??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validDate(value){
 if(typeof value!=='string')return false;const m=value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/);if(!m)return false;
 const [year,month,day,hour,minute,second]=m.slice(1).map(Number),days=[31,year%4===0&&(year%100!==0||year%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
 return year>=1&&month>=1&&month<=12&&day>=1&&day<=days[month-1]&&hour<=23&&minute<=59&&(!m[6]||second<=59)&&Number.isFinite(Date.parse(value));
}
const isNumber=n=>typeof n==='number'&&Number.isFinite(n);
function number(value,label,{draft=false,optional=false}={}){
 if(value===null||value===undefined||typeof value==='string'&&!value.trim()){
  if(draft)return null;if(optional&&value===undefined)return 0;throw Error('Falta una cifra: '+label+'.');
 }
 if(typeof value!=='number'&&typeof value!=='string')throw Error('Cifra no válida: '+label+'.');
 if(typeof value==='string'&&!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()))throw Error('Cifra no válida: '+label+'.');const n=Number(value);if(!Number.isFinite(n))throw Error('Cifra no válida: '+label+'.');return n;
}
function text(value,label,max,draft=false){
 if(value===null||value===undefined)value='';
 if(typeof value!=='string'||value.length>max)throw Error(label+': utiliza texto de hasta '+max+' caracteres.');
 return draft?value:value.trim();
}
function normalize(raw,allowDraft=false){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||!Array.isArray(raw.parties)||raw.parties.length<1||raw.parties.length>100)throw Error('El proyecto debe contener entre 1 y 100 partidos.');
 if(raw.version!==undefined&&raw.version!==1)throw Error('La versión de este proyecto no es compatible.');
 const n={version:1};
 for(const key of ['title','territory','source'])n[key]=text(raw[key],key==='title'?'Título':key==='source'?'Fuente':'Territorio',300,allowDraft);
 for(const key of ['totalSeats','majority','counted','turnout','previousTurnout'])n[key]=number(raw[key],key,{draft:allowDraft});
 if(validDate(raw.updated))n.updated=new Date(raw.updated).toISOString();else if(allowDraft)n.updated=null;else throw Error('Indica una fecha y hora válidas para los datos.');
 if(raw.demo!==undefined&&typeof raw.demo!=='boolean')throw Error('La identificación de demostración debe ser verdadera o falsa.');n.demo=raw.demo!==false;
 const ids=new Set();
 n.parties=raw.parties.map((p,i)=>{
  if(!p||typeof p!=='object'||Array.isArray(p))throw Error('Partido no válido en la fila '+(i+1)+'.');
  const id=typeof p.id==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(p.id)&&!ids.has(p.id)?p.id:'p'+(i+1);ids.add(id);
  const out={id,name:text(p.name,'Nombre de partido',80,allowDraft),short:text(p.short,'Siglas',12,allowDraft),color:/^#[0-9a-f]{6}$/i.test(p.color)?p.color:colors[i%colors.length]};
  for(const k of ['votes','pct','seats','previous'])out[k]=number(p[k],out.name+' / '+k,{draft:allowDraft,optional:k!=='seats'});
  return out;
 });
 // Regenerate all keys together if a fallback collided with a retained key.
 if(new Set(n.parties.map(p=>p.id)).size!==n.parties.length)n.parties.forEach((p,i)=>p.id='p'+(i+1));
 const result=issues(n);if(!allowDraft&&result.errors.length)throw Error(result.errors.join(' '));return n;
}
function issues(d){
 const errors=[],warnings=[];
 if(!d||!Array.isArray(d.parties)||!d.parties.length||d.parties.length>100)return{errors:['Añade entre 1 y 100 partidos.'],warnings};
 const sum=k=>d.parties.reduce((s,p)=>s+(isNumber(p?.[k])?p[k]:0),0);
 if(typeof d.title!=='string'||!d.title.trim())errors.push('Escribe el nombre de la elección.');
 if(typeof d.source!=='string'||!d.source.trim())errors.push('Indica la fuente de los datos.');
 if(!validDate(d.updated))errors.push('Indica una fecha y hora válidas para los datos.');
 if(!Number.isSafeInteger(d.totalSeats)||d.totalSeats<1||d.totalSeats>2000)errors.push('La cámara debe tener entre 1 y 2.000 escaños.');
 if(!Number.isSafeInteger(d.majority)||d.majority<1||d.majority>d.totalSeats)errors.push('El umbral de mayoría debe estar entre 1 y el total de escaños.');
 for(const k of ['counted','turnout','previousTurnout'])if(!isNumber(d[k])||d[k]<0||d[k]>100){errors.push('Escrutinio y participación deben estar entre 0 y 100 %.');break;}
 if(d.parties.some(p=>!/^#[0-9a-f]{6}$/i.test(p?.color)))errors.push('Utiliza colores hexadecimales válidos para los partidos.');
 if(d.parties.some(p=>typeof p?.name!=='string'||!p.name.trim()))errors.push('Todos los partidos necesitan un nombre.');
 if(d.parties.some(p=>!p||!Number.isSafeInteger(p.seats)||p.seats<0||!Number.isSafeInteger(p.previous)||p.previous<0||!Number.isSafeInteger(p.votes)||p.votes<0||!isNumber(p.pct)||p.pct<0||p.pct>100))errors.push('Revisa votos, porcentajes y escaños: deben ser positivos o cero; votos y escaños, enteros válidos. No dejes cifras vacías.');
 if(!Number.isSafeInteger(sum('votes'))||!Number.isSafeInteger(sum('previous'))||!Number.isSafeInteger(sum('seats')))errors.push('El total de votos o escaños supera la precisión admitida.');
 if(sum('seats')>d.totalSeats)errors.push('Los escaños asignados superan el total de la cámara.');
 if(sum('pct')>100.050000001)errors.push('Los porcentajes de voto suman más del 100 %.');
 const names=d.parties.map(p=>String(p?.name??'').trim().normalize('NFC').toLocaleLowerCase('es'));
 if(new Set(names).size<d.parties.length)errors.push('Hay nombres de partidos repetidos.');
 if(d.demo)warnings.push('Datos de demostración: la pieza se identificará como simulación.');
 if(sum('seats')<d.totalSeats)warnings.push(`${d.totalSeats-sum('seats')} escaños todavía sin asignar. La calculadora señalará que el resultado es provisional.`);
 if(sum('pct')<99.9)warnings.push('Los porcentajes no suman el 100 %. Puede haber otras candidaturas o votos no incluidos.');
 if(sum('previous')!==d.totalSeats)warnings.push('Los escaños de la elección anterior no suman el total actual. Comprueba si cambió el tamaño de la cámara.');
 if(sum('votes')>0&&d.parties.some(p=>isNumber(p?.pct)&&Math.abs(p.pct-p.votes/sum('votes')*100)>.2))warnings.push('Votos y porcentajes utilizan bases diferentes. Revisa el denominador o usa «Calcular % desde votos».');
 return{errors,warnings};
}
function coalition(d,roles={},rule='absolute'){
 const sum=role=>d.parties.reduce((s,p)=>s+(roles[p.id]===role?p.seats:0),0),yes=sum('yes'),abstain=sum('abstain');
 const no=d.parties.reduce((s,p)=>s+(!['yes','abstain'].includes(roles[p.id])?p.seats:0),0),assigned=d.parties.reduce((s,p)=>s+p.seats,0),pending=Math.max(0,d.totalSeats-assigned);
 return{yes,no,abstain,pending,missing:Math.max(0,d.majority-yes),passed:rule==='simple'?yes>no:yes>=d.majority,provisional:pending>0};
}
function percentages(parties){
 if(!parties.length||parties.some(p=>!Number.isSafeInteger(p.votes)||p.votes<0))throw Error('Introduce votos enteros válidos antes de calcular los porcentajes.');
 const total=parties.reduce((s,p)=>s+BigInt(p.votes),0n);if(!total)throw Error('Introduce al menos un voto para calcular porcentajes.');
 const shares=parties.map((p,i)=>({i,units:Number(BigInt(p.votes)*10000n/total),remainder:BigInt(p.votes)*10000n%total}));
 let remaining=10000-shares.reduce((s,p)=>s+p.units,0);const order=[...shares].sort((a,b)=>a.remainder===b.remainder?a.i-b.i:a.remainder>b.remainder?-1:1);
 for(let i=0;i<remaining;i++)order[i].units++;
 return shares.map(s=>s.units/100);
}
function encode(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let s='';for(const b of bytes)s+=String.fromCharCode(b);const encoded=btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');if(encoded.length>200000)throw Error('La pieza es demasiado grande.');return encoded;}
function decode(s){if(typeof s!=='string'||!s||s.length>200000||!/^[a-zA-Z0-9_-]+={0,2}$/.test(s))throw Error('El enlace de la pieza no es válido o es demasiado grande.');const bytes=Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}
function parseCSV(input){
 if(typeof input!=='string'||input.length>2000000)throw Error('El CSV no es válido o supera los 2 MB.');
 const source=input.replace(/^\ufeff/,''),first=source.split(/\r?\n/)[0];
 const sep=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';
 const lines=[];let row=[],field='',quoted=false,closed=false;
 const pushRow=()=>{row.push(field);if(row.some(v=>v.trim()))lines.push(row);row=[];field='';closed=false;};
 for(let i=0;i<source.length;i++){
  const c=source[i];
  if(quoted){if(c==='"'){if(source[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
  if(c==='"'){if(field.trim()||closed)throw Error('Comillas no válidas en el CSV.');field='';quoted=true;}
  else if(c===sep){row.push(field);field='';closed=false;}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&source[i+1]==='\n')i++;pushRow();}
  else if(closed){if(!/\s/.test(c))throw Error('Texto no válido después de unas comillas de cierre.');}
  else field+=c;
 }
 if(quoted)throw Error('El CSV contiene comillas sin cerrar.');pushRow();
 const headers=(lines.shift()||[]).map(x=>x.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));
 if(new Set(headers).size!==headers.length)throw Error('El CSV contiene cabeceras repetidas.');
 const col=(...names)=>headers.findIndex(h=>names.includes(h)),name=col('nombre','name','partido'),pct=col('porcentaje','pct','voto','votos_pct'),seats=col('escanos','seats','diputados'),votes=col('votos','votes'),previous=col('anteriores','previous'),color=col('color');
 if(name<0||seats<0)throw Error('El CSV necesita las columnas nombre y escanos. Opcionales: votos, porcentaje, anteriores y color.');
 if(!lines.length||lines.length>100)throw Error('El CSV debe contener entre 1 y 100 partidos.');
 const result=lines.map((r,i)=>{
  if(r.length!==headers.length)throw Error('La fila '+(i+2)+' tiene un número de columnas diferente a la cabecera.');
  const value=(j,label,optional=false)=>number(j<0?undefined:r[j].trim().replace(',','.'),label+' en fila '+(i+2),{optional});
  const partyName=r[name].trim().replace(/^'(?=[=+\-@])/,'');
  return{id:'p'+(i+1),name:partyName,short:'',color:color<0||!r[color].trim()?colors[i%colors.length]:r[color].trim(),votes:value(votes,'votos',true),pct:value(pct,'porcentaje',true),seats:value(seats,'escaños'),previous:value(previous,'escaños anteriores',true)};
 });
 if(pct<0&&votes>=0&&result.some(p=>p.votes>0)){const values=percentages(result);result.forEach((p,i)=>p.pct=values[i]);}
 return result;
}
root.ElectaCore={demo,esc,normalize,issues,coalition,encode,decode,parseCSV,percentages,validDate,colors};
})(typeof window!=='undefined'?window:globalThis);
