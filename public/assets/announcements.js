(() => {
  'use strict';
  const SUPABASE = 'https://eyrjwpmbsyvjtfmnzaae.supabase.co';
  const KEY = 'sb_publishable_AT1y0n7NbHOVoJl3vzDoiw_86N8HSR_';
  const $ = id => document.getElementById(id);
  let adminToken = null;
  let lastSeen = localStorage.getItem('skinSwapLastAnnouncement') || '';
  let announcements = [];

  async function request(path, method = 'GET', payload = null, token = null) {
    const headers = {'apikey': KEY};
    if (payload !== null) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = 'Bearer ' + token;
    const response = await fetch(SUPABASE + path, {
      method, headers, ...(payload !== null ? {body: JSON.stringify(payload)} : {}),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Supabase ${response.status}: ${text.slice(0,200)}`);
    return text ? JSON.parse(text) : null;
  }
  function escapedDate(s) {const d = new Date(s); return Number.isNaN(+d) ? '' : d.toLocaleString();}
  function itemCard(a, canDelete=false) {
    const card=document.createElement('article');card.className='announcement';
    const title=document.createElement('h3');title.textContent=a.title;
    const desc=document.createElement('p');desc.textContent=a.message;
    const time=document.createElement('time');time.textContent=escapedDate(a.created_at);
    card.append(title,desc,time);
    if (canDelete) {
      const del=document.createElement('button');del.type='button';del.className='login secondary';del.textContent='Delete announcement';
      del.onclick=async()=>{
        if(!confirm('Delete this announcement for everyone?'))return;
        try { await request('/rest/v1/announcements?id=eq.'+encodeURIComponent(a.id),'DELETE',null,adminToken); await refresh(); }
        catch(e){$('announceAdminStatus').textContent=e.message;}
      };
      card.append(del);
    }
    return card;
  }
  function render() {
    const list=$('announcementsList');list.replaceChildren();
    if(!announcements.length){const p=document.createElement('p');p.textContent='No announcements yet.';list.append(p);}
    else announcements.forEach(a=>list.append(itemCard(a)));
    const latest=announcements[0]?.created_at || '';
    const unread=latest && (!lastSeen || latest>lastSeen) ? announcements.length : 0;
    $('noticeCount').hidden=!unread;$('noticeCount').textContent=String(unread);
    if(adminToken)renderAdmin();
  }
  function renderAdmin() {
    const list=$('announceAdminList');list.replaceChildren();
    announcements.forEach(a=>list.append(itemCard(a,true)));
  }
  async function refresh() {
    try {
      const rows = await request('/rest/v1/announcements?select=id,title,message,created_at&published=eq.true&order=created_at.desc&limit=30');
      announcements=Array.isArray(rows)?rows:[];render();
    } catch(e) {
      const list=$('announcementsList');list.replaceChildren();
      const p=document.createElement('p');p.textContent='Announcements unavailable. Run announcements-setup.sql in Supabase SQL Editor. '+e.message;list.append(p);
    }
  }
  $('noticeOpen').onclick=()=>{
    $('noticeModal').classList.add('show');lastSeen=announcements[0]?.created_at||lastSeen;
    try{localStorage.setItem('skinSwapLastAnnouncement',lastSeen)}catch{}
    render();
  };
  $('noticeClose').onclick=()=> $('noticeModal').classList.remove('show');
  $('noticeModal').onclick=e=>{if(e.target===$('noticeModal'))$('noticeModal').classList.remove('show');};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$('noticeModal').classList.remove('show');});
  document.addEventListener('skin-admin-authenticated',e=>{
    adminToken=e.detail?.token||null;
    $('announceAdmin').hidden=!adminToken;
    if(adminToken)renderAdmin();
  });
  $('publishAnnouncement').onclick=async()=>{
    const title=$('announceTitle').value.trim(), message=$('announceBody').value.trim();
    if(!adminToken){$('announceAdminStatus').textContent='Sign in as Admin first.';return;}
    if(!title||!message){$('announceAdminStatus').textContent='Title and message are required.';return;}
    const btn=$('publishAnnouncement');btn.disabled=true;$('announceAdminStatus').textContent='Publishing…';
    try{
      await request('/rest/v1/announcements','POST',{title,message,published:true},adminToken);
      $('announceTitle').value='';$('announceBody').value='';
      $('announceAdminStatus').textContent='✓ Announcement published to the website. Native Android push requires Firebase setup.';
      await refresh();
    }catch(e){$('announceAdminStatus').textContent='Publish failed: '+e.message;}
    finally{btn.disabled=false;}
  };
  refresh();
  setInterval(()=>{if(!document.hidden)refresh();},45000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
