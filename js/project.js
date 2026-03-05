function initProjectPage() {
    var video = document.getElementById("mainVideo");
    var loader = document.getElementById("mainLoader");

    if (video && loader) {
        var hideLoader = function () {
            loader.classList.add("hidden");
            video.classList.add("loaded");
        };
        if (video.readyState >= 3) hideLoader();
        else {
            video.addEventListener("canplay", hideLoader);
            video.addEventListener("playing", hideLoader);
        }
    }

    var btnPlay = document.getElementById("btnPlayPause");
    var btnMute = document.getElementById("btnMute");
    var btnReplay = document.getElementById("btnReplay");
    var btnFit = document.getElementById("btnFit");

    var svgPlay = '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    var svgPause = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    var svgMute = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    var svgSound = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    var svgFit = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
    var svgFill = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

    if (video) {
        if (btnPlay) btnPlay.addEventListener("click", function () {
            if (video.paused) { video.play(); btnPlay.innerHTML = svgPause; }
            else { video.pause(); btnPlay.innerHTML = svgPlay; }
        });
        if (btnMute) btnMute.addEventListener("click", function () {
            if (video.muted) { video.muted = false; btnMute.innerHTML = svgSound; }
            else { video.muted = true; btnMute.innerHTML = svgMute; }
        });
        if (btnReplay) btnReplay.addEventListener("click", function () {
            video.currentTime = 0; video.play(); if (btnPlay) btnPlay.innerHTML = svgPause;
        });
        var isFit = false;
        if (btnFit) btnFit.addEventListener("click", function () {
            isFit = !isFit;
            video.classList.toggle("fit-screen", isFit);
            btnFit.innerHTML = isFit ? svgFill : svgFit;
        });
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1 });
    var textEls = document.querySelectorAll(".info-text p, .credits-list");
    textEls.forEach(function (p) { observer.observe(p); });

    var track = document.getElementById("track");
    var viewport = document.getElementById("viewport");
    var container = document.querySelector(".horizontal-scroll-container");
    var items = container ? container.querySelectorAll(".gallery-item") : [];

    if (track && container && items.length > 0) {
        window.addEventListener("scroll", function () {
            var viewHeight = window.innerHeight;
            var offsetTop = container.offsetTop;
            var scrollY = window.scrollY;
            var windowWidth = window.innerWidth;
            var distance = scrollY - offsetTop;
            var maxScroll = container.offsetHeight - viewHeight;

            var lastItem = items[items.length - 1];
            var lastItemLeftOffset = lastItem.offsetLeft;
            var targetScreenPosition = windowWidth * 0.33;
            var maxTranslate = Math.max(0, lastItemLeftOffset - targetScreenPosition);

            if (distance >= 0) {
                var progress = distance / maxScroll;
                track.style.transform = "translateX(-" + progress * maxTranslate + "px)";
            }

            if (viewport && distance >= 0 && distance <= maxScroll) {
                var progress = distance / maxScroll;
                var currentColor = Math.round(245 - progress * 58);
                viewport.style.background = "linear-gradient(to right, #f5f5f5 0px, #f5f5f5 1920px, rgb(" + currentColor + "," + currentColor + "," + currentColor + ") 100%)";
            }
        });
    }
}

window.initProjectPage = initProjectPage;

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("mainVideo")) initProjectPage();
});
