// main.js — accessible interactive behavior

const projects = [
  { id: 'final-security-pt2', title: 'Final Security Incident Report pt2', source: 'Final Security Incident Report pt2.docx' },
  { id: 'sha256-hash', title: 'SHA256 hash', source: 'SHA256 hash.docx' },
  { id: 'network-monitoring', title: 'Network Monitoring', source: 'Network Monitoring.docx' },
  { id: 'incident-journal', title: "Incident handler's journal", source: "Incident handler's journal .docx" },
  { id: 'final-security', title: 'Final Security Incident Report', source: 'Final Security Incident Report.docx' },
  { id: 'wazuh', title: 'Wazuh SIEM Project', source: 'Wazuh SIEM Project.docx' },
  { id: 'wireshark', title: 'Wireshark', source: 'Wireshark.docx' },
  { id: 'suricata', title: 'Alerts, logs, and rules with Suricata', source: 'Alerts, logs, and rules with Suricata.docx' }
];

function safeFilename(title){
  return title.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase();
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  const btnContainer = document.getElementById('projects-buttons');
  const detail = document.getElementById('project-detail');

  // create buttons
  projects.slice(0,8).forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'project-button';
    btn.type = 'button';
    btn.textContent = p.title;
    btn.setAttribute('aria-pressed','false');
    btn.dataset.id = p.id;
    btn.dataset.source = p.source;
    btn.addEventListener('click',toggleProject);
    btn.addEventListener('keyup', (e)=>{ if(e.key === 'Enter' || e.key === ' ') toggleProject.call(btn, e); });
    btnContainer.appendChild(btn);
  });

  // nav toggle for small screens
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });

  function toggleProject(e){
    const pressed = this.getAttribute('aria-pressed') === 'true';
    // reset other buttons
    document.querySelectorAll('.project-button').forEach(b=>b.setAttribute('aria-pressed','false'));
    if(!pressed){
      this.setAttribute('aria-pressed','true');
      showProject(this.dataset);
    } else {
      this.setAttribute('aria-pressed','false');
      clearProject();
    }
  }

  function clearProject(){
    detail.innerHTML = '<p class="muted">No project selected.</p>';
  }

  function showProject(dataset){
    const title = dataset.id || 'project';
    const source = dataset.source || '';
    const filename = safeFilename(source.replace(/\.docx?$/i, '')) + '.txt';
    detail.innerHTML = `<h3>${dataset.id}</h3><div class="project-content" id="content-${dataset.id}">Loading…</div>`;

    const contentEl = document.getElementById('content-'+dataset.id);
    // attempt to fetch a text file from content/<safe>.txt
    fetch('content/' + filename).then(r=>{
      if(!r.ok) throw new Error('not found');
      return r.text();
    }).then(txt=>{
      contentEl.innerHTML = `<pre>${escapeHtml(txt)}</pre>`;
      setTimeout(()=>{
        contentEl.classList.add('open');
        // Just add open class, max-height handled by CSS now
        contentEl.parentElement.scrollTop = 0; // Reset scroll position
      },20);
    }).catch(err=>{
      contentEl.innerHTML = `<p class="muted">Content not available locally. To load the real project text, place a file at <code>content/${filename}</code> or run the included extraction script which converts the Word documents into text files.</p>`;
      setTimeout(()=>{
        contentEl.classList.add('open');
        contentEl.style.maxHeight = contentEl.scrollHeight + 'px';
        const tidyErr = ()=>{
          contentEl.style.maxHeight = 'none';
          contentEl.removeEventListener('transitionend', tidyErr);
        };
        contentEl.addEventListener('transitionend', tidyErr);
      },20);
    });
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
    }[c]));
  }

  // initial state
  clearProject();
});
