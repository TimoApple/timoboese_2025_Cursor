/* js/work.js - Simplified video playback */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 work.js loaded');
    
    const projectItems = document.querySelectorAll('.project-item');
    console.log(`Found ${projectItems.length} projects`);
    
    projectItems.forEach((item, i) => {
        const video = item.querySelector('video');
        
        if (!video) {
            console.warn(`No video in project ${i}`);
            return;
        }
        
        console.log(`Setup video ${i}: ${video.src}`);
        
        // Set video properties
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        
        // Pause initially
        video.pause();
        
        // Play on hover
        item.addEventListener('mouseenter', () => {
            console.log(`▶ Play ${i}`);
            video.play().catch(err => console.warn(`Play blocked ${i}:`, err));
        });
        
        // Pause on leave
        item.addEventListener('mouseleave', () => {
            console.log(`⏸ Pause ${i}`);
            video.pause();
            video.currentTime = 0;
        });
    });
});
