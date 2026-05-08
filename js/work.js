/* js/work.js - Video playback: hover (desktop) + viewport (mobile) */
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach((item) => {
        const video = item.querySelector('video');
        if (!video) return;

        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        if (isMobile) {
            // Mobile: preload immediately, auto-play when visible
            video.preload = 'auto';
            video.load();

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(item);
        } else {
            // Desktop: preload metadata, play on hover
            video.preload = 'metadata';
            video.pause();

            item.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});
