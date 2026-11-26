const maxBytes = 12 * 1024 * 1024;
export const json = (value, status = 200) => Response.json(value, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' }
});
const asset = (body, type) => new Response(body, {headers:{
  'Content-Type': type, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': "frame-ancestors 'none'; object-src 'none'; base-uri 'none'"
}});
export async function loadWorkspace(db, owner, space) {
  const {results} = await db.prepare(
    'SELECT w.revision, p.payload FROM disk_workspace w JOIN disk_workspace_part p USING(owner_id, space, revision) WHERE w.owner_id=? AND w.space=? ORDER BY p.part'
  ).bind(owner, space).all();
  return results.length
    ? {revision: results[0].revision, data: JSON.parse(results.map(row => row.payload).join(''))}
    : {revision: null, data: null};
}
export async function storeWorkspace(db, owner, space, request) {
  const origin=request.headers.get('Origin');
  if (origin !== new URL(request.url).origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
    return json({error: 'origin'},403);
  }
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({error: 'content type'},415);
  if (Number(request.headers.get('Content-Length')) > maxBytes) return json({error: 'size'},413);
  const reader = request.body?.getReader();
  if(!reader)return json({error:'payload'},400);
  let size=0;
  let body='';
  const decoder=new TextDecoder();
  while(true){
    const chunk=await reader.read();
    if(chunk.done)break;
    size+=chunk.value.byteLength;
    if(size>maxBytes){await reader.cancel();return json({error:'size'},413);}
    body+=decoder.decode(chunk.value,{stream:true});
  }
  let input;
  try{input=JSON.parse(body+decoder.decode());}catch{return json({error:'payload'},400);}
  const {expected,data}=input??{};
  if (!(expected===null||(Number.isSafeInteger(expected)&&expected>0)) ||
      data?.version!==2 || !Number.isSafeInteger(data.revision) || !Number.isSafeInteger(data.next) ||
      !['orders','products','drivers','mileage','closures'].every(key=>Array.isArray(data[key])) || !data.fees) {
    return json({error:'payload'},400);
  }
  const current=await db.prepare('SELECT revision FROM disk_workspace WHERE owner_id=? AND space=?').bind(owner,space).first('revision');
  if(current!==expected)return json({error:'conflict'},409);
  const revision=(expected??0)+1;
  const token=crypto.randomUUID();
  const update = expected===null
    ? db.prepare('INSERT OR IGNORE INTO disk_workspace(owner_id,space,revision,write_token) VALUES(?,?,?,?)').bind(owner,space,revision,token)
    : db.prepare('UPDATE disk_workspace SET revision=?,write_token=? WHERE owner_id=? AND space=? AND revision=?').bind(revision,token,owner,space,expected);
  const statements=[update];
  const payload=JSON.stringify(data);
  const charsPerPart=256*1024;
  for(let offset=0,part=0;offset<payload.length;part++){
    let end=Math.min(offset+charsPerPart,payload.length);
    if(end<payload.length&&/[\uD800-\uDBFF]/.test(payload[end-1]))end--;
    statements.push(db.prepare(
      'INSERT INTO disk_workspace_part(owner_id,space,revision,part,payload) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM disk_workspace WHERE owner_id=? AND space=? AND revision=? AND write_token=?)'
    ).bind(owner,space,revision,part,payload.slice(offset,end),owner,space,revision,token));
    offset=end;
  }
  statements.push(db.prepare(
    'DELETE FROM disk_workspace_part WHERE owner_id=? AND space=? AND revision<>? AND EXISTS (SELECT 1 FROM disk_workspace WHERE owner_id=? AND space=? AND revision=? AND write_token=?)'
  ).bind(owner,space,revision,owner,space,revision,token));
  const result=await db.batch(statements);
  if(result[0].meta.changes!==1)return json({error:'conflict'},409);
  return json({revision});
}
