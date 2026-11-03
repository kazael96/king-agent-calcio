/* Fixed campaign labels only. No requests, cookies, identifiers or career data. */
(function(root){
 'use strict';
 const SOURCES={ig:['instagram','organic_social'],tk:['tiktok','organic_social'],yt:['youtube','organic_social'],qa:['qa','referral'],fab:['fablinker','creator'],magico:['magicomonta','creator'],panoz:['panozfootballclub','creator'],icy:['icyaxy','creator'],nemo:['nemofm','creator'],mister:['misterfm','creator'],playmygame:['playmygame','community'],androidgaming:['androidgaming','community'],fmfusion:['fmfusion','community']};
 const CAMPAIGNS=['calcio_ottobre_2026','king_agent_multisport_2026','calcio_musica_2026','calcio_narrato_2026','king_agent_novembre_2026','king_agent_qa_2026'];
 const CONTENTS=['01-la-controproposta','02-due-talenti','03-i-soldi-della-firma','scelta-talento','incasso-accordo','bio','basket','volley','cricket','hockey','sfida-stagione','trattativa-completa','basket-minuti','calcio-accordo','prova-10','percorso-mobile'];
 const PACKAGES={'com.kazael96.kingagent':'calcio','com.kazael96.kingagentbasket':'basket','com.kazael96.kingagentvolley':'volley','com.kazael96.kingagentcricket.paid':'cricket','com.kazael96.kingagenthockey':'hockey','com.kazael96.kingagentrugby':'rugby'};
 const ORIGIN='https://kazael96.github.io',BASE='/king-agent-calcio/';
 function labels(search){
  const q=new URLSearchParams(search),alias=q.get('src'),pair=(Object.hasOwn(SOURCES,alias)?SOURCES[alias]:null)||Object.values(SOURCES).find(p=>p[0]===q.get('utm_source'));
  if(!pair)return null;
  const candidate=q.get('utm_campaign'),campaign=CAMPAIGNS.includes(candidate)?candidate:'calcio_ottobre_2026';
  const raw=q.get('v')||q.get('utm_content')||'',plain=raw.replace(/-en$/,'');
  return {utm_source:pair[0],utm_medium:pair[1],utm_campaign:campaign,...(CONTENTS.includes(plain)?{utm_content:raw}:{})};
 }
 function decorate(href,search){
  const u=new URL(href,ORIGIN+BASE),q=new URLSearchParams(search),data=labels(search);
  const internal=u.origin===ORIGIN&&[BASE,BASE+'index.html',BASE+'scopri.html',BASE+'basket.html',BASE+'demo-basket.html',BASE+'demo-volley.html'].includes(u.pathname);
  const store=u.origin==='https://play.google.com'&&u.pathname==='/store/apps/details'&&Object.hasOwn(PACKAGES,u.searchParams.get('id'));
  if(!internal&&!store)return href;
  if(internal&&['it','en'].includes(q.get('lang')))u.searchParams.set('lang',q.get('lang'));
  if(data){
   for(const [k,v] of Object.entries(data))u.searchParams.set(k,v);
   if(store)u.searchParams.set('referrer',new URLSearchParams(data).toString());
  }else if(store&&!u.searchParams.has('referrer')){
   u.searchParams.set('referrer',new URLSearchParams({utm_source:'kingagent_website',utm_medium:'referral',utm_campaign:'king_agent_novembre_2026',utm_content:PACKAGES[u.searchParams.get('id')]}).toString());
  }
  return u.href;
 }
 const api={labels,decorate,storeUrl:href=>decorate(href,root.location?.search||''),PACKAGES,CAMPAIGNS,CONTENTS,SOURCES};
 if(typeof module==='object'&&module.exports){module.exports=api;return}
 root.KingAgentCampaign=api;
 function apply(){root.document.querySelectorAll('a.demo-link,a.store-link,a.family-demo,a.family-buy').forEach(a=>{a.href=decorate(a.href,root.location.search)})}
 if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();root.document.addEventListener('click',e=>{if(e.target.closest?.('[data-lang]'))apply()})}
 })(typeof window==='object'?window:{});
