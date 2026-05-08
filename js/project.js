/**
 * project.js – Steuerung für die Projekt-Detailseite
 * Wird nach project-loader.js geladen
 */

(function () {
  'use strict';

  window.initProjectPage = function () {
    console.log('🎬 initProjectPage');

    // === VIDEO CONTROLS ===
    const video = document.getElementById('mainVideo');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const btnReplay = document.getElementById('btnReplay');
    const btnMute = document.getElementById('btnMute');
    const btnFit = document.getElementById('btnFit');

    if (video && btnPlayPause) {
      btnPlayPause.addEventListener('click', function () {
        if (video.paused) {
          video.play();
          btnPlayPause.querySelector('svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        } else {
          video.pause();
          btnPlayPause.querySelector('svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        }
      });
    }

    if (video && btnReplay) {
      btnReplay.addEventListener('click', function () {
        video.currentTime = 0;
        video.play();
      });
    }

    if (video && btnMute) {
      btnMute.addEventListener('click', function () {
        video.muted = !video.muted;
        btnMute.classList.toggle('muted', video.muted);
      });
    }

    if (video && btnFit) {
      btnFit.addEventListener('click', function () {
        video.style.objectFit = video.style.objectFit === 'contain' ? 'cover' : 'contain';
        btnFit.classList.toggle('fit-contain');
      });
    }

    // === SCROLL HINT FADE ===
    const scrollHint = document.querySelector('.hero-section .scroll-hint-wrapper');
    if (scrollHint && video) {
      video.addEventListener('timeupdate', function () {
        if (video.currentTime > 1.5) {
          scrollHint.style.opacity = '0';
          scrollHint.style.transition = 'opacity 0.8s ease';
        }
      });
    }

    // === HORIZONTAL SCROLL GALLERY ===
    const track = document.getElementById('track');
    const viewport = document.getElementById('viewport');

    if (track && viewport) {
      let isDown = false;
      let startX;
      let scrollLeft;

      viewport.addEventListener('mousedown', function (e) {
        isDown = true;
        viewport.classList.add('active');
        startX = e.pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
      });

      viewport.addEventListener('mouseleave', function () {
        isDown = false;
        viewport.classList.remove('active');
      });

      viewport.addEventListener('mouseup', function () {
        isDown = false;
        viewport.classList.remove('active');
      });

      viewport.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - viewport.offsetLeft;
        const walk = (x - startX) * 1.5;
        viewport.scrollLeft = scrollLeft - walk;
      });

      // Touch support
      viewport.addEventListener('touchstart', function (e) {
        startX = e.touches[0].pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
      }, { passive: true });

      viewport.addEventListener('touchmove', function (e) {
        const x = e.touches[0].pageX - viewport.offsetLeft;
        const walk = (x - startX) * 1.5;
        viewport.scrollLeft = scrollLeft - walk;
      }, { passive: true });
    }

    // === VIDEO LOADER ===
    const loader = document.getElementById('mainLoader');
    if (loader && video) {
      video.addEventListener('loadeddata', function () {
        loader.style.opacity = '0';
        setTimeout(function () { loader.style.display = 'none'; }, 500);
      });
    }

    console.log('✅ Project page initialized');
  };

  // Auto-init if page already loaded
  if (document.readyState === 'complete') {
    setTimeout(window.initProjectPage, 100);
  }
})();
