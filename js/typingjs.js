// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (name && email && subject && message) {
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    }
  });
}

// Flip card function (Add .flipped class to flip-card)
function flipCard(btn) {
  const card = btn.closest('.flip-card');
  if (card) {
    card.classList.add('flipped');
  }
}

// Unflip card function (Remove .flipped class)
function unflipCard(btn) {
  const card = btn.closest('.flip-card');
  if (card) {
    card.classList.remove('flipped');
  }
}

// Stop video playback when modal is closed
document.addEventListener('DOMContentLoaded', () => {
  const videoModalEl = document.getElementById('videoModal');
  if (videoModalEl) {
    videoModalEl.addEventListener('hidden.bs.modal', () => {
      const video = document.getElementById('demoVideo');
      if (video) {
        video.pause();
        video.currentTime = 0; // Reset video position to start
      }
    });
  }

  const auraTypeModalEl = document.getElementById('auraTypeVideoModal');
  if (auraTypeModalEl) {
    auraTypeModalEl.addEventListener('hidden.bs.modal', () => {
      const video = document.getElementById('auraTypeVideo');
      if (video) {
        video.pause();
        video.currentTime = 0; // Reset video position to start
      }
    });
  }

  // Interactive skills background watermark and ambient center glow effect
  const skillsSection = document.getElementById('skills');
  const skills = document.querySelectorAll('#skills .skill');
  const glowCenter = document.getElementById('skillsGlowCenter');
  
  if (skillsSection && skills.length > 0) {
    // Create watermark element dynamically if it doesn't exist
    let watermark = skillsSection.querySelector('.skills-bg-watermark');
    if (!watermark) {
      watermark = document.createElement('div');
      watermark.className = 'skills-bg-watermark';
      skillsSection.appendChild(watermark);
    }
    
    // Add event listeners for hover and hold interactions
    skills.forEach(skill => {
      const iconClass = skill.getAttribute('data-icon');
      const glowColor = skill.getAttribute('data-glow');
      
      const activateEffect = () => {
        // Immediately clean up any previous flying giant logos to prevent overlaps when switching quickly
        const existingFlyingLogos = skillsSection.querySelectorAll('.flying-giant-logo');
        existingFlyingLogos.forEach(el => el.remove());

        // Lock the current badge width dynamically to prevent resize flicker
        const currentWidth = skill.offsetWidth;
        skill.style.minWidth = `${currentWidth}px`;

        // Toggle text to icon on the badge itself
        skill.classList.add('active-icon');

        // Pause floating background logos
        skillsSection.classList.add('skills-active-state');
        
        // Show giant watermark (letters spaced out evenly, logo sitting behind center, 90% visible)
        const skillTextEl = skill.querySelector('.skill-text');
        const text = skillTextEl ? skillTextEl.textContent.trim() : skill.textContent.trim();
        const len = text.length;
        
        let fontSize = '8vw';
        if (len <= 3) {
          fontSize = '16vw';
        } else if (len <= 5) {
          fontSize = '13vw';
        } else if (len <= 7) {
          fontSize = '10vw';
        }

        // Render each letter as an independent styled span
        let lettersHTML = '';
        for (let i = 0; i < len; i++) {
          lettersHTML += `<span class="watermark-letter" style="font-size: ${fontSize};">${text[i]}</span>`;
        }

        watermark.innerHTML = lettersHTML;
        watermark.style.setProperty('--watermark-color', glowColor);
        watermark.classList.add('active');
        
        // Activate center ambient glow color (radiating to sides)
        if (glowCenter) {
          glowCenter.style.setProperty('--glow-color', glowColor);
          glowCenter.style.opacity = '0.85'; // High visibility glow radiating from center
        }

        // Cinematic flying giant logo from badge to center
        const rect = skill.getBoundingClientRect();
        const parentRect = skillsSection.getBoundingClientRect();
        const startX = rect.left - parentRect.left + rect.width / 2;
        const startY = rect.top - parentRect.top + rect.height / 2;
        
        const flyingLogo = document.createElement('div');
        flyingLogo.className = 'flying-giant-logo';
        flyingLogo.style.setProperty('--start-x', `${startX}px`);
        flyingLogo.style.setProperty('--start-y', `${startY}px`);
        flyingLogo.style.setProperty('--brand-color', glowColor);
        flyingLogo.innerHTML = `<i class="${iconClass}"></i>`;
        skillsSection.appendChild(flyingLogo);
        
        // Auto-remove after animation finishes (under 2 sec)
        setTimeout(() => {
          flyingLogo.remove();
        }, 2000);
      };
      
      const deactivateEffect = () => {
        // Toggle icon back to text on the badge itself and release width lock
        skill.classList.remove('active-icon');
        skill.style.removeProperty('min-width');

        // Resume floating background logos
        skillsSection.classList.remove('skills-active-state');
        watermark.classList.remove('active');
        
        // Instantly remove the flying giant logo when hover/tap ends so it does not linger in center
        const existingFlyingLogos = skillsSection.querySelectorAll('.flying-giant-logo');
        existingFlyingLogos.forEach(el => el.remove());
        
        // Revert ambient glow to invisible
        if (glowCenter) {
          glowCenter.style.removeProperty('--glow-color');
          glowCenter.style.opacity = '0'; // Completely invisible by default
        }
      };
      
      // Desktop mouse events
      skill.addEventListener('mouseenter', activateEffect);
      skill.addEventListener('mouseleave', deactivateEffect);
      
      // Touch/Hold events
      skill.addEventListener('mousedown', activateEffect);
      skill.addEventListener('mouseup', deactivateEffect);
      skill.addEventListener('touchstart', (e) => {
        activateEffect();
      }, { passive: true });
      skill.addEventListener('touchend', deactivateEffect, { passive: true });
    });

    // Floating logos physics bounce engine
    const floatingLogos = document.querySelectorAll('#skills .floating-logo');
    const logoData = [];
    
    const initLogos = () => {
      const containerWidth = skillsSection.clientWidth;
      const containerHeight = skillsSection.clientHeight;
      
      floatingLogos.forEach((logo, index) => {
        const size = 64; // Appx size of logo (font-size is 64px)
        
        // Setup initial position randomly inside boundaries
        const x = Math.random() * (containerWidth - size);
        const y = Math.random() * (containerHeight - size);
        
        // Velocity vectors (pixels per frame)
        const vx = (Math.random() * 0.4 + 0.2) * (Math.random() < 0.5 ? -1 : 1);
        const vy = (Math.random() * 0.4 + 0.2) * (Math.random() < 0.5 ? -1 : 1);
        
        logoData[index] = {
          element: logo,
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          size: size
        };
        
        logo.style.position = 'absolute';
        logo.style.left = '0';
        logo.style.top = '0';
        logo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    
    initLogos();
    
    window.addEventListener('resize', () => {
      initLogos();
    });
    
    const updatePhysics = () => {
      if (!skillsSection.classList.contains('skills-active-state')) {
        const containerWidth = skillsSection.clientWidth;
        const containerHeight = skillsSection.clientHeight;
        
        logoData.forEach(logo => {
          logo.x += logo.vx;
          logo.y += logo.vy;
          
          // Collision logic with left & right borders
          if (logo.x <= 0) {
            logo.x = 0;
            logo.vx *= -1;
          } else if (logo.x >= containerWidth - logo.size) {
            logo.x = containerWidth - logo.size;
            logo.vx *= -1;
          }
          
          // Collision logic with top & bottom borders
          if (logo.y <= 0) {
            logo.y = 0;
            logo.vy *= -1;
          } else if (logo.y >= containerHeight - logo.size) {
            logo.y = containerHeight - logo.size;
            logo.vy *= -1;
          }
          
          logo.element.style.transform = `translate3d(${logo.x}px, ${logo.y}px, 0)`;
        });
      }
      requestAnimationFrame(updatePhysics);
    };
    
    updatePhysics();
  }

  // Typewriter effect for Hero Subtitle (Looping through multiple skills)
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const phrases = [
      "Full Stack PHP & MySQL Developer",
      "PHP & MySQL Backend Developer",
      "Responsive UI/UX Designer",
      "JavaScript Specialist",
      "Web Application Creator"
    ];
    
    typewriterElement.innerHTML = "";
    
    // Create text container and blinking cursor element
    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typewriter-cursor';
    cursorSpan.innerHTML = '|';
    typewriterElement.appendChild(textSpan);
    typewriterElement.appendChild(cursorSpan);
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        textSpan.innerHTML = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textSpan.innerHTML = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typingSpeed = isDeleting ? 40 : 80; // Deletion is faster than typing
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000; // Hold word on screen for 2s
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Cycle phrases
        typingSpeed = 500; // Small delay before next word starts typing
      }
      
      setTimeout(type, typingSpeed);
    };
    
    setTimeout(type, 500); // Initial delay before animation starts
  }
});