'use strict';

const paths = {
  beer:'<path d="M6 6h10v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zM16 8h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M9 10v7m4-7v7M5 6a2.5 2.5 0 0 1 3-3A3 3 0 0 1 13 3a2.5 2.5 0 0 1 4 3z"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  truck:'<path d="M3 6h12v12H3zM15 10h4l3 4v4h-7"/><circle cx="7" cy="18" r="2" fill="var(--surface)"/><circle cx="18" cy="18" r="2" fill="var(--surface)"/>',
  box:'<path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4m-9 4v10m-4-16 9 4"/>',
  chart:'<path d="M3 3v18h18M8 16v-4m5 4V8m5 8V5"/>',
  history:'<path d="M3 12a9 9 0 1 1 3 7m-3-7V6m0 6h6m3-5v5l3 2"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="m10 3-1 3-3 1-3 3v4l3 1 1 3 3 3h4l1-3 3-1 3-3v-4l-3-1-1-3-3-3z"/>',
  disk:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M7 15h10m-8-7h6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  moon:'<path d="M20 15a8.4 8.4 0 0 1-11-11 8.5 8.5 0 1 0 11 11z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  phone:'<path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a12 12 0 0 1-6-6l2-2z"/>',
  chat:'<path d="M20 11a8 8 0 0 1-8 8H4l1.8-4A8 8 0 1 1 20 11zM8 11h.01M12 11h.01M16 11h.01"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  wallet:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18m-8 5h4"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  inbox:'<path d="M4 12 7 5h10l3 7v7H4zM4 12h5l1 3h4l1-3h5"/><path d="M12 7v5m-2-2 2 2 2-2"/>',
  packed:'<path d="M4 8h16v12H4zM4 8l2-4h12l2 4m-11 6 2 2 4-4"/>',
  search:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  print:'<path d="M7 8V3h10v5m-10 9H4v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7h-3M7 14h10v7H7z"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  bottle:'<path d="M10 3h4v6l3 4v7H7v-7l3-4zM7 14h10"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>'
};
const icon = name => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || '') + '</svg>';
const $ = id => document.getElementById(id);
const mobileLayout=matchMedia('(max-width:600px)');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const productNameCollator = new Intl.Collator('pt-BR',{sensitivity:'base',numeric:true});
const compareProductNames = (first,second) => productNameCollator.compare(first.name,second.name);
const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const currency = new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'});
const money = cents => currency.format(cents / 100);
const cents = value => Math.round(Number(String(value).replace(',', '.')) * 100);
const sum = (rows, get) => rows.reduce((total, row) => total + get(row), 0);
const zone = 'America/Sao_Paulo';
const datefmt = new Intl.DateTimeFormat('sv-SE', {timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});
const dateKey = (value = Date.now()) => datefmt.format(new Date(value));
const time = value => new Intl.DateTimeFormat('pt-BR',{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(new Date(value));
const fullDate = value => new Intl.DateTimeFormat('pt-BR',{timeZone:zone,dateStyle:'short',timeStyle:'short'}).format(new Date(value));
const dayLabel = value => value.split('-').reverse().join('/');
const uid = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
const code = order => '#' + String(order.number).padStart(3,'0');
const isDone = o => o.status === 'completed' || o.status === 'cancelled';
const kindLabels = {entrega:'Entrega',retirada:'Retirada',urbano:'Entrega',rural:'Entrega'};
const labels = {new:'Novo pedido',packing:'Em separação',ready:'Pronto',route:'Em rota',completed:'Concluído',cancelled:'Cancelado'};
const statusIcons = {new:'inbox',packing:'box',ready:'packed',route:'truck',completed:'check',cancelled:'close'};
const orderChannels = ['Telefone','WhatsApp','Balcão'];
const channelName = channel => channel==='Ligação'?'Telefone':channel;
const payments = ['Pix','Dinheiro','Cartão de débito','Cartão de crédito','Fiado'];
const modes=[['complete','Completa'],['attendant','Atendente'],['driver','Entregador']];
const sections = [
  ['board','Visão geral','grid'],['delivery','Entregas','truck'],['stock','Produtos e estoque','box'],
  ['history','Histórico','history'],['reports','Fechamento','wallet'],['analytics','Gráficos e comparativos','chart'],['settings','Configurações','settings']
];
const catalog = [
  ['Caixa Brahma 600 ml (24 un)','Cervejas',18500,18,5,true],['Caixa Skol 600 ml (24 un)','Cervejas',18000,12,5,true],
  ['Caixa Heineken 600 ml (24 un)','Cervejas',26000,4,5,true],['Caixa Original 600 ml (24 un)','Cervejas',21000,10,4,true],
  ['Fardo Brahma Duplo Malte (12 un)','Cervejas',4800,25,8,false],['Fardo Heineken Long Neck (6 un)','Cervejas',4200,20,6,false],
  ['Fardo Amstel Lata (12 un)','Cervejas',4400,15,6,false],['Coca-Cola 2 L','Sem álcool',1200,30,10,false],
  ['Saco de gelo 5 kg','Gelo e carvão',1500,3,8,false],['Carvão vegetal 4 kg','Gelo e carvão',2200,14,5,false]
].map(([name,category,price,stock,min,bottle],index)=>({id:'p'+(index+1),name,category,price,stock,min,bottle,active:true}));
// A operação real começa vazia. Os dados fictícios são criados separadamente.
const blank = () => ({version:2,revision:0,next:101,orders:[],products:[],drivers:[],mileage:[],closures:[],fees:{entrega:0}});
const makeItem = (p,qty) => ({productId:p.id,name:p.name,qty,price:p.price,bottle:p.bottle});
// A demonstração preenche o painel sem usar pedidos da operação real.
function demoData(){
  const data = blank();
  data.products = structuredClone(catalog);
  data.drivers = ['Moto 1','Moto 2'];
  const rows = [
    [101,8,'Ana Paula','urbano','Rua São Sebastião, 42 · Centro','Portão azul, perto da praça','WhatsApp','new','Pix',false,'',500,0,0,[[8,2],[9,1]]],
    [102,23,'Rafael','rural','Sítio Boa Vista','Após a ponte, primeira porteira à direita','Telefone','new','Dinheiro',false,'',1200,30000,0,[[1,1],[9,1]]],
    [103,29,'Mariana','urbano','Rua da Matriz, 18 · Centro','Entregar na casa da avó','WhatsApp','packing','Pix',true,'',500,0,1,[[3,1]]],
    [104,35,'Bruno','retirada','','','Telefone','ready','Cartão de débito',false,'',0,0,0,[[5,1],[10,1]]],
    [105,41,'Lucas','urbano','Rua do Campo, 78','Casa em frente ao campo','WhatsApp','route','Dinheiro',false,'Moto 1',500,10000,0,[[7,1],[8,2]]],
    [106,65,'Júlia','urbano','Praça da Igreja, 12','Ao lado da padaria','WhatsApp','completed','Pix',true,'Moto 2',500,0,0,[[6,1],[9,1]]],
    [107,80,'Pedro','retirada','','','Telefone','completed','Dinheiro',true,'',0,20000,1,[[2,1]]]
  ];
  data.orders = rows.map(([number,minutes,name,kind,address,reference,channel,status,payment,paid,driver,fee,cash,bottles,items]) => {
    const now = Date.now();
    const midnight = Date.parse(dateKey(now)+'T00:00:00-03:00');
    const at = Math.max(midnight,now-minutes*60000);
    const lines = items.map(([index,qty]) => makeItem(catalog[index-1],qty));
    for (const item of lines) data.products.find(p=>p.id===item.productId).stock -= item.qty;
    const trail = [{at,label:'Pedido registrado'}];
    if(status!=='new') trail.push({at:Math.min(now,at+120000),label:labels[status]});
    return {id:'demo-'+number,number,at,name,kind,address,reference,channel,status,payment,paid,driver,fee,cash,
      phone:'',notes:'',map:'',due:'',bottles,returned:0,items:lines,trail};
  });
  data.next = 108;
  return data;
}
const prefix='disk-menezes-publico-';
const hosted=document.querySelector('meta[name="disk-storage"]')?.content==='server';
const read = key => {try{return localStorage.getItem(prefix+key)}catch{return null}};
let environment=read('environment')==='real'?'real':'demo';
let theme=read('theme')==='dark'?'dark':'light';
function load(which=environment){
  try {
    const raw=hosted?null:read(which);
    if(raw) return JSON.parse(raw);
  } catch {}
  return which==='demo'?demoData():blank();
}
let db=load();
let page='board', mode='complete', query='', filter='all', reportDate=dateKey(), historyDate='', analyticsPeriod='week';
let edit=null, dialogState=null, noticeTimer;
let mobileStage='new';
let serverVersion=null, serverReady=!hosted, refreshSequence=0, writing=false;
function storageStatus(message=''){
  $('storage-banner').textContent=message;
  $('storage-banner').hidden=!message;
}
function signInAgain(){
  serverReady=false;
  serverVersion=null;
  if($('modal').open)$('modal').close();
  db=load();
  $('print').replaceChildren();
  render(true);
  storageStatus('A sessão precisa ser confirmada. ');
  const link=document.createElement('a');
  link.href='/entrar';
  link.target='_top';
  link.textContent='Entrar novamente';
  $('storage-banner').append(link);
}
function cache(next,which){
  try{localStorage.setItem(prefix+which,JSON.stringify(next));return true}
  catch{return false}
}
async function remoteWrite(next,which,expected){
  const response=await fetch('/api/state/'+which,{method:'PUT',headers:{'Content-Type':'application/json'},cache:'no-store',
    body:JSON.stringify({expected,data:next})});
  if(response.status===401||response.status===403||response.redirected){
    signInAgain();
    throw Error('Confirme a sessão para continuar.');
  }
  if(response.status===409) throw Error('Outro acesso alterou os dados. Feche esta tela, consulte a versão atual e tente novamente.');
  if(response.status===413) throw Error('O volume da base excede o limite de gravação. Exporte um backup antes de continuar.');
  if(!response.ok) throw Error('O site não confirmou a gravação. Confira a conexão e tente novamente.');
  return (await response.json()).revision;
}
async function refreshRemote({bootstrap=false}={}){
  if(!hosted||writing) return;
  const sequence=++refreshSequence, which=environment;
  if(bootstrap){
    serverReady=false;
    storageStatus('Conferindo os dados salvos no site…');
  }
  try{
    const response=await fetch('/api/state/'+which,{cache:'no-store'});
    if(sequence!==refreshSequence||which!==environment||writing)return;
    if(response.status===401||response.status===403||response.redirected){
      signInAgain();
      return;
    }
    if(!response.ok)throw Error();
    const result=await response.json();
    if(sequence!==refreshSequence||which!==environment||writing)return;
    const changed=!serverReady||serverVersion!==result.revision;
    if(changed&&$('modal').open&&!bootstrap){
      storageStatus('Há alterações em outro acesso. Feche o formulário para atualizar.');
      return;
    }
    if(changed){
      db=result.data??load(which);
      render(true);
    }
    serverVersion=result.revision;
    serverReady=true;
    storageStatus();
    updateStorageLabel();
  }catch{
    if(sequence!==refreshSequence||which!==environment)return;
    serverReady=false;
    storageStatus('Dados do site indisponíveis. Verifique a conexão para voltar a gravar.');
    updateStorageLabel();
  }
}
// A revisão evita sobrescrever uma alteração feita por outra aba ou dispositivo.
async function persist(next){
  if(writing)throw Error('Aguarde a gravação em andamento.');
  if(hosted&&!serverReady)throw Error('Aguarde a conexão com os dados do site para gravar.');
  const which=environment;
  if(!hosted){
    const latest=read(which);
    if(latest && JSON.parse(latest).revision!==db.revision){
      db=load();render();
      throw Error('Os dados mudaram em outra aba. Confira a versão atual antes de salvar.');
    }
    next.revision=db.revision+1;
    if(!cache(next,which))throw Error('O navegador não conseguiu salvar. Confira o espaço disponível ou abra o site online.');
    db=next;
    return;
  }
  next.revision=db.revision+1;
  refreshSequence++;
  writing=true;
  try{
    serverVersion=await remoteWrite(next,which,serverVersion);
    db=next;
  }finally{writing=false;}
}
async function mutate(fn){
  const next=structuredClone(db);
  fn(next);
  await persist(next);
}
function toast(message){
  clearTimeout(noticeTimer);
  $('notice').textContent=message;
  $('notice').hidden=false;
  noticeTimer=setTimeout(()=>$('notice').hidden=true,3800);
}
function pill(label, color=''){return '<span class="pill '+color+'">'+esc(label)+'</span>'}
function btn(label,act,glyph='',style='',attrs=''){
  return '<button type="button" class="btn '+style+'" data-act="'+act+'" '+attrs+'>'+ (glyph?icon(glyph):'')+esc(label)+'</button>';
}
function searchBox(placeholder){
  return '<label class="search">'+icon('search')+'<input id="search" type="search" aria-label="'+esc(placeholder)+'" placeholder="'+esc(placeholder)+'" value="'+esc(query)+'"></label>';
}
const options=(entries, selected) => entries.map(entry => {
  const [value,label]=Array.isArray(entry)?entry:[entry,entry];
  return '<option value="'+esc(value)+'" '+(String(value)===String(selected)?'selected':'')+'>'+esc(label)+'</option>';
}).join('');
function pageTitle(title,showOnMobile=false){
  return '<h1 class="page-title'+(showOnMobile?' page-title-mobile':'')+'">'+esc(title)+'</h1>';
}
const headerDateFormat=new Intl.DateTimeFormat('pt-BR',{timeZone:zone,weekday:'short',day:'numeric',month:'long'});
function updateHeaderDate(){
  const now=new Date();
  $('header-date').dateTime=dateKey(now);
  $('header-date').textContent=headerDateFormat.format(now).replace('.', '');
  $('header-demo').hidden=environment!=='demo';
}
function metric(label,value,note,glyph,color=''){
  return '<article class="metric"><div class="metric-top"><span class="tile '+color+'">'+icon(glyph)+'</span>'+esc(label)+'</div><strong>'+esc(value)+'</strong>'+(note?'<small>'+esc(note)+'</small>':'')+'</article>';
}
function orderTotal(o){return sum(o.items,i=>i.price*i.qty)+o.fee}
function destination(o){return o.kind==='retirada'?'Retirada no balcão':o.address}
function isOverdue(o){return o.due && !isDone(o) && new Date(o.due).getTime()<Date.now()}
function match(o){
  return norm([code(o),o.name,o.address,o.reference,o.phone,o.driver,channelName(o.channel),o.payment,...o.items.map(i=>i.name)].join(' ')).includes(norm(query));
}
function actionFor(o){
  if(o.status==='new') return ['Separar','packing'];
  if(o.status==='packing') return ['Marcar pronto','ready'];
  if(o.status==='ready') return o.kind==='retirada'?['Confirmar retirada','completed']:['Despachar','route'];
  if(o.status==='route') return ['Confirmar entrega','completed'];
  return null;
}
function statusBadge(status){
  return '<span class="order-status stage-'+status+'">'+icon(statusIcons[status])+esc(labels[status])+'</span>';
}
function actionButton(o){
  const action=actionFor(o);
  return action?btn(action[0],'advance','','soft','data-id="'+esc(o.id)+'"'):'';
}
function canEditOrder(order){
  return Boolean(order && mode!=='driver' && ['new','packing','ready'].includes(order.status));
}
function editButton(order){
  return canEditOrder(order)?btn('Editar','edit','','','data-id="'+esc(order.id)+'" aria-label="Editar pedido '+code(order)+'"'):'';
}
// Mostro até três produtos no card e deixo os demais expansíveis.
function cardItems(items){
  const first=items.slice(0,3), remaining=items.slice(3);
  const list=rows=>'<ul class="card-items-list" aria-label="Itens do pedido">'+rows.map(item=>
    '<li><strong>'+esc(item.qty)+'×</strong><span>'+esc(item.name)+'</span></li>').join('')+'</ul>';
  if(!items.length)return '';
  return '<div class="card-items">'+list(first)+(remaining.length?'<details><summary>Ver mais '+remaining.length+
    (remaining.length===1?' produto':' produtos')+'</summary>'+list(remaining)+'</details>':'')+'</div>';
}
function card(o,driverView=false){
  const channel=channelName(o.channel);
  const channelIcon=channel==='Telefone'?'phone':channel==='WhatsApp'?'chat':'box';
  const channelDetails=driverView?channel:channel+' · '+o.payment;
  return '<article class="order stage-'+o.status+'"><div class="row spread"><span class="order-code">'+code(o)+'</span>'+statusBadge(o.status)+'</div>'+
    '<h3>'+esc(o.name||destination(o))+'</h3>'+
    '<div class="meta">'+icon(o.kind==='retirada'?'box':'pin')+'<span>'+esc(destination(o))+'</span></div>'+
    (o.reference?'<p class="small">'+esc(o.reference)+'</p>':'')+
    '<div class="meta">'+icon(channelIcon)+'<span>'+esc(channelDetails)+'</span></div>'+
    (driverView?'<p class="small"><strong>'+esc(o.payment)+'</strong> · '+(o.paid?'Recebido':'A receber')+(o.cash?' · Troco '+money(o.cash-orderTotal(o)):'')+'</p>':'')+
    '<div class="row">'+(o.paid?pill('Pago','green'):'')+(o.driver?pill(o.driver,'blue'):'')+(o.bottles>o.returned?pill((o.bottles-o.returned)+' cascos','orange'):'')+
    (o.due?pill((isOverdue(o)?'Atrasado · ':'Até ')+time(o.due),isOverdue(o)?'red':''):'')+'</div>'+
    cardItems(o.items)+'<div class="foot"><div class="row spread"><strong>'+money(orderTotal(o))+'</strong><small>'+time(o.at)+'</small></div>'+
    '<div class="actions" style="margin-top:7px">'+btn('Detalhes','detail','','','data-id="'+esc(o.id)+'"')+editButton(o)+actionButton(o)+'</div></div></article>';
}
function lane(title,status,orders,driver=false){
  return '<section class="lane stage-'+status+'"><h3 class="lane-title"><span class="lane-label"><span class="lane-icon">'+icon(statusIcons[status])+
    '</span>'+title+'</span><span class="count">'+orders.length+'</span></h3><div class="lane-cards">'+
    (orders.map(o=>card(o,driver)).join('')||'<div class="empty">Sem pedidos nesta etapa</div>')+'</div></section>';
}
function rowOrder(o){
  const destinationLabel=destination(o);
  const name=o.name||destinationLabel;
  const payment=o.payment+' · '+(o.paid?'recebido':'a receber');
  return '<article class="listrow"><div><p title="'+esc(name)+'"><span class="order-code">'+code(o)+'</span> <strong>'+esc(name)+'</strong></p><p class="small" title="'+esc(destinationLabel)+'">'+esc(destinationLabel)+'</p></div>'+
    '<div><p>'+statusBadge(o.status)+'</p><p class="small">'+fullDate(o.at)+' · '+esc(channelName(o.channel))+'</p></div>'+
    '<div><strong>'+money(orderTotal(o))+'</strong><p class="small" title="'+esc(payment)+'">'+esc(payment)+'</p></div>'+
    '<div class="actions">'+btn('Detalhes','detail','','','data-id="'+esc(o.id)+'"')+editButton(o)+'</div></article>';
}
// Os filtros do celular usam os mesmos pedidos das colunas do computador.
function mobileBoardControls(groups){
  const stages=[['new','Novos','box'],['packing','Em separação','clock'],['route','Em rota','truck']];
  return '<nav class="mobile-board-controls" aria-label="Fila de pedidos no celular">'+
    stages.map(([status,label,glyph])=>
      '<button type="button" data-act="mobile-stage" data-id="'+status+'" aria-controls="order-board" aria-pressed="'+(mobileStage===status)+
      '">'+icon(glyph)+'<span>'+label+'</span><span class="mobile-stage-count" aria-label="'+groups[status].length+' pedidos">'+groups[status].length+'</span></button>'
    ).join('')+'</nav>';
}
// A fila mostra pedidos abertos. Os finalizados continuam no histórico.
function board(){
  const today=db.orders.filter(o=>dateKey(o.at)===dateKey());
  const active=db.orders.filter(o=>!isDone(o)).sort((a,b)=>a.at-b.at);
  const visible=active.filter(o=>match(o) && (filter==='all'||channelName(o.channel)===filter));
  const recent=today.filter(o=>isDone(o)&&match(o)&&(filter==='all'||channelName(o.channel)===filter)).sort((a,b)=>b.at-a.at).slice(0,4);
  const groups={
    new:visible.filter(o=>o.status==='new'),
    packing:visible.filter(o=>o.status==='packing'||(mobileLayout.matches&&o.status==='ready')),
    ready:visible.filter(o=>o.status==='ready'),
    route:visible.filter(o=>o.status==='route')
  };
  return pageTitle('Visão geral')+
    btn('Novo pedido','new','plus','primary overview-new')+
    '<div class="metrics">'+metric('Pedidos de hoje',today.length,'','box')+
    metric('Em andamento',active.length,active.filter(isOverdue).length+' com prazo vencido','clock','orange')+
    metric('Em rota',active.filter(o=>o.status==='route').length,'Entregas despachadas','truck','blue')+
    (mode==='complete'?metric('Recebido hoje',money(sum(today.filter(o=>o.paid&&o.status!=='cancelled'),orderTotal)),'Por data do pedido','wallet','green'):
      metric('Concluídos hoje',today.filter(o=>o.status==='completed').length,'Entregas e retiradas','check','green'))+'</div>'+
    '<section class="order-queue"><div class="sectionhead"><div><h2>Fila de pedidos</h2><p>Pedidos abertos, do recebimento à entrega</p></div><div class="toolbar">'+searchBox('Buscar pedido ou endereço')+
    '<select id="filter" aria-label="Canal">'+options([['all','Filtrar por canal'],...orderChannels],filter)+'</select></div></div>'+mobileBoardControls(groups)+
    '<div class="board" id="order-board" data-mobile-stage="'+mobileStage+'" tabindex="-1" aria-label="Pedidos por etapa">'+
    lane(labels.new,'new',groups.new)+lane(mobileLayout.matches?'Separação e retirada':labels.packing,'packing',groups.packing)+
    (mobileLayout.matches?'':lane(labels.ready,'ready',groups.ready))+
    lane('Em rota','route',groups.route)+'</div></section>'+
    '<section class="below"><div class="sectionhead"><div><h2>Finalizados hoje</h2><p>Entregas, retiradas e cancelamentos</p></div>'+btn('Ver histórico','open-history','history')+'</div><div class="list">'+
    (recent.map(rowOrder).join('')||'<p class="empty">Nenhum pedido finalizado com estes filtros.</p>')+'</div></section>';
}
function delivery(){
  const scope=db.orders.filter(o=>o.kind!=='retirada'&&!isDone(o)&&match(o)&&(filter==='all'||o.driver===filter));
  scope.sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')||a.at-b.at);
  return pageTitle('Entregas',mode==='driver')+
    '<div class="toolbar" style="margin-bottom:12px">'+searchBox('Buscar destino ou pedido')+'<select id="filter" aria-label="Entregador">'+options([['all','Todos os entregadores'],['','Sem responsável'],...db.drivers],filter)+'</select></div>'+
    '<div class="delivery-grid">'+lane('Prontos para sair','ready',scope.filter(o=>o.status==='ready'),true)+lane('Em rota','route',scope.filter(o=>o.status==='route'),true)+'</div>'+
    (mode==='driver'?'':'<div class="below"><h2 style="margin-bottom:9px">Ainda em preparação</h2><div class="delivery-grid">'+lane(labels.new,'new',scope.filter(o=>o.status==='new'))+lane('Em separação','packing',scope.filter(o=>o.status==='packing'))+'</div></div>');
}
function history(){
  const orders=db.orders.filter(o=>match(o)&&(!historyDate||dateKey(o.at)===historyDate)&&
    (filter==='all'||(filter==='bottles'?o.bottles>o.returned&&o.status!=='cancelled':filter==='unpaid'?!o.paid&&o.status!=='cancelled':(filter==='active'?!isDone(o):o.status===filter)))).sort((a,b)=>b.at-a.at);
  return pageTitle('Histórico')+
    '<div class="toolbar" style="margin-bottom:12px">'+searchBox('Buscar no histórico')+
    '<select id="filter" aria-label="Situação">'+options([['all','Todas as situações'],['active','Em andamento'],...Object.entries(labels),['unpaid','A receber'],['bottles','Cascos pendentes']],filter)+'</select>'+
    '<input id="history-date" type="date" aria-label="Data do pedido" value="'+esc(historyDate)+'">'+btn('Exportar CSV','csv','download')+'</div><p class="small" style="margin-bottom:8px">'+orders.length+' pedido(s)</p><div class="list history-list">'+
    (orders.map(rowOrder).join('')||'<p class="empty">Nenhum pedido encontrado.</p>')+'</div>';
}
function stock(){
  const products=db.products.filter(p=>norm(p.name+' '+p.category).includes(norm(query))&&(filter==='all'||(filter==='low'?p.active&&p.stock<=p.min:!p.active))).sort(compareProductNames);
  return pageTitle('Produtos e estoque',true)+
    '<div class="toolbar" style="margin-bottom:12px">'+searchBox('Buscar produto ou categoria')+'<select id="filter" aria-label="Estoque">'+options([['all','Todos os produtos'],['low','Estoque baixo'],['inactive','Arquivados']],filter)+'</select>'+btn('Novo produto','product','plus','primary')+'</div>'+
    '<div class="list">'+(products.map(p=>'<article class="listrow"><div><strong>'+esc(p.name)+'</strong><p class="small">'+esc(p.category)+(p.bottle?' · Retornável':'')+'</p></div><div><strong>'+money(p.price)+'</strong><p class="small">'+p.stock+' un. · Mín. '+p.min+'</p></div><div>'+
      (!p.active?pill('Arquivado'):p.stock===0?pill('Esgotado','red'):p.stock<=p.min?pill('Estoque baixo','orange'):pill('Disponível','green'))+'</div><div class="actions">'+
      btn('Ajustar estoque','stock-adjust','','','data-id="'+esc(p.id)+'"')+btn('Editar','product','','','data-id="'+esc(p.id)+'"')+'</div></article>').join('')||'<p class="empty">Nenhum produto encontrado.</p>')+'</div>';
}
function reportOrders(){return db.orders.filter(o=>dateKey(o.at)===reportDate)}
function reportTotals(orders){
  const valid=orders.filter(o=>o.status!=='cancelled');
  const paid=valid.filter(o=>o.paid);
  return {valid,paid,unpaid:valid.filter(o=>!o.paid),cancelled:orders.length-valid.length};
}
function reports(print=false){
  const orders=reportOrders(), t=reportTotals(orders), closing=latestClosures().find(c=>c.date===reportDate);
  const closed=closing&&closing.state!=='open';
  const closureActions=closed?btn('Reabrir dia','reopen-day','','primary'):btn('Fechar dia','close-day','check','primary');
  const products=new Map();
  for(const order of t.valid) for(const item of order.items) products.set(item.name,(products.get(item.name)||0)+item.qty);
  const paymentsRows=payments.map(method=>[method,sum(t.paid.filter(o=>o.payment===method),orderTotal),sum(t.unpaid.filter(o=>o.payment===method),orderTotal)]);
  const byDriver=db.drivers.map(driver=>[driver,t.valid.filter(o=>o.driver===driver&&o.status==='completed').length]);
  const skipKm=(db.skipMileage||[]).includes(reportDate);
  const km=skipKm?[]:db.mileage.filter(entry=>entry.date===reportDate);
  return (print?'<h1>Disk Menezes · Fechamento</h1><p>'+dayLabel(reportDate)+'</p>':pageTitle('Fechamento')+
    '<div class="toolbar compact-controls"><label class="field">Data do movimento<input id="report-date" type="date" value="'+esc(reportDate)+'"></label>'+
    (closing?pill(closed?'Fechado às '+time(closing.at):'Reaberto às '+time(closing.at),closed?'green':'orange'):'')+
    '<div class="actions">'+closureActions+btn('Copiar resumo','copy-closing','copy')+btn('Imprimir / PDF','report-print','print')+btn('Exportar CSV','csv','download')+'</div></div>')+
    '<div class="metrics">'+metric('Vendas registradas',money(sum(t.valid,orderTotal)),t.valid.length+' pedido(s)','box')+
    metric('Recebido',money(sum(t.paid,orderTotal)),t.paid.length+' pedido(s) pagos','wallet','green')+
    metric('A receber',money(sum(t.unpaid,orderTotal)),t.unpaid.length+' pedido(s) pendentes','clock','orange')+
    metric('Cancelados',t.cancelled,'Pedidos do dia','close','blue')+'</div>'+
    '<div class="report-grid"><section class="panel"><h2>Meios de pagamento</h2>'+paymentsRows.map(([method,paid,unpaid])=>
      '<div class="itemline"><span><strong>'+esc(method)+'</strong><br><small>A receber '+money(unpaid)+'</small></span><strong>'+money(paid)+'</strong></div>').join('')+'</section>'+
    '<section class="panel"><h2>Itens vendidos</h2>'+([...products].sort((a,b)=>b[1]-a[1]).map(([name,qty])=>'<div class="itemline"><span>'+esc(name)+'</span><strong>'+qty+'</strong></div>').join('')||'<p class="small">Sem itens nesta data.</p>')+'</section>'+
    '<section class="panel"><div class="row spread"><h2>Entregas e quilometragem</h2>'+(print?'':(skipKm?'':btn('Registrar km','mileage','plus'))+btn(skipKm?'Ativar km':'Pular km','toggle-km'))+'</div>'+
    (byDriver.map(([name,count])=>'<div class="itemline"><span>'+esc(name)+'</span><strong>'+count+' concluída(s)</strong></div>').join('')||'<p class="small">Nenhum entregador cadastrado.</p>')+
    (skipKm?'<p class="small">Quilometragem dispensada neste dia.</p>':'')+km.map(entry=>'<div class="itemline"><span>'+esc(entry.vehicle)+'<br><small>'+entry.start+' → '+entry.end+' km</small></span><strong>'+Number((entry.end-entry.start).toFixed(2))+' km</strong></div>').join('')+'</section>'+
    '<section class="panel"><h2>Taxas e retornáveis</h2><div class="itemline"><span>Taxas de entrega</span><strong>'+money(sum(t.valid,o=>o.fee))+'</strong></div>'+
    '<div class="itemline"><span>Cascos pendentes neste movimento</span><strong>'+sum(t.valid,o=>o.bottles-o.returned)+'</strong></div></section></div>'+(print?'':closingHistory());
}
function latestClosures(){
  const byDate=new Map();
  for(const row of db.closures) if(!byDate.has(row.date)||byDate.get(row.date).at<=row.at)byDate.set(row.date,row);
  return [...byDate.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
function dailySummary(orders){
  const t=reportTotals(orders);
  return {orders:orders.length,gross:sum(t.valid,orderTotal),received:sum(t.paid,orderTotal),open:sum(t.unpaid,orderTotal),
    cancelled:t.cancelled,bottles:sum(t.valid,o=>o.bottles-o.returned),fees:sum(t.valid,o=>o.fee)};
}
function closingHistory(){
  const history=latestClosures();
  const events=db.closures.filter(entry=>entry.date===reportDate).sort((a,b)=>b.at-a.at);
  return '<section class="panel below"><h2>Histórico de fechamentos</h2>'+
    (history.map(entry=>'<div class="itemline closure-line"><span><strong>'+dayLabel(entry.date)+'</strong><br><small>'+fullDate(entry.at)+'</small></span>'+
      '<span>'+pill(entry.state==='open'?'Reaberto':'Fechado',entry.state==='open'?'orange':'green')+
      (entry.snapshot?'<br><small>'+entry.snapshot.orders+' pedido(s) · '+money(entry.snapshot.received)+' recebido</small>':'')+'</span>'+
      btn('Ver movimento','view-day','','','data-id="'+esc(entry.date)+'"')+'</div>').join('')||'<p class="small">Os fechamentos registrados aparecem aqui.</p>')+
    (events.length?'<details style="margin-top:8px"><summary>Registros de '+dayLabel(reportDate)+'</summary><ol class="timeline">'+
      events.map(entry=>'<li>'+fullDate(entry.at)+' · '+(entry.state==='open'?'Reabertura':'Fechamento')+
      (entry.reason?' · '+esc(entry.reason):'')+(entry.snapshot?' · '+money(entry.snapshot.received)+' recebido':'')+'</li>').join('')+'</ol></details>':'')+'</section>';
}
function closingText(){
  const orders=reportOrders(), financial=dailySummary(orders), totals=reportTotals(orders);
  const km=(db.skipMileage||[]).includes(reportDate)?[]:db.mileage.filter(entry=>entry.date===reportDate);
  return ['DISK CERVEJA MENEZES · FECHAMENTO','(37) 9.9917-**** · Biquinhas, MG',dayLabel(reportDate),'',
    'Pedidos: '+financial.orders+' · Cancelados: '+financial.cancelled,
    'Vendas registradas: '+money(financial.gross),'Recebido: '+money(financial.received),'A receber: '+money(financial.open),
    'Taxas de entrega: '+money(financial.fees),'Cascos pendentes: '+financial.bottles,'',
    ...payments.map(method=>method+': '+money(sum(totals.paid.filter(o=>o.payment===method),orderTotal))+' recebido · '+
      money(sum(totals.unpaid.filter(o=>o.payment===method),orderTotal))+' a receber'),
    ...km.map(row=>row.vehicle+': '+Number((row.end-row.start).toFixed(2))+' km')].join('\n');
}
const periodChoices=[['week','Semanal'],['fortnight','Quinzenal'],['month','Mensal'],['bimester','Bimestral'],['year','Anual']];
function reportRanges(){
  const last=new Date(dateKey()+'T00:00:00Z');
  const y=last.getUTCFullYear(), m=last.getUTCMonth(), d=last.getUTCDate();
  const format=utc=>new Date(utc).toISOString().slice(0,10);
  const shift=days=>format(Date.UTC(y,m,d+days));
  if(analyticsPeriod==='month')return [format(Date.UTC(y,m-1,1)),format(Date.UTC(y,m,1)),shift(1)];
  if(analyticsPeriod==='year')return [format(Date.UTC(y-1,0,1)),format(Date.UTC(y,0,1)),shift(1)];
  const size={week:7,fortnight:15,bimester:60}[analyticsPeriod];
  return [shift(1-2*size),shift(1-size),shift(1)];
}
const billingMethods=[
  {name:'Cartão de crédito',short:'Crédito',tone:'credit'},
  {name:'Cartão de débito',short:'Débito',tone:'debit'},
  {name:'Dinheiro',short:'Dinheiro',tone:'cash'},
  {name:'Pix',short:'Pix',tone:'pix'},
  {name:'Fiado',short:'Fiado',tone:'fiado'}
];
const signedPercent=new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1,signDisplay:'exceptZero'});
function periodVariation(current,previous){
  if(!previous) return current?'Sem base anterior':'0%';
  return signedPercent.format((current-previous)/previous);
}
function billingMetric(title,current,previous,tone,parts=[]){
  const trend=current===previous||!previous?'':current>previous?'green':'red';
  return '<article class="metric billing-card '+tone+'"><h2>'+esc(title)+'</h2><div class="billing-main"><strong>'+
    money(current)+'</strong>'+pill(periodVariation(current,previous),trend)+'</div><small>Anterior '+money(previous)+'</small>'+
    (parts.length?'<div class="billing-parts">'+parts.map(part=>'<span class="'+part.tone+'">'+esc(part.short)+' <b>'+money(part.current)+'</b></span>').join('')+'</div>':'')+'</article>';
}
function chartLegend(tone){
  return '<div class="billing-legend"><span><i class="previous-bar"></i>Período anterior</span>'+
    '<span><i class="'+tone+'"></i>Período atual</span></div>';
}
function chartBar({name,period,value,tone,dimension,ratio}){
  const box=' class="chart-bar '+tone+'" style="'+dimension+':'+100*ratio+'%"';
  if(!ratio)return '<span'+box+' aria-hidden="true"></span>';
  return '<button type="button"'+box+' data-chart-name="'+esc(name)+'" data-chart-period="'+esc(period)+
    '" data-chart-value="'+esc(value)+'" aria-label="'+esc([name,period,value].join(' · '))+'"></button>';
}
function paymentComparison(stats){
  const peak=Math.max(0,...stats.flatMap(row=>[row.current,row.previous]));
  const rough=peak/4;
  const magnitude=rough?10**Math.floor(Math.log10(rough)):100;
  const step=([1,2,5,10].find(unit=>unit*magnitude>=rough)||10)*magnitude;
  const max=step*4;
  const ticks=[4,3,2,1,0].map(n=>'<span>'+formatChartMoney(n*step)+'</span>').join('');
  const chart='<div class="billing-legend">'+
    '<span><i class="previous-bar"></i>Período anterior</span><span><i class="multi-bar"></i>Período atual</span></div>'+
    '<div class="payment-chart"><div class="payment-axis" aria-hidden="true">'+ticks+'</div><div class="payment-bars">'+
    stats.map(row=>'<div class="payment-category"><div class="payment-columns">'+
      chartBar({name:row.name,period:'Período anterior',value:money(row.previous),tone:'previous-bar',dimension:'height',ratio:row.previous/max})+
      chartBar({name:row.name,period:'Período atual',value:money(row.current),tone:row.tone,dimension:'height',ratio:row.current/max})+
      '</div><span>'+esc(row.short)+'</span></div>').join('')+'</div></div>';
  const values='<dl class="payment-values">'+stats.map(row=>'<div class="'+row.tone+'"><dt><i aria-hidden="true"></i>'+esc(row.short)+
    '</dt><dd><strong>'+money(row.current)+'</strong><small>Anterior '+money(row.previous)+'</small></dd></div>').join('')+'</dl>';
  return '<section class="panel billing-panel"><h2>Faturamento por forma de pagamento</h2>'+
    (peak?chart:'<p class="empty">Sem vendas nos períodos comparados.</p>')+values+'</section>';
}
const chartMoney=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
function formatChartMoney(value){
  return value&&value<100?money(value):chartMoney.format(value/100);
}
function productComparison(products){
  const shown=products.slice(0,6);
  const largest=Math.max(1,...shown.flatMap(([,row])=>[row.current,row.prev]));
  return '<section class="panel billing-panel"><h2>Consumo por produto</h2>'+
    (shown.length?chartLegend('product-bar')+'<div class="product-chart">'+shown.map(([name,row])=>
      '<div class="product-chart-row"><h3>'+esc(name)+'</h3><div class="product-chart-bars">'+
      chartBar({name,period:'Período anterior',value:row.prev+' un.',tone:'previous-bar',dimension:'width',ratio:row.prev/largest})+
      chartBar({name,period:'Período atual',value:row.current+' un.',tone:'product-bar',dimension:'width',ratio:row.current/largest})+'</div>'+
      '<p><strong>'+row.current+' un.</strong> · '+row.prev+' un. no período anterior</p></div>').join('')+'</div>':
      '<p class="empty">Sem produtos nos períodos comparados.</p>')+'</section>';
}
function comparison(print=false){
  const [prevStart,currentStart,end]=reportRanges();
  const rows=db.orders.filter(o=>o.status!=='cancelled');
  const split=(start,limit)=>rows.filter(o=>dateKey(o.at)>=start&&dateKey(o.at)<limit);
  const current=split(currentStart,end), prev=split(prevStart,currentStart);
  const stats=billingMethods.map(method=>({...method,current:sum(current.filter(o=>o.payment===method.name),orderTotal),
    previous:sum(prev.filter(o=>o.payment===method.name),orderTotal)}));
  const productStats=new Map();
  for(const [key,orders] of [['current',current],['prev',prev]])for(const order of orders)for(const item of order.items){
    const p=productStats.get(item.name)||{current:0,prev:0,gross:0};
    p[key]+=item.qty;
    if(key==='current')p.gross+=item.qty*item.price;
    productStats.set(item.name,p);
  }
  const products=[...productStats].sort((a,b)=>b[1].current-a[1].current||a[0].localeCompare(b[0],'pt-BR'));
  const [credit,debit,cash,pix,fiado]=stats;
  const group=(label,tone,parts)=>billingMetric(label,sum(parts,row=>row.current),sum(parts,row=>row.previous),tone,parts);
  const periodText='Atual '+dayLabel(currentStart)+' a '+dayLabel(dateKey())+' · Anterior '+dayLabel(prevStart)+' a '+dayLabel(new Date(Date.parse(currentStart+'T00:00:00Z')-86400000).toISOString().slice(0,10));
  return '<div class="billing-report">'+(print?'<h1>Disk Cerveja Menezes · Gráficos e comparativos</h1>':
    pageTitle('Gráficos e comparativos',true)+
    '<div class="toolbar compact-controls"><label class="field">Período<select id="analytics-period">'+options(periodChoices,analyticsPeriod)+'</select></label>'+
    btn('Imprimir / PDF','analytics-print','print')+'</div>')+
    '<p class="small" style="margin-top:9px">'+periodText+'</p>'+
    '<div class="metrics billing-metrics">'+billingMetric('Faturamento no período',sum(current,orderTotal),sum(prev,orderTotal),'')+
    group('Cartão (crédito + débito)','credit',[credit,debit])+group('Dinheiro + Pix','cash',[cash,pix])+
    billingMetric('Vendas no fiado',fiado.current,fiado.previous,'fiado')+'</div>'+
    '<div class="billing-grid">'+paymentComparison(stats)+productComparison(products)+'</div>'+
    '<section class="panel below comparison-table"><h2>Variação por produto</h2>'+
    (products.length?'<table><thead><tr><th>Produto</th><th>Anterior</th><th>Atual</th><th>Variação</th><th>Vendas atuais</th></tr></thead><tbody>'+
      products.map(([name,p])=>'<tr><th scope="row">'+esc(name)+'</th><td>'+p.prev+'</td><td>'+p.current+'</td><td>'+periodVariation(p.current,p.prev)+'</td><td>'+money(p.gross)+'</td></tr>').join('')+
      '</tbody></table>':'<p class="small">Sem vendas nos períodos comparados.</p>')+'</section></div>';
}
const deliveryFeeDefault = () => db.fees.entrega ?? db.fees.urbano ?? 0;
// Cada ambiente tem sua própria base e pode ser exportado como backup.
function settings(){
  return pageTitle('Configurações',true)+
    '<div class="settings-grid"><section class="panel"><h2>Ambiente</h2><p class="mute">'+(environment==='demo'?
    'Você está testando com pedidos fictícios. A operação real começa com uma base separada.':'Você está na operação real. Os dados podem ser exportados em backup.')+'</p>'+
    btn(environment==='demo'?'Abrir operação real':'Abrir demonstração','environment','','primary')+'</section>'+
    '<section class="panel"><h2>Entregadores</h2><p class="mute">Use nomes ou identificações como Moto 1.</p>'+
    (db.drivers.map(name=>'<div class="itemline"><span>'+esc(name)+'</span>'+btn('Remover','driver-remove','','danger','data-id="'+esc(name)+'"')+'</div>').join(''))+btn('Adicionar entregador','driver-add','plus')+'</section>'+
    '<section class="panel"><h2>Taxas sugeridas</h2><p class="mute">A taxa pode ser ajustada em cada pedido.</p><form data-form="fees" class="formgrid">'+
    field('Taxa padrão de entrega (R$)','entrega',deliveryFeeDefault()/100,'number','min="0" step="0.01" required')+
    '<div class="span2"><button class="btn primary">Salvar taxas</button></div></form></section>'+
    '<section class="panel"><h2>Backup</h2><p class="mute">Exporte uma cópia dos pedidos, produtos, taxas e fechamentos. A restauração substitui os dados do ambiente atual.</p><div class="actions">'+
    btn('Baixar backup','backup','download')+btn('Restaurar backup','restore')+(db.products.length? '':btn('Carregar catálogo de exemplo','sample-catalog'))+'</div></section></div>';
}
function allowed(key){
  if(mode==='driver') return key==='delivery';
  if(mode==='attendant') return ['board','delivery','history','stock'].includes(key);
  return true;
}
function updateStorageLabel(){
  $('local-caption').innerHTML=icon('disk')+'<span>'+(hosted?(serverReady?'Dados salvos no site':'Conexão com os dados'):'Dados neste navegador')+'</span>';
}
// No celular, a navegação principal respeita as páginas disponíveis no modo atual.
function renderMobileNavigation(){
  const links=sections.filter(([key])=>['board','delivery','history','reports'].includes(key)&&allowed(key));
  const nav=$('mobile-nav');
  nav.hidden=links.length<2;
  const active=nav.contains(document.activeElement)?document.activeElement.dataset.id:null;
  nav.innerHTML=links.map(([key,label,glyph])=>
    '<button type="button" class="nav" data-act="navigate" data-id="'+key+'" '+(page===key?'aria-current="page"':'')+'>'+
    icon(glyph)+'<span>'+esc(label)+'</span></button>').join('');
  if(active)nav.querySelector('[data-id="'+active+'"]')?.focus({preventScroll:true});
  document.body.classList.toggle('has-mobile-nav',!nav.hidden);
}

// Reúno troca de modo e atalhos menos usados na engrenagem.
function showMobileMenu(){
  const links=sections.filter(([key])=>['stock','analytics','settings'].includes(key)&&allowed(key));
  $('mobile-menu-modes').innerHTML=modes.map(([id,name])=>
    btn(name,'mobile-mode','',mode===id?'primary':'','data-id="'+id+'" aria-pressed="'+(mode===id)+'"')).join('');
  $('mobile-menu-links').innerHTML=links.length?'<h3>Acessos</h3>'+links.map(([key,label,glyph])=>
    btn(label,'mobile-link',glyph,'','data-id="'+key+'"')).join(''):'';
  $('mobile-menu').showModal();
}

function renderNav(){
  const activeNav=document.activeElement?.closest('#nav .nav')?.dataset.id;
  $('nav').innerHTML=sections.filter(([key])=>allowed(key)).map(([key,label,glyph])=>
    '<button type="button" class="nav" data-act="navigate" data-id="'+key+'" '+(page===key?'aria-current="page"':'')+'>'+icon(glyph)+esc(label)+'</button>').join('');
  if(activeNav) $('nav').querySelector('[data-id="'+activeNav+'"]')?.focus({preventScroll:true});
  renderMobileNavigation();
  updateStorageLabel();
  $('quick-new').hidden=mode==='driver';
  $('quick-new').innerHTML=icon('plus')+'<span>Novo pedido</span>';
  for(const button of $('modes').children) button.setAttribute('aria-pressed',String(button.dataset.id===mode));
}
// Na busca, redesenho a lista sem tirar o foco do campo.
function render(keepSearch=false){
  hideChartTooltip();
  const focused=keepSearch && document.activeElement?.id==='search';
  const selected=focused?[document.activeElement.selectionStart,document.activeElement.selectionEnd]:[];
  renderNav();
  updateHeaderDate();
  const views={board,delivery,history,stock,reports,analytics:comparison,settings};
  $('main').innerHTML=views[page]();
  document.body.classList.toggle('has-mobile-board',page==='board');
  if(focused){
    $('search')?.focus();
    $('search')?.setSelectionRange(...selected);
  }
}
function navigate(key){
  if(!allowed(key)) return;
  page=key;
  query='';
  filter='all';
  historyDate='';
  render();
  $('main').focus();
  window.scrollTo(0,0);
}
function changeMode(next){
  mode=next;
  page=next==='driver'?'delivery':'board';
  query=''; filter='all';
  render();
  window.scrollTo(0,0);
}
function applyTheme(){
  document.documentElement.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]').content=getComputedStyle(document.body).backgroundColor;
  const label=theme==='light'?'Ativar tema escuro':'Ativar tema claro';
  $('theme').innerHTML=icon(theme==='light'?'moon':'sun');
  $('theme').setAttribute('aria-label',label);
  $('theme').title=label;
}
const getOrder = id => db.orders.find(o=>o.id===id);
const getProduct = id => db.products.find(p=>p.id===id);
const field = (label,name,value='',type='text',attrs='',classes='') => '<label class="field '+classes+'">'+esc(label)+
  '<input name="'+name+'" type="'+type+'" value="'+esc(value)+'" '+attrs+'></label>';
const select = (label,name,entries,value='',attrs='',classes='') => '<label class="field '+classes+'">'+esc(label)+
  '<select name="'+name+'" '+attrs+'>'+options(entries,value)+'</select></label>';
const notesField = (label,name,value='',attrs='',classes='') => '<label class="field '+classes+'">'+esc(label)+
  '<textarea name="'+name+'" rows="2" '+attrs+'>'+esc(value)+'</textarea></label>';
const check = (label,name,value) => '<label class="check field"><input type="checkbox" name="'+name+'" '+(value?'checked':'')+'>'+esc(label)+'</label>';
const formButton = label => '<button class="btn primary" type="submit">'+esc(label)+'</button>';
const dialogError = () => '<p class="error" id="dialog-error" role="alert" hidden></p>';
function openModal(title,subtitle,content,footer='',form='',wide=false){
  const d=$('modal');
  d.classList.toggle('wide',wide);
  d.classList.toggle('order-editor',form==='order');
  d.innerHTML=(form?'<form data-form="'+form+'">':'')+'<header class="dialog-head"><div><h2 id="modal-title">'+esc(title)+'</h2>'+
    (subtitle?'<p class="small">'+esc(subtitle)+'</p>':'')+'</div>'+btn('','dismiss','close','icononly','aria-label="Fechar"')+'</header>'+
    '<div class="dialog-body">'+content+dialogError()+'</div>'+(footer?'<footer class="dialog-foot">'+footer+'</footer>':'')+(form?'</form>':'');
  if(!d.open) d.showModal();
  else d.querySelector('input:not([type=hidden]), select, button')?.focus();
}
function finish(message){
  $('modal').close();
  edit=null;
  dialogState=null;
  render();
  toast(message);
}
function showError(message){
  const error=$('dialog-error');
  if(error&&$('modal').open){
    error.textContent=message;
    error.hidden=false;
    error.scrollIntoView({block:'nearest'});
  }else toast(message);
}
function inputTime(value){
  if(!value) return '';
  return dateKey(value)+'T'+new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(value));
}
function editOrder(order=null){
  const source=order||{kind:'entrega',channel:'Telefone',payment:'Pix',items:[],fee:deliveryFeeDefault()};
  const kind=source.kind==='retirada'?'retirada':'entrega';
  const deliveryFee=(kind==='retirada'?deliveryFeeDefault():source.fee)/100;
  edit={id:order?.id,cart:structuredClone(source.items),original:structuredClone(source.items),deliveryFee,step:1};
  const kinds='<fieldset class="kind-pick span2"><legend>Tipo de pedido</legend><div class="choices">'+
    [['entrega','Entrega'],['retirada','Retirada']].map(([value,label])=>
      '<label><input type="radio" name="kind" value="'+value+'" '+(kind===value?'checked':'')+'><span>'+label+'</span></label>').join('')+'</div></fieldset>';
  const destination='<div class="span2" id="destination-fields">'+
    field('Local da entrega','address',source.address,'text','maxlength="180" placeholder="Rua e número ou nome do sítio"')+'</div>';
  const optional='<details><summary>Dados opcionais</summary><div class="formgrid">'+
    field('Telefone para contato','phone',source.phone,'tel','maxlength="24"')+
    field('Ponto de referência','reference',source.reference,'text','maxlength="280" placeholder="Ex.: portão azul, depois da ponte" data-delivery-extra','span2')+
    field('Entregar até','due',inputTime(source.due),'datetime-local','data-delivery-extra')+
    field('Cascos a recolher','bottles',source.bottles||0,'number','min="'+(source.returned||0)+'" max="10000" step="1" required')+
    notesField('Observações','notes',source.notes,'maxlength="350"','span2')+'</div></details>';
  const identification='<section class="editor-section" id="order-identification" tabindex="-1" aria-label="Identificação"><div class="formgrid">'+
    kinds+field('Nome ou identificação','name',source.name,'text','maxlength="90" placeholder="Nome do cliente" autocomplete="off"','span2')+
    destination+select('Canal','channel',orderChannels,channelName(source.channel),'','span2')+
    '</div>'+optional+'</section>';
  const items='<div id="order-items-step" hidden><div class="editor-grid"><section id="cart-section" class="editor-section order-cart"><div class="row spread">'+
    '<h3 tabindex="-1" id="order-cart-title">Itens do pedido</h3><span id="order-cart-count" class="count" aria-live="polite">0</span></div>'+
    '<div id="cart"></div></section><section class="editor-section order-catalog"><div class="row spread"><h3>Produtos</h3>'+
    btn('Ver itens','order-view-cart','','order-jump')+'</div><label class="search" style="display:block">'+icon('search')+
    '<input id="product-search" type="search" aria-label="Buscar produto" placeholder="Buscar produto" style="width:100%"></label>'+
    '<div id="product-picker" class="product-scroll" aria-label="Produtos disponíveis"></div><details><summary>Item avulso</summary><div class="formgrid" style="margin-top:6px">'+
    field('Nome do item','manual-name','','text','maxlength="120"','span2')+
    field('Unitário (R$)','manual-price','','text','inputmode="decimal" maxlength="14"')+
    field('Quantidade','manual-qty','1','text','inputmode="numeric" maxlength="4"')+
    '<div class="span2">'+btn('Adicionar avulso','manual','plus')+'</div></div></details></section></div></div>';
  const paymentStatus='<fieldset class="payment-status"><legend>Situação do pagamento</legend><div class="choices">'+
    [['pending','A receber','clock'],['paid','Recebido','check']].map(([value,label,glyph])=>
      '<label><input type="radio" name="payment-status" value="'+value+'" '+((source.paid?'paid':'pending')===value?'checked':'')+'><span>'+
      icon(glyph)+label+'</span></label>').join('')+'</div></fieldset>';
  const next='<div id="order-next-actions" class="row spread">'+btn('Cancelar','dismiss')+
    '<button type="submit" class="btn primary" id="order-next" formnovalidate>Avançar para itens</button></div>';
  const checkout='<div id="order-checkout" hidden><div class="checkout-fields">'+select('Pagamento','payment',payments,source.payment)+
    '<label class="field" id="change-input" hidden>Troco para (R$)<input name="cash" type="number" min="0" step="0.01"'+
    ' value="'+(source.cash?source.cash/100:'')+'" placeholder="Opcional"></label>'+paymentStatus+'</div>'+
    '<div class="checkout-actions"><div class="checkout-summary">'+
    field('Taxa de entrega (R$)','fee',deliveryFee,'number','min="0" step="0.01" data-delivery-extra')+
    '<div id="order-totals" class="totals" aria-live="polite"></div></div>'+
    '<div class="actions">'+btn('Voltar','order-back')+'<button class="btn primary" type="submit" id="order-save" disabled>'+
    (order?'Salvar alterações':'Registrar pedido')+'</button></div></div></div>';
  openModal(order?'Editar pedido '+code(order):'Novo pedido','Etapa 1 de 2 · Identificação',identification+items,next+checkout,'order');
  const modal=$('modal');
  modal.dataset.orderStep='1';
  modal.querySelector('.dialog-head').firstElementChild.insertAdjacentHTML('afterend',
    '<div class="order-customer-summary" id="order-customer-summary" hidden>'+
    '<strong id="order-customer-name"></strong><small id="order-customer-details"></small></div>');
  syncOrderFields();
  renderEditor();
  $('order-identification').focus();
}
// O cadastro do pedido separa identificação e conferência dos itens.
function showOrderStep(step){
  const first=step===1;
  const modal=$('modal');
  const {elements}=modal.querySelector('form');
  edit.step=step;
  modal.dataset.orderStep=String(step);
  $('order-identification').hidden=!first;
  $('order-next-actions').hidden=!first;
  $('order-next').disabled=!first;
  $('order-items-step').hidden=first;
  $('order-checkout').hidden=first;
  $('order-save').disabled=first;
  $('dialog-error').hidden=true;
  modal.querySelector('.dialog-head p').textContent=first?'Etapa 1 de 2 · Identificação':'Etapa 2 de 2 · Itens e pagamento';
  if(!first){
    const destination=elements.kind.value==='retirada'?'Retirada':elements.address.value.trim();
    const name=elements.name.value.trim();
    const summary=$('order-customer-summary');
    $('order-customer-name').textContent=name||destination||'Pedido';
    $('order-customer-details').textContent=[name?destination:'',elements.channel.value].filter(Boolean).join(' · ');
    summary.title=[name,destination,elements.channel.value].filter(Boolean).join(' · ');
  }
  $('order-customer-summary').hidden=first;
  modal.scrollTop=0;
  modal.querySelector('.dialog-body').scrollTop=0;
  (first?$('order-identification'):$('order-cart-title')).focus({preventScroll:true});
}
function advanceOrderStep(form){
  const address=form.elements.address;
  address.setCustomValidity(!address.disabled&&!address.value.trim()?'Informe o local da entrega.':'');
  for(const field of $('order-identification').querySelectorAll('input, select, textarea')){
    if(!field.reportValidity())return;
  }
  showOrderStep(2);
}
function available(product){
  return product.stock+sum(edit.original.filter(i=>i.productId===product.id),i=>i.qty);
}
function renderPicker(){
  const term=norm($('product-search').value);
  const products=db.products.filter(p=>p.active&&norm(p.name+' '+p.category).includes(term)).sort(compareProductNames);
  $('product-picker').innerHTML=products.map(p=>{
    const remaining=available(p)-sum(edit.cart.filter(i=>i.productId===p.id),i=>i.qty||0);
    return '<div class="itemline"><button type="button" class="btn pick-product" data-act="add-item" data-id="'+esc(p.id)+'" aria-label="Adicionar '+esc(p.name)+'" '+(remaining<=0?'disabled':'')+'>'+
      '<span><strong>'+esc(p.name)+'</strong><small>'+remaining+' em estoque'+(p.bottle?' · Retornável':'')+'</small></span><strong>'+money(p.price)+'</strong>'+icon('plus')+'</button></div>';
  }).join('')||'<p class="small">Nenhum produto encontrado. Você pode lançar um item avulso.</p>';
}
function updateCartCount(){
  $('order-cart-count').textContent=sum(edit.cart,item=>Number.isInteger(item.qty)?item.qty:0)+' un.';
}
function renderCart(){
  updateCartCount();
  $('cart').innerHTML=edit.cart.map((item,index)=>'<div class="itemline cart-item"><span><strong>'+esc(item.name)+'</strong><br><small>'+money(item.price)+
    ' por un.</small></span><input class="qty" type="number" min="1" max="9999" required aria-label="Quantidade de '+esc(item.name)+
    '" data-qty="'+index+'" value="'+item.qty+'">'+btn('','remove-item','close','icononly','data-id="'+index+'" aria-label="Remover '+esc(item.name)+'"')+'</div>').join('')||
    '<p class="empty">Os produtos que você adicionar aparecem aqui.</p>';
}
function updateTotals(){
  const form=$('modal').querySelector('form');
  const subtotal=sum(edit.cart,item=>Number.isInteger(item.qty)&&item.qty>0?item.qty*item.price:0);
  const fee=form.elements.kind.value==='retirada'?0:cents(form.elements.fee.value)||0;
  const cash=form.elements.payment.value==='Dinheiro'?(cents(form.elements.cash.value)||0):0;
  const change=cash>=subtotal+fee&&cash?' · Troco '+money(cash-subtotal-fee):'';
  $('order-totals').innerHTML='<div class="current-total"><small>Total do pedido'+change+
    '</small><strong>'+money(subtotal+fee)+'</strong></div>';
}
function renderEditor(){
  renderPicker();
  renderCart();
  updateTotals();
}
function syncOrderFields(){
  const {elements:e}=$('modal').querySelector('form');
  const pickup=e.kind.value==='retirada';
  $('destination-fields').hidden=pickup;
  for(const name of ['address','reference','fee','due']) e[name].disabled=pickup;
  for(const extra of e.address.form.querySelectorAll('[data-delivery-extra]')) extra.closest('label').hidden=pickup;
  e.address.required=!pickup;
  e.cash.disabled=e.payment.value!=='Dinheiro';
  e.cash.closest('label').hidden=e.cash.disabled;
}
function addItem(id){
  const product=getProduct(id);
  const same=edit.cart.find(i=>i.productId===id&&i.price===product.price);
  if(available(product)<=sum(edit.cart.filter(i=>i.productId===id),i=>i.qty)) throw Error('Estoque insuficiente para este produto.');
  if(same) same.qty++;
  else edit.cart.push(makeItem(product,1));
  renderEditor();
  const target=[...$('product-picker').querySelectorAll('button')].find(button=>button.dataset.id===id&&!button.disabled);
  if(document.activeElement!==$('product-search')) (target||$('product-search')).focus();
}
function addManual(){
  const {elements:e}=$('modal').querySelector('form');
  const name=e['manual-name'].value.trim(), value=e['manual-price'].value.trim(), price=cents(value), qty=Number(e['manual-qty'].value);
  if(!name||!/^\d+(?:[,.]\d{1,2})?$/.test(value)||!Number.isSafeInteger(price)||!Number.isInteger(qty)||qty<1||qty>9999){
    throw Error('Preencha o nome, o valor unitário e uma quantidade válida do item avulso.');
  }
  edit.cart.push({productId:null,name,price,qty,bottle:false});
  e['manual-name'].value='';e['manual-price'].value='';e['manual-qty'].value='1';
  renderEditor();
  e['manual-name'].focus();
}
const cleanLink = value => {
  if(!value) return '';
  try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return ''}
};
function adjustInventory(data,before,after){
  const ids=new Set([...before,...after].map(i=>i.productId).filter(Boolean));
  for(const id of ids){
    const product=data.products.find(p=>p.id===id);
    const oldQty=sum(before.filter(i=>i.productId===id),i=>i.qty);
    const newQty=sum(after.filter(i=>i.productId===id),i=>i.qty);
    if(oldQty===newQty) continue;
    if(!product || (newQty>oldQty&&(!product.active||product.stock+oldQty<newQty))){
      throw Error('Estoque insuficiente ou produto indisponível: '+(product?.name||'produto do catálogo')+'.');
    }
    product.stock+=oldQty-newQty;
  }
}
async function saveOrder(form){
  const values=Object.fromEntries(new FormData(form));
  const pickup=values.kind==='retirada';
  const items=structuredClone(edit.cart);
  if(!items.length||items.some(i=>!Number.isInteger(i.qty)||i.qty<1||i.qty>9999)) throw Error('Adicione itens com quantidades válidas.');
  if(!pickup&&!values.address?.trim()) throw Error('Informe o endereço ou nome do local da entrega.');
  const fee=pickup?0:cents(values.fee)||0;
  const cash=values.payment==='Dinheiro'?cents(values.cash)||0:0;
  if(!Number.isSafeInteger(fee)||!Number.isSafeInteger(cash)) throw Error('Confira os valores da taxa e do troco.');
  const total=sum(items,i=>i.qty*i.price)+fee;
  if(!Number.isSafeInteger(total)) throw Error('Confira o total do pedido.');
  if(cash&&cash<total) throw Error('O valor do troco para precisa ser igual ou maior que o total.');
  const previous=edit.id?getOrder(edit.id):null;
  if(!previous&&latestClosures().some(c=>c.date===dateKey()&&c.state!=='open')) {
    throw Error('O dia está fechado. Use Fechamento e escolha Reabrir dia.');
  }
  if(edit.id&&!canEditOrder(previous)) throw Error('Este pedido não pode mais ser editado.');
  const due=values.due?new Date(values.due+'-03:00').toISOString():'';
  const order={id:previous?.id||uid(),at:previous?.at||Date.now(),number:previous?.number||db.next,
    status:previous?.status||'new',driver:pickup?'':previous?.driver||'',items,fee,cash,due,
    returned:previous?.returned||0,bottles:Number(values.bottles),name:values.name.trim(),kind:values.kind,
    address:pickup?'':values.address.trim(),reference:values.reference?.trim()||'',map:pickup?'':previous?.map||'',
    notes:values.notes.trim(),phone:values.phone.trim(),channel:values.channel,payment:values.payment,
    paid:values['payment-status']==='paid',trail:[...previous?.trail||[]]};
  const paidNote=previous&&previous.paid!==order.paid?(order.paid?' · Pagamento recebido':' · Recebimento desmarcado'):'';
  order.trail.push({at:Date.now(),label:previous?'Pedido atualizado'+paidNote:'Pedido registrado'+(order.paid?' · Pagamento recebido':'')});
  await mutate(data=>{
    adjustInventory(data,previous?.items||[],items);
    if(previous) data.orders[data.orders.findIndex(o=>o.id===previous.id)]=order;
    else {data.next++;data.orders.push(order);}
  });
  finish('Pedido '+code(order)+(previous?' atualizado.':' registrado.'));
}
function detail(o){
  const destinationLink=o.kind==='retirada'?'':cleanLink(o.map)||('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(o.address+' Biquinhas MG'));
  const digits=o.phone.replace(/\D/g,'');
  const tel=digits.length>=10?'<a class="btn" href="tel:+'+(digits.length<=11?'55':'')+digits+'">'+icon('phone')+'Ligar</a>':'';
  const content='<div class="row">'+statusBadge(o.status)+pill(channelName(o.channel))+
    pill(o.paid?'Pagamento recebido':'A receber',o.paid?'green':'orange')+(o.driver?pill(o.driver,'blue'):'')+'</div>'+
    '<div class="report-grid" style="margin-top:12px"><section class="panel"><h3>Destino</h3><p class="textbreak"><strong>'+esc(destination(o))+'</strong></p>'+
    (o.reference?'<p class="textbreak">'+esc(o.reference)+'</p>':'')+(o.phone?'<p class="small">'+esc(o.phone)+'</p>':'')+
    (o.due?'<p class="small">Entregar até '+fullDate(o.due)+'</p>':'')+
    '<div class="actions" style="margin-top:8px">'+(destinationLink?'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(destinationLink)+'">'+icon('pin')+'Abrir mapa</a>':'')+tel+'</div></section>'+
    '<section class="panel"><h3>Pagamento</h3><p>'+esc(o.payment)+(o.cash?' · Troco '+money(o.cash-orderTotal(o)):'')+'</p>'+
    '<p class="small">Entrega '+money(o.fee)+'</p><p><strong>'+money(orderTotal(o))+'</strong></p>'+
    (o.status!=='cancelled'&&!o.paid?btn('Marcar recebido','paid','check','soft','data-id="'+esc(o.id)+'"'):'')+
    '</section><section class="panel"><h3>Itens</h3>'+o.items.map(i=>'<div class="itemline"><span>'+i.qty+' × '+esc(i.name)+'</span><strong>'+money(i.qty*i.price)+'</strong></div>').join('')+
    (o.notes?'<p class="small textbreak">'+esc(o.notes)+'</p>':'')+'</section>'+
    '<section class="panel"><h3>Cascos retornáveis</h3><p>'+o.returned+' de '+o.bottles+' recolhido(s)</p>'+
    (o.status!=='cancelled'&&o.bottles>o.returned?btn('Registrar devolução','bottles','bottle','soft','data-id="'+esc(o.id)+'"'):'')+'</section></div>'+
    '<h3 style="margin-top:13px">Movimentações</h3><ol class="timeline">'+o.trail.map(entry=>'<li>'+fullDate(entry.at)+' · '+esc(entry.label)+'</li>').join('')+'</ol>';
  const cancel=!isDone(o)&&mode!=='driver'?btn('Cancelar pedido','cancel','','danger','data-id="'+esc(o.id)+'"'):'';
  const fail=o.status==='route'?btn('Voltar para expedição','fail','','','data-id="'+esc(o.id)+'"'):'';
  openModal(code(o)+' · '+(o.name||kindLabels[o.kind]),fullDate(o.at),content,
    '<div class="actions">'+btn('Copiar resumo','copy','copy','','data-id="'+esc(o.id)+'"')+
    (o.kind!=='retirada'?'<a class="btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text='+esc(encodeURIComponent(orderText(o)))+'">'+icon('chat')+'WhatsApp</a>':'')+btn('Imprimir','print','print','','data-id="'+esc(o.id)+'"') +editButton(o)+fail+cancel+'</div><div class="actions">'+actionButton(o)+'</div>');
}
function log(order,label){order.trail.push({at:Date.now(),label})}
async function orderMutation(id,change){
  await mutate(data=>{
    const order=data.orders.find(o=>o.id===id);
    if(!order) throw Error('Pedido não encontrado.');
    change(order,data);
  });
}
function trackedForm(title,description,content,form,id,submit='Confirmar'){
  dialogState={id};
  openModal(title,description,content,btn('Voltar','back-detail','','','data-id="'+esc(id)+'"')+formButton(submit),form);
}
async function advance(o){
  const transition=actionFor(o);
  if(!transition) return;
  const [name,to]=transition;
  if(to==='route'){
    trackedForm('Despachar '+code(o),'Identifique quem fará a entrega.',
      '<label class="field">Entregador ou veículo<input name="driver" required maxlength="40" list="drivers" value="'+esc(o.driver)+'" placeholder="Ex.: Moto 1"></label>'+
      '<datalist id="drivers">'+options(db.drivers)+'</datalist>'+
      '<p class="small" style="margin-top:8px">'+esc(destination(o))+'</p>','dispatch',o.id,'Confirmar saída');
  }else if(to==='completed'){
    trackedForm(name+' '+code(o),destination(o),'<div class="formgrid">'+
      (o.paid?'<p class="span2">Pagamento já recebido.</p>':check('Recebi '+money(orderTotal(o))+' ('+o.payment+')','paid',false))+
      (o.bottles>o.returned?field('Cascos recolhidos agora','bottles','0','number','min="0" max="'+(o.bottles-o.returned)+'" step="1" required'):'')+
      '</div>','complete',o.id,name);
  }else{
    await orderMutation(o.id,order=>{order.status=to;log(order,labels[to]);});
    if($('modal').open) $('modal').close();
    render();
    toast(code(o)+' · '+labels[to]+'.');
  }
}
async function doTracked(formName,values){
  const {id}=dialogState;
  await orderMutation(id,(o,data)=>{
    switch(formName){
      case 'dispatch': {
        if(o.status!=='ready'||o.kind==='retirada') throw Error('O pedido precisa estar pronto para entrega.');
        const input=values.driver.trim();
        if(!input) throw Error('Informe um entregador.');
        const driver=data.drivers.find(name=>norm(name)===norm(input))||input;
        if(!data.drivers.includes(driver)) data.drivers.push(driver);
        o.driver=driver; o.status='route'; log(o,'Saiu para entrega com '+driver);
        break;
      }
      case 'complete': {
        if(!(o.status==='route'||(o.status==='ready'&&o.kind==='retirada'))) throw Error('O pedido ainda não está pronto para concluir.');
        const previousPaid=o.paid;
        const recovered=Number(values.bottles||0);
        if(recovered>o.bottles-o.returned) throw Error('Confira a quantidade de cascos.');
        o.returned+=recovered;
        o.paid ||= values.paid==='on';
        o.status='completed';
        log(o,o.kind==='retirada'?'Retirada confirmada':'Entrega confirmada');
        if(!previousPaid&&o.paid) log(o,'Pagamento recebido');
        if(recovered) log(o,recovered+' casco(s) recolhido(s)');
        break;
      }
      case 'cancel': {
        if(isDone(o)) throw Error('Este pedido já foi finalizado.');
        if(!values.reason.trim()) throw Error('Informe o motivo do cancelamento.');
        adjustInventory(data,o.items,[]);
        o.status='cancelled';
        if(o.paid) log(o,'Estorno confirmado no cancelamento');
        o.paid=false;
        log(o,'Cancelado · '+values.reason.trim());
        break;
      }
      case 'fail':
        if(o.status!=='route'||!values.reason.trim()) throw Error('Informe o que ocorreu na entrega.');
        o.status='ready'; o.driver=''; log(o,'Voltou para expedição · '+values.reason.trim());
        break;
      case 'bottles': {
        const quantity=Number(values.quantity);
        if(o.status==='cancelled'||quantity<1||quantity>o.bottles-o.returned) throw Error('Confira a quantidade de cascos.');
        o.returned+=quantity;log(o,quantity+' casco(s) recolhido(s)');
        break;
      }
    }
  });
  finish('Pedido '+code(getOrder(id))+' atualizado.');
}
function productDialog(id){
  const p=getProduct(id)||{name:'',category:'',price:0,stock:0,min:0,active:true,bottle:false};
  dialogState={id};
  const content='<div class="formgrid">'+field('Nome','name',p.name,'text','required maxlength="120"','span2')+
    field('Categoria','category',p.category,'text','required maxlength="50"')+
    field('Preço unitário (R$)','price',p.price/100,'number','min="0" max="9999999" step="0.01" required')+
    field('Estoque atual','stock',p.stock,'number','min="0" max="1000000" step="1" required')+
    field('Limite de estoque baixo','min',p.min,'number','min="0" max="1000000" step="1" required')+
    check('Embalagem retornável','bottle',p.bottle)+check('Disponível para venda','active',p.active)+'</div>';
  openModal(id?'Editar produto':'Novo produto','',content,btn('Voltar','dismiss')+formButton('Salvar produto'),'product');
}
function driverUsed(data,name){
  return data.orders.some(o=>o.driver===name&&!isDone(o));
}
function download(name, content, type){
  const url=URL.createObjectURL(new Blob([content],{type}));
  const link=document.createElement('a');
  link.href=url;link.download=name;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function csvReport(){
  const orders=page==='reports'?reportOrders():db.orders.filter(o=>match(o)&&(!historyDate||dateKey(o.at)===historyDate)&&
    (filter==='all'||(filter==='bottles'?o.bottles>o.returned&&o.status!=='cancelled':filter==='unpaid'?!o.paid&&o.status!=='cancelled':(filter==='active'?!isDone(o):o.status===filter))));
  const safeCell=value=>{
    let text=String(value??'');
    if(/^[\s]*[=+\-@]/.test(text)||/^[\t\r\n]/.test(text)) text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  };
  const rows=[['Pedido','Data','Canal','Identificação','Destino','Referência','Entrega','Itens','Total','Taxa','Pagamento','Recebido','Entregador','Situação','Cascos pendentes'],
    ...orders.map(o=>[code(o),fullDate(o.at),channelName(o.channel),o.name,destination(o),o.reference,kindLabels[o.kind],
      o.items.map(i=>i.qty+'x '+i.name).join(' | '),money(orderTotal(o)),money(o.fee),o.payment,o.paid?'Sim':'Não',o.driver,
      labels[o.status],o.bottles-o.returned])];
  download('disk-menezes-'+(page==='reports'?reportDate:'historico')+'.csv','\ufeff'+rows.map(row=>row.map(safeCell).join(';')).join('\r\n'),'text/csv;charset=utf-8');
}
function orderText(o){
  return ['Disk Menezes · Pedido '+code(o),o.name?'Identificação: '+o.name:'','Destino: '+destination(o),o.reference?'Referência: '+o.reference:'',
    o.map?'Localização: '+o.map:'',o.phone?'Contato: '+o.phone:'',o.due?'Entregar até: '+fullDate(o.due):'',
    'Itens:',...o.items.map(i=>i.qty+' × '+i.name),'Taxa: '+money(o.fee),'Total: '+money(orderTotal(o)),
    'Pagamento: '+o.payment+' · '+(o.paid?'Recebido':'A receber'),o.cash?'Troco: '+money(o.cash-orderTotal(o)):'',
    o.bottles>o.returned?'Cascos a recolher: '+(o.bottles-o.returned):'',o.notes?'Observações: '+o.notes:''].filter(Boolean).join('\n');
}
async function copyText(value){
  try{
    if(!navigator.clipboard)throw Error();
    await navigator.clipboard.writeText(value);
    toast('Resumo copiado.');
  }catch{
    openModal('Copiar resumo','Selecione o texto para copiar.',notesField('Resumo do pedido','copiar',value,'readonly style="min-height:230px"'),
      btn('Fechar','dismiss'));
    $('modal').querySelector('textarea').select();
  }
}
function printContent(html){
  $('print').innerHTML=html;
  window.print();
  $('print').innerHTML='';
}
// Confiro o formato do arquivo antes de restaurar o ambiente aberto.
function validBackup(raw){
  const records=raw?.data;
  const integer=value=>Number.isSafeInteger(value)&&value>=0;
  const txt=value=>typeof value==='string';
  const bool=value=>typeof value==='boolean';
  const stamp=value=>integer(value)&&value<8640000000000000;
  const date=value=>txt(value)&&/^\d{4}-\d{2}-\d{2}$/.test(value);
  const arr=(value,check)=>Array.isArray(value)&&value.every(check);
  const has=(obj,key)=>Object.hasOwn(obj,key);
  const item=i=>i&&(i.productId===null||txt(i.productId))&&txt(i.name)&&integer(i.price)&&integer(i.qty)&&i.qty>0&&bool(i.bottle);
  const order=o=>o&&txt(o.id)&&integer(o.number)&&stamp(o.at)&&has(labels,o.status)&&has(kindLabels,o.kind)&&payments.includes(o.payment)&&
    ['name','address','reference','map','notes','phone','channel','driver','due'].every(k=>txt(o[k]))&&
    (!o.due||Number.isFinite(Date.parse(o.due)))&&bool(o.paid)&&['fee','cash','bottles','returned'].every(k=>integer(o[k]))&&o.returned<=o.bottles&&
    arr(o.items,item)&&o.items.length>0&&arr(o.trail,t=>t&&stamp(t.at)&&txt(t.label));
  const product=p=>p&&['id','name','category'].every(k=>txt(p[k]))&&['stock','min','price'].every(k=>integer(p[k]))&&bool(p.active)&&bool(p.bottle);
  if(raw?.schema!=='disk-menezes-backup'||records?.version!==2||!integer(records.next)||!arr(records.orders,order)||
    !arr(records.products,product)||!arr(records.drivers,txt)||!arr(records.mileage,m=>m&&date(m.date)&&txt(m.vehicle)&&
      Number.isFinite(m.start)&&Number.isFinite(m.end)&&m.start>=0&&m.end>=m.start)||
    !arr(records.closures,c=>c&&date(c.date)&&stamp(c.at))||!(integer(records.fees?.entrega)||(integer(records.fees?.urbano)&&integer(records.fees?.rural)))){
    throw Error('O arquivo não é um backup válido do Disk Menezes.');
  }
  const ids=new Set(records.products.map(p=>p.id));
  const orderIds=new Set(records.orders.map(o=>o.id));
  const numbers=new Set(records.orders.map(o=>o.number));
  if(ids.size!==records.products.length||orderIds.size!==records.orders.length||numbers.size!==records.orders.length||
      records.orders.some(o=>o.number>=records.next||o.items.some(i=>i.productId!==null&&!ids.has(i.productId)))){
    throw Error('O backup contém códigos duplicados ou referências inconsistentes.');
  }
  return records;
}
function showRestore(records,source){
  if(source==='demo'&&environment==='real') throw Error('Abra a demonstração para restaurar um backup de teste.');
  dialogState={records};
  openModal('Restaurar backup','Substitui os dados do ambiente atual.',
    '<p>O arquivo tem '+records.orders.length+' pedido(s) e '+records.products.length+' produto(s).</p>'+
    '<p style="margin-top:8px">Baixe uma cópia da base atual para poder recuperá-la depois.</p>',
    btn('Voltar','dismiss')+btn('Baixar cópia atual','backup','download')+formButton('Substituir dados'),'restore');
}
async function action(button){
  const {act,id}=button.dataset;
  const o=id?getOrder(id):null;
  switch(act){
    case 'navigate':navigate(id);break;
    case 'mode':changeMode(id);break;
    case 'mobile-menu':showMobileMenu();break;
    case 'mobile-menu-close':$('mobile-menu').close();break;
    case 'mobile-mode':$('mobile-menu').close();changeMode(id);break;
    case 'mobile-link':$('mobile-menu').close();navigate(id);break;
    case 'mobile-stage':
      mobileStage=id;
      $('order-board').dataset.mobileStage=id;
      for(const tab of button.parentElement.querySelectorAll('[data-act="mobile-stage"]')){
        tab.setAttribute('aria-pressed',String(tab===button));
      }
      $('order-board').scrollIntoView({block:'nearest'});
      break;
    case 'open-history':navigate('history');break;
    case 'new':
      if(!serverReady)throw Error('Aguarde a conexão com os dados para abrir um pedido.');
      if(latestClosures().some(c=>c.date===dateKey()&&c.state!=='open'))throw Error('O dia está fechado. Use Fechamento e escolha Reabrir dia.');
      editOrder();break;
    case 'edit':
      if(!serverReady)throw Error('Aguarde a conexão com os dados para editar o pedido.');
      if(!canEditOrder(o))throw Error('Este pedido não pode mais ser editado.');
      editOrder(o);break;
    case 'order-back':showOrderStep(1);break;
    case 'order-view-cart':$('order-cart-title').focus();break;
    case 'detail':case 'back-detail':detail(o);break;
    case 'advance':await advance(o);break;
    case 'dismiss':$('modal').close();break;
    case 'add-item':addItem(id);break;
    case 'remove-item':
      edit.cart.splice(Number(id),1);
      renderEditor();
      ($('cart').querySelector('.qty')||$('product-search')).focus();
      break;
    case 'manual':addManual();break;
    case 'paid':
      await orderMutation(id,order=>{if(order.status==='cancelled')throw Error('Pedido cancelado.');if(!order.paid){order.paid=true;log(order,'Pagamento recebido');}});
      render();detail(getOrder(id));toast('Pagamento registrado.');break;
    case 'cancel':
      trackedForm('Cancelar '+code(o),'Os itens serão devolvidos ao estoque e o pedido seguirá no histórico.',
        notesField('Motivo','reason','','required maxlength="250"')+(o.paid?check('Confirmo que o valor já foi devolvido ao cliente','refunded',false).replace('<input','<input required'):''),
        'cancel',id,'Confirmar cancelamento');break;
    case 'fail':
      trackedForm('Voltar para expedição','Registre o que aconteceu na tentativa de entrega.',
        notesField('Motivo','reason','','required maxlength="250"'),'fail',id,'Registrar retorno');break;
    case 'bottles':
      trackedForm('Devolução de cascos','Pedido '+code(o),field('Quantidade recebida','quantity',o.bottles-o.returned,'number',
        'min="1" max="'+(o.bottles-o.returned)+'" step="1" required'),'bottles',id,'Registrar devolução');break;
    case 'copy':await copyText(orderText(o));break;
    case 'print':printContent('<h1>Disk Menezes</h1><p class="textbreak">'+esc(orderText(o))+'</p>');break;
    case 'report-print':printContent(reports(true));break;
    case 'copy-closing':await copyText(closingText());break;
    case 'analytics-print':printContent(comparison(true));break;
    case 'view-day':
      reportDate=id;render();$('report-date').focus();window.scrollTo(0,0);break;
    case 'reopen-day':
      openModal('Reabrir dia',dayLabel(reportDate),notesField('Motivo (opcional)','reason','','maxlength="250"'),
        btn('Voltar','dismiss')+formButton('Confirmar reabertura'),'reopen');
      break;
    case 'csv':csvReport();break;
    case 'product':productDialog(id);break;
    case 'stock-adjust': {
      const p=getProduct(id);
      dialogState={id};
      openModal('Ajustar estoque',p.name,field('Quantidade disponível','quantity',p.stock,'number','min="0" max="1000000" step="1" required'),
        btn('Voltar','dismiss')+formButton('Salvar estoque'),'stock');break;
    }
    case 'driver-add':
      openModal('Adicionar entregador','Use o nome ou a identificação da moto.',field('Nome ou identificação','name','','text','maxlength="40" required'),
        btn('Voltar','dismiss')+formButton('Adicionar'),'driver');break;
    case 'driver-remove':
      if(driverUsed(db,id)) throw Error('Há pedidos em andamento com este entregador.');
      dialogState={id};
      openModal('Remover entregador',id,'<p>Os pedidos anteriores mantêm o nome registrado.</p>',
        btn('Voltar','dismiss')+formButton('Remover entregador'),'driver-remove');break;
    case 'toggle-km':
      await mutate(data=>{
        const skipped=data.skipMileage||[];
        data.skipMileage=skipped.includes(reportDate)?skipped.filter(date=>date!==reportDate):[...skipped,reportDate];
      });
      render();break;
    case 'mileage': {
      const vehicles=[...new Set([...db.drivers,...db.mileage.map(row=>row.vehicle)])];
      openModal('Registrar quilometragem','Movimento de '+dayLabel(reportDate),'<div class="formgrid">'+
        field('Moto ou veículo','vehicle','','text','required maxlength="45" list="fleet-list"','span2')+
        '<datalist id="fleet-list">'+options(vehicles)+'</datalist>'+
        field('Km inicial','start','','number','min="0" max="9999999" step="0.01" required')+
        field('Km final','end','','number','min="0" max="9999999" step="0.01" required')+'</div>',
        btn('Voltar','dismiss')+formButton('Salvar quilometragem'),'mileage');break;
    }
    case 'close-day': {
      const t=reportTotals(reportOrders());
      openModal('Registrar fechamento',dayLabel(reportDate),
        '<p>Este registro guarda o horário do fechamento. Os pedidos, recebimentos pendentes e ajustes seguem disponíveis no histórico.</p>'+
        '<p style="margin-top:8px">'+pill(money(sum(t.paid,orderTotal))+' recebido','green')+' '+pill(t.unpaid.length+' pedido(s) a receber','orange')+'</p>',
        btn('Voltar','dismiss')+formButton('Registrar fechamento'),'closing');break;
    }
    case 'environment':
      if(writing)throw Error('Aguarde a gravação em andamento.');
      environment=environment==='demo'?'real':'demo';
      try{localStorage.setItem(prefix+'environment',environment)}catch{}
      db=load();navigate('board');await refreshRemote({bootstrap:true});toast(environment==='demo'?'Demonstração aberta.':'Operação real aberta.');break;
    case 'backup':
      download('disk-menezes-'+environment+'-'+dateKey()+'.json',JSON.stringify({schema:'disk-menezes-backup',environment,data:db},null,2),'application/json');
      break;
    case 'restore':$('backup-file').click();break;
    case 'sample-catalog':
      if(db.products.length)throw Error('Já há produtos cadastrados.');
      await mutate(data=>{data.products=structuredClone(catalog).map(p=>({...p,stock:0}));});
      render();toast('Catálogo de exemplo carregado com estoque zerado.');break;
  }
}
async function submitForm(form){
  const name=form.dataset.form;
  const values=Object.fromEntries(new FormData(form));
  switch(name){
    case 'order':await saveOrder(form);break;
    case 'dispatch':case 'complete':case 'cancel':case 'fail':case 'bottles':await doTracked(name,values);break;
    case 'product': {
      const p={id:dialogState.id||uid(),name:values.name.trim(),category:values.category.trim(),price:cents(values.price),
        stock:Number(values.stock),min:Number(values.min),bottle:values.bottle==='on',active:values.active==='on'};
      if(!p.name||!p.category)throw Error('Informe o nome e a categoria.');
      await mutate(data=>{
        const index=data.products.findIndex(row=>row.id===p.id);
        if(index<0)data.products.push(p);else data.products[index]=p;
      });finish('Produto salvo.');break;
    }
    case 'stock':
      await mutate(data=>{data.products.find(p=>p.id===dialogState.id).stock=Number(values.quantity);});finish('Estoque atualizado.');break;
    case 'driver': {
      const driver=values.name.trim();
      if(!driver||db.drivers.some(row=>norm(row)===norm(driver)))throw Error('Informe um nome novo para o entregador.');
      await mutate(data=>data.drivers.push(driver));finish('Entregador adicionado.');break;
    }
    case 'driver-remove':
      await mutate(data=>{
        if(driverUsed(data,dialogState.id))throw Error('Há pedidos em andamento com este entregador.');
        data.drivers=data.drivers.filter(driver=>driver!==dialogState.id);
      });finish('Entregador removido.');break;
    case 'mileage': {
      const entry={date:reportDate,vehicle:values.vehicle.trim(),start:Number(values.start),end:Number(values.end)};
      if(!entry.vehicle||entry.end<entry.start)throw Error('Informe o veículo. O km final precisa ser maior ou igual ao inicial.');
      await mutate(data=>{
        data.mileage=data.mileage.filter(row=>!(row.date===entry.date&&norm(row.vehicle)===norm(entry.vehicle)));
        data.mileage.push(entry);
      });finish('Quilometragem registrada.');break;
    }
    case 'closing': {
      const snapshot=dailySummary(reportOrders());
      const closing=latestClosures().find(c=>c.date===reportDate);
      if(closing&&closing.state!=='open')throw Error('Este dia já está fechado.');
      await mutate(data=>data.closures.push({date:reportDate,at:Date.now(),state:'closed',snapshot}));
      finish('Fechamento registrado.');break;
    }
    case 'reopen': {
      const closing=latestClosures().find(c=>c.date===reportDate);
      if(!closing||closing.state==='open')throw Error('Este dia já está aberto.');
      await mutate(data=>data.closures.push({date:reportDate,at:Date.now(),state:'open',reason:values.reason.trim()}));
      finish('Dia reaberto. Os pedidos continuam no histórico.');break;
    }
    case 'fees':
      if(!Number.isSafeInteger(cents(values.entrega))||cents(values.entrega)<0)throw Error('Confira os valores informados.');
      await mutate(data=>{data.fees={entrega:cents(values.entrega)};});toast('Taxas salvas.');break;
    case 'restore':
      await persist(structuredClone(dialogState.records));
      finish('Backup restaurado.');break;
  }
}
function hideChartTooltip(){
  $('chart-tooltip').hidden=true;
}
function showChartTooltip(bar){
  const tooltip=$('chart-tooltip');
  $('chart-tooltip-name').textContent=bar.dataset.chartName;
  $('chart-tooltip-value').textContent=bar.dataset.chartPeriod+' · '+bar.dataset.chartValue;
  tooltip.style.setProperty('--swatch',getComputedStyle(bar).backgroundColor);
  tooltip.hidden=false;
  const bounds=bar.getBoundingClientRect();
  const x=bounds.left+bounds.width/2-tooltip.offsetWidth/2;
  const above=bounds.top-tooltip.offsetHeight-8;
  const y=above>=8?above:bounds.top+8;
  tooltip.style.left=Math.min(Math.max(8,x),window.innerWidth-tooltip.offsetWidth-8)+'px';
  tooltip.style.top=Math.min(Math.max(8,y),window.innerHeight-tooltip.offsetHeight-8)+'px';
}
document.addEventListener('pointerover',e=>{
  const bar=e.target.closest('[data-chart-name]');
  if(bar)showChartTooltip(bar);
});
document.addEventListener('pointerout',e=>{
  if(e.target.closest('[data-chart-name]'))hideChartTooltip();
});
document.addEventListener('focusin',e=>{
  const bar=e.target.closest('[data-chart-name]');
  if(bar)showChartTooltip(bar);
});
document.addEventListener('focusout',e=>{
  if(e.target.closest('[data-chart-name]'))hideChartTooltip();
});
window.addEventListener('scroll',hideChartTooltip,true);
window.addEventListener('resize',hideChartTooltip);
$('mobile-tools').innerHTML=icon('settings');
$('mobile-menu-close').innerHTML=icon('close');
mobileLayout.addEventListener('change',event=>{
  if(!event.matches&&$('mobile-menu').open)$('mobile-menu').close();
  if(page==='board')render(true);
});
$('modes').innerHTML=modes.map(([id,name])=>
  '<button type="button" data-act="mode" data-id="'+id+'">'+name+'</button>').join('');
$('theme').addEventListener('click',()=>{
  theme=theme==='light'?'dark':'light';
  try{localStorage.setItem(prefix+'theme',theme)}catch{}
  applyTheme();
});
$('modal').addEventListener('close',()=>{if(!$('modal').open){edit=null;dialogState=null;refreshRemote();}});
document.addEventListener('click',event=>{
  const bar=event.target.closest('[data-chart-name]');
  if(bar)showChartTooltip(bar);
  else hideChartTooltip();
  const button=event.target.closest('[data-act]');
  if(button&&!button.disabled){const error=$('dialog-error');if(error)error.hidden=true;action(button).catch(error=>showError(error.message));}
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape')hideChartTooltip();
  if(event.key==='Enter'&&event.target.id==='product-search'){
    event.preventDefault();
    const first=$('product-picker').querySelector('button:not([disabled])');
    first?.click();
    if(first){$('product-search').value='';renderPicker();$('product-search').focus();}
  }
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.id==='search'){query=el.value;render(true);}
  if(el.id==='product-search')renderPicker();
  if(edit&&el.name==='address')el.setCustomValidity('');
  if(el.hasAttribute('data-qty')&&edit){
    edit.cart[Number(el.dataset.qty)].qty=el.valueAsNumber;
    updateCartCount();
    renderPicker();updateTotals();
  }
  if(edit&&el.closest('[data-form="order"]')&&['fee','cash'].includes(el.name)){
    if(el.name==='fee') edit.deliveryFee=el.value;
    updateTotals();
  }
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='filter'){filter=el.value;render();$('filter')?.focus();}
  if(el.id==='history-date'){historyDate=el.value;render();$('history-date')?.focus();}
  if(el.form?.dataset.form==='mileage'&&el.name==='vehicle'){
    const prior=db.mileage.filter(row=>row.date<=reportDate&&norm(row.vehicle)===norm(el.value)).sort((a,b)=>b.date.localeCompare(a.date))[0];
    if(prior&&!el.form.elements.start.value)el.form.elements.start.value=prior.date===reportDate?prior.start:prior.end;
    if(prior?.date===reportDate&&!el.form.elements.end.value)el.form.elements.end.value=prior.end;
  }
  if(el.id==='analytics-period'){analyticsPeriod=el.value;render();$('analytics-period')?.focus();}
  if(el.id==='report-date'){reportDate=el.value||dateKey();render();$('report-date')?.focus();}
  if(edit&&el.closest('[data-form="order"]')){
    if(el.name==='kind'){
      if(!el.checked)return;
      const fee=el.form.elements.fee;
      fee.value=el.value==='retirada'?0:edit.deliveryFee;
      syncOrderFields();updateTotals();
    }
    if(el.name==='payment'){syncOrderFields();updateTotals();}
  }
});
document.addEventListener('invalid',event=>{
  const optional=event.target.closest('.order-editor details');
  if(optional) optional.open=true;
},true);
document.addEventListener('submit',async event=>{
  const form=event.target;
  if(!form.dataset.form)return;
  event.preventDefault();
  $('dialog-error')?.setAttribute('hidden','');
  if(form.dataset.form==='order'&&edit?.step===1){advanceOrderStep(form);return;}
  const submitter=event.submitter;
  if(submitter)submitter.disabled=true;
  try{await submitForm(form)}catch(error){showError(error.message);}
  finally{if(submitter)submitter.disabled=false;}
});
$('backup-file').addEventListener('change',async event=>{
  const [file]=event.target.files;
  event.target.value='';
  if(!file)return;
  try{
    if(file.size>12*1024*1024)throw Error('O arquivo ultrapassa 12 MB.');
    const raw=JSON.parse(await file.text());
    showRestore(validBackup(raw),raw.environment);
  }catch(error){showError(error instanceof SyntaxError?'O arquivo não contém um JSON válido.':error.message);}
});
window.addEventListener('storage',event=>{
  if(!hosted&&event.key===prefix+environment&&!$('modal').open){db=load();render(true);}
});
setInterval(()=>{updateHeaderDate();if((page==='board'||page==='delivery')&&!$('modal').open&&document.activeElement===document.body)render();},60000);
window.addEventListener('focus',()=>{if(!$('modal').open)refreshRemote();});
if(hosted)setInterval(()=>{if(!document.hidden&&!$('modal').open)refreshRemote();},25000);
$('sign-out').hidden=!hosted;
if(hosted)window.addEventListener('pageshow',event=>{
  if(event.persisted){
    if($('modal').open)$('modal').close();
    db=load();
    $('print').replaceChildren();
    render(true);
    refreshRemote({bootstrap:true});
  }
});
applyTheme();
render();
refreshRemote({bootstrap:true});
