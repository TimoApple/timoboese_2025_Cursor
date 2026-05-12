/* js/text.js – Liquid Text Effect mit CSS blur() statt SVG-Filtern */

window.initLiquidText = function() {
    const textEl = document.getElementById('dynamic-text');
    if (!textEl) return;

    const textContent = textEl.textContent.trim();
    textEl.innerHTML = '';
    const charElements = [];
    const words = textContent.split(' ');

    words.forEach((word, wIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'pre';

        word.split('').forEach((char, cIndex) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.position = 'relative';
            span.style.willChange = 'transform, filter';
            wordSpan.appendChild(span);

            charElements.push({
                el: span,
                targetBlur: 0, currentBlur: 0,
                targetX: 0, currentX: 0,
                targetY: 0, currentY: 0,
                targetScale: 1, currentScale: 1
            });
        });

        textEl.appendChild(wordSpan);
        textEl.appendChild(document.createTextNode(' '));
    });

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        charElements.forEach(char => {
            const rect = char.el.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const charCenterY = rect.top + rect.height / 2;
            const dx = mouseX - charCenterX;
            const dy = mouseY - charCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Desktop: größerer Wirkungsradius (350px), mehr Blur, weicher auslaufend
            const isDesktop = window.innerWidth > 768;
            const maxDistance = isDesktop ? 600 : 220;



            if (distance < maxDistance) {
                const influence = Math.pow(1 - (distance / maxDistance), 4);
                char.targetBlur = influence * 8;
                const pushStrength = influence * 30;



                const angle = Math.atan2(dy, dx);
                char.targetX = -Math.cos(angle) * pushStrength;
                char.targetY = -Math.sin(angle) * pushStrength;
                char.targetScale = 1 + (influence * 0.05);
            } else {

                char.targetBlur = 0;
                char.targetX = 0;
                char.targetY = 0;
                char.targetScale = 1;
            }
        });
    });

    // Reset effect when mouse leaves the about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.addEventListener('mouseleave', () => {
            charElements.forEach(char => {
                char.targetBlur = 0;
                char.targetX = 0;
                char.targetY = 0;
                char.targetScale = 1;
            });
        });
    }

    function animateLoop() {
        charElements.forEach(char => {
            char.currentBlur += (char.targetBlur - char.currentBlur) * 0.12;
            char.currentX += (char.targetX - char.currentX) * 0.12;
            char.currentY += (char.targetY - char.currentY) * 0.12;
            char.currentScale += (char.targetScale - char.currentScale) * 0.12;

            let transform = `translate(${char.currentX}px, ${char.currentY}px) scale(${char.currentScale})`;
            
            if (Math.abs(char.currentBlur) > 0.05) {
                char.el.style.filter = `blur(${char.currentBlur}px)`;
            } else {
                char.el.style.filter = 'none';
            }
            
            char.el.style.transform = transform;
        });
        requestAnimationFrame(animateLoop);
    }

    animateLoop();

    // Mobile: schnellere Animation, weniger Delay zwischen Buchstaben
    const charDelay = window.innerWidth > 768 ? 30 : 8;
    setTimeout(() => {
        charElements.forEach((c, i) => {
            setTimeout(() => c.el.classList.add('visible'), i * charDelay);
        });
    }, 100);


    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.5) {
                triggerColumnAnimation();
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: [0, 0.5, 1] });

    textObserver.observe(textEl);
};

function triggerColumnAnimation() {
    const columns = document.querySelectorAll('.sub-text .col');
    
    columns.forEach((col, colIndex) => {
        const lines = col.querySelectorAll('p, h4');
        
        lines.forEach((line, lineIndex) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, (colIndex * 200) + (lineIndex * 80));
        });
    });
}

window.addEventListener('load', () => {
    const gradientBg = document.querySelector('.gradient-bg');
    if (gradientBg) {
        setTimeout(() => {
            gradientBg.classList.add('visible');
        }, 300);
    }
});

// FADE OUT GRADIENT BLOBS ON SCROLL
window.addEventListener('scroll', () => {
    const gradientBg = document.querySelector('.gradient-bg');
    if (!gradientBg) return;
    
    const workSection = document.getElementById('work');
    if (!workSection) return;
    
    const workRect = workSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (workRect.top < windowHeight * 0.7) {
        const fadeStart = windowHeight * 0.7;
        const fadeEnd = windowHeight * 0.3;
        const fadeRange = fadeStart - fadeEnd;
        const currentPos = workRect.top;
        
        if (currentPos <= fadeEnd) {
            gradientBg.style.opacity = 0;
        } else {
            const fadeProgress = (currentPos - fadeEnd) / fadeRange;
            gradientBg.style.opacity = fadeProgress;
        }
    } else {
        gradientBg.style.opacity = 1;
    }
    
    gradientBg.style.transition = 'opacity 0.4s ease';
});
