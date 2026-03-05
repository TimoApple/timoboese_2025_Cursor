/* js/text.js */


window.initLiquidText = function() {
    const textEl = document.getElementById('dynamic-text');
    const svgDefs = document.getElementById('svg-defs');
    
    if (!textEl || !svgDefs) return;


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
            wordSpan.appendChild(span);


            const index = wIndex * 100 + cIndex;
            const filterId = `blur-${index}`;


            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', filterId);
            filter.setAttribute('color-interpolation-filters', 'linearRGB');
            filter.setAttribute('x', '-50%');
            filter.setAttribute('y', '-50%');
            filter.setAttribute('width', '200%');
            filter.setAttribute('height', '200%');
            filter.innerHTML = `<feGaussianBlur in="SourceGraphic" stdDeviation="0"/>`;
            svgDefs.appendChild(filter);


            charElements.push({
                el: span,
                filter: filter.querySelector('feGaussianBlur'),
                targetBlur: 0, currentBlur: 0,
                targetX: 0, currentX: 0,
                targetY: 0, currentY: 0,
                targetScale: 1, currentScale: 1
            });


            span.style.filter = `url(#${filterId})`;
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
            const maxDistance = 220;


            if (distance < maxDistance) {
                const influence = Math.pow(1 - (distance / maxDistance), 4);
                char.targetBlur = influence * 8;
                const pushStrength = influence * 25;
                const angle = Math.atan2(dy, dx);
                char.targetX = -Math.cos(angle) * pushStrength;
                char.targetY = -Math.sin(angle) * pushStrength;
                char.targetScale = 1 + (influence * 0.1);
            } else {
                char.targetBlur = 0;
                char.targetX = 0;
                char.targetY = 0;
                char.targetScale = 1;
            }
        });
    });


    function animateLoop() {
        charElements.forEach(char => {
            char.currentBlur += (char.targetBlur - char.currentBlur) * 0.18;
            char.currentX += (char.targetX - char.currentX) * 0.18;
            char.currentY += (char.targetY - char.currentY) * 0.18;
            char.currentScale += (char.targetScale - char.currentScale) * 0.18;


            if (Math.abs(char.currentBlur) > 0.05) {
                char.filter.setAttribute('stdDeviation', char.currentBlur);
            } else {
                char.filter.setAttribute('stdDeviation', '0');
            }


            char.el.style.transform = `translate(${char.currentX}px, ${char.currentY}px) scale(${char.currentScale})`;
        });
        requestAnimationFrame(animateLoop);
    }


    animateLoop();


    setTimeout(() => {
        charElements.forEach((c, i) => {
            setTimeout(() => c.el.classList.add('visible'), i * 30);
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
    
    // Start fading when work section enters bottom half of screen
    // Fully faded when work section reaches 30% from top
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
