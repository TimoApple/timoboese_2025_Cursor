
/* js/main.js */
document.addEventListener("DOMContentLoaded", () => {
    let transitionOverlay = document.querySelector('.page-transition');
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        document.body.appendChild(transitionOverlay);
    }

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id') || 'pro7';
    
    if (typeof projectData === 'undefined') {
        console.error('projectData is not defined');
        transitionOverlay.classList.add('hidden');
        return;
    }
    
    const data = projectData[projectId];
    
    if(!data) {
        console.error("Project not found: " + projectId);
        transitionOverlay.classList.add('hidden');
        return;
    }

    const titleEl = document.getElementById('p-title');
    if (titleEl) titleEl.textContent = data.title;

    const clientEl = document.getElementById('p-client');
    const roleEl = document.getElementById('p-role');
    const yearEl = document.getElementById('p-year');
    const agencyEl = document.getElementById('p-agency');
    
    if (clientEl) clientEl.textContent = data.client;
    if (roleEl) roleEl.textContent = data.role;
    if (yearEl) yearEl.textContent = data.year;
    if (agencyEl) agencyEl.textContent = data.agency;

    const descContainer = document.getElementById('p-description');
    if (descContainer && data.description) {
        data.description.forEach(text => {
            const p = document.createElement('p');
            p.className = 'anim-text';
            p.textContent = text;
            descContainer.appendChild(p);
        });
    }

    if(data.credits) {
        const cList = document.createElement('div');
        cList.className = 'credits-list anim-text';
        const creditsFragment = document.createDocumentFragment();
        
        data.credits.forEach(cred => {
            const credDiv = document.createElement('div');
            credDiv.className = 'credit-item';
            credDiv.innerHTML = `<span class="credit-role">${cred.role}:</span> <span class="credit-name">${cred.name}</span>`;
            creditsFragment.appendChild(credDiv);
        });
        
        cList.appendChild(creditsFragment);
        const infoBox = document.querySelector('.info-box');
        if (infoBox) infoBox.appendChild(cList);
    }

    const sectionsContainer = document.getElementById('mediaSections');
    if (sectionsContainer && data.sections) {
        data.sections.forEach((section, idx) => {
            const secDiv = document.createElement('section');
            secDiv.className = 'media-section';
            secDiv.dataset.index = idx;

            if(section.type === 'video') {
                const video = document.createElement('video');
                video.src = section.src;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.autoplay = true;
                video.className = 'anim-media';
                secDiv.appendChild(video);
            } 
            else if(section.type === 'image') {
                const img = document.createElement('img');
                img.src = section.src;
                img.alt = data.title;
                img.loading = 'lazy';
                img.className = 'anim-media';
                secDiv.appendChild(img);
            }

            sectionsContainer.appendChild(secDiv);
        });
    }

    const mediaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                mediaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.anim-text, .anim-media').forEach(el => {
        mediaObserver.observe(el);
    });

    setTimeout(() => {
        transitionOverlay.classList.add('hidden');
    }, 300);
});
