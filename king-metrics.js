/* King Agent public web only. Basic consent: no Google request before opt-in. */
(function(root){
 'use strict';
 const ID='G-CDLJMP3WQE', KEY='king-agent-web-statistics-v1', DAYS=180;
 const campaign=typeof module==='object'&&module.exports?require('./king-campaign.js'):root.KingAgentCampaign;
 const PACKAGES=campaign.PACKAGES;
 function context(href){
  const u=new URL(href),path=u.pathname,file=path.split('/').pop();
  const labels=campaign.labels(u.search);
  const kind=file==='scopri.html'||file==='basket.html'?'landing':'demo';
  const sport=path.endsWith('basket.html')?'basket':path.endsWith('demo-volley.html')?'volley':'calcio';
  const clean=new URL(u.origin+path);
  if(labels)for(const [k,v] of Object.entries(labels))clean.searchParams.set(k,v);
  return {sport,page_kind:kind,page_location:clean.href,page_referrer:'',page_title:'King Agent '+sport+' — '+(kind==='landing'?'Sito':'Demo')};
 }
 function storeSport(href){try{const u=new URL(href);return u.hostname==='play.google.com'&&u.pathname==='/store/apps/details'?PACKAGES[u.searchParams.get('id')]||null:null}catch{return null}}
 if(typeof module==='object'&&module.exports){module.exports={context,storeSport};return}
 if(!root||!root.document||root.KingMetrics)return;
 const doc=root.document,ctx=context(root.location.href);let choice=null,loaded=false,viewSent=false,started=false,revoked=false,panel;
 const en=()=>doc.documentElement.lang==='en';
 const text=(it,english)=>en()?english:it;
 function send(){(root.dataLayer=root.dataLayer||[]).push(arguments)}
 function clearCookies(){
  for(const item of doc.cookie.split(';')){const name=item.trim().split('=')[0];if(!/^kaweb_ga(?:_|$)/.test(name))continue;
   for(const path of ['/','/king-agent-calcio/']){doc.cookie=name+'=; Max-Age=0; Path='+path;doc.cookie=name+'=; Max-Age=0; Path='+path+'; Domain='+root.location.hostname;}
  }
 }
 function save(value){choice=value;try{root.localStorage.setItem(KEY,JSON.stringify({choice:value,expires:Date.now()+DAYS*86400000}))}catch{}}
 function event(name,extra){
  if(choice!=='yes'||revoked||!['page_view','demo_start','store_click'].includes(name))return;
  send('event',name,Object.assign({},ctx,extra||{}, {send_to:ID}));
 }
 function enable(){
  if(revoked){root.location.reload();return}
  root['ga-disable-'+ID]=false;
  if(!loaded){
   loaded=true;
   send('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   send('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   send('set','ads_data_redaction',true);send('js',new Date());
   send('config',ID,Object.assign({},ctx,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:'kaweb',cookie_domain:root.location.hostname,cookie_path:'/king-agent-calcio/',cookie_expires:60*86400,cookie_update:false}));
   const script=doc.createElement('script');script.async=true;script.id='king-web-google-tag';script.src='https://www.googletagmanager.com/gtag/js?id='+ID;doc.head.append(script);
  }
  if(!viewSent){viewSent=true;event('page_view')}
 }
 function decide(value){
  save(value);
  if(value==='yes')enable();
  else{root['ga-disable-'+ID]=true;if(loaded){revoked=true;root.dataLayer.length=0;}clearCookies()}
  if(panel)panel.remove();panel=null;
 }
 function show(){
  if(panel){panel.querySelector('button').focus();return}
  panel=doc.createElement('section');panel.id='king-metrics-consent';panel.setAttribute('role','region');panel.setAttribute('aria-label',text('Statistiche facoltative','Optional statistics'));panel.setAttribute('data-king-user-text','');
  const h=doc.createElement('h2');h.textContent=text('Ci aiuti a migliorare King Agent?','Help us improve King Agent?');
  const p=doc.createElement('p');p.textContent=text('Con il tuo consenso usiamo Google Analytics per contare visite, avvii della demo e clic verso lo store. Nessuna pubblicità, email o dati delle carriere. Puoi giocare anche senza accettare.','With your consent, Google Analytics counts visits, demo starts and store clicks. No advertising, emails or career data. You can play without accepting.');
  const actions=doc.createElement('div');actions.className='km-actions';
  for(const [label,value] of [[text('Continua senza','Continue without'),'no'],[text('Accetta statistiche','Accept statistics'),'yes']]){const b=doc.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>decide(value);actions.append(b)}
  const a=doc.createElement('a');a.href='privacy.html#statistiche-web';a.textContent=text('Privacy e revoca del consenso','Privacy and withdrawing consent');
  panel.append(h,p,actions,a);doc.body.append(panel);
 }
 function start(){if(choice==='yes'&&!started&&!revoked){started=true;event('demo_start')}}
 root.KingMetrics=Object.freeze({demoStart:start,storeClick(href){const sport=storeSport(href);if(sport)event('store_click',{sport})},preferences:show,refreshLanguage(){const b=doc.getElementById("king-metrics-preferences");if(b)b.textContent=text("Statistiche / Privacy","Statistics / Privacy");if(panel){panel.remove();panel=null;show()}}});
 function init(){
  const css=doc.createElement('style');css.textContent='#king-metrics-consent{position:fixed;inset:auto 12px 14px;z-index:2147483000;max-width:560px;max-height:70dvh;overflow:auto;margin:auto;padding:18px;background:#302331;color:#f6e7ce;border:1px solid #c6a477;border-radius:16px;box-shadow:0 8px 36px #0009;font:14px/1.5 system-ui;box-sizing:border-box}#king-metrics-consent h2{font:700 21px/1.2 Georgia,serif;margin:0 0 10px;color:#f6e7ce}#king-metrics-consent p{margin:0 0 14px;color:#eadbcc}#king-metrics-consent .km-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}#king-metrics-consent button{min-height:46px;padding:10px;border:1px solid #d9b583;border-radius:9px;background:#4b3541;color:#fff1da;font:700 14px/1.3 system-ui;cursor:pointer}#king-metrics-consent a{display:block;margin-top:12px;color:#f0c98f}#king-metrics-preferences{position:fixed;right:8px;bottom:5px;z-index:1000;min-height:32px;margin:0;padding:6px 9px;border:1px solid #a7876f;border-radius:7px;background:#302331;color:#f6e7ce;font:12px/1.3 system-ui;cursor:pointer}#king-metrics-consent button:focus-visible,#king-metrics-preferences:focus-visible{outline:3px solid #ffd191;outline-offset:2px}@media(max-width:350px){#king-metrics-consent{padding:14px}#king-metrics-consent .km-actions{grid-template-columns:1fr}}';doc.head.append(css);
  const b=doc.createElement('button');b.type='button';b.id='king-metrics-preferences';b.setAttribute('data-king-user-text','');b.textContent=text('Statistiche / Privacy','Statistics / Privacy');b.onclick=show;if(ctx.page_kind==='landing')doc.body.append(b);
  try{const old=JSON.parse(root.localStorage.getItem(KEY));if(old&&old.expires>Date.now()&&['yes','no'].includes(old.choice))choice=old.choice}catch{}
  if(choice==='yes')enable();else{root['ga-disable-'+ID]=true;clearCookies();if(!choice)show()}
  doc.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(a)root.KingMetrics.storeClick(a.href)},true);
  root.addEventListener('storage',e=>{if(e.key===KEY){let value;try{value=JSON.parse(e.newValue)}catch{}if(value?.choice!=='yes'){choice='no';root['ga-disable-'+ID]=true;revoked=loaded;clearCookies()}}});
 }
 if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof window==='object'?window:null);
