// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initAudioPlayer();
    initEpisodeTabs();
    initEpisodesToggle();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileNavigation();
    optimizePerformance();
});

/* ================================
   MOBILE NAVIGATION
   ================================ */
function initMobileNavigation() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

/* ================================
   EPISODES TOGGLE FUNCTIONALITY
   ================================ */
function initEpisodesToggle() {
    // This function is called from HTML onclick
}

function toggleEpisodes(seasonId) {
    const hiddenEpisodes = document.getElementById(`${seasonId}-hidden`);
    const button = event.target;
    
    if (hiddenEpisodes.classList.contains('show')) {
        hiddenEpisodes.classList.remove('show');
        button.textContent = 'See More Episodes';
    } else {
        hiddenEpisodes.classList.add('show');
        button.textContent = 'Show Less';
    }
}

/* ================================
   AUDIO PLAYER FUNCTIONALITY
   ================================ */
function initAudioPlayer() {
    const audio = document.getElementById('welcomeAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressHandle = document.getElementById('progressHandle');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');

    let isPlaying = false;
    let isDragging = false;

    // Set initial volume
    audio.volume = 0.5;

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', togglePlayPause);

    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.setAttribute('aria-label', 'Play welcome message');
        } else {
            audio.play().catch(error => {
                console.log('Audio play failed:', error);
                showAudioError();
            });
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Pause welcome message');
        }
        isPlaying = !isPlaying;
    }

    // Audio event listeners
    audio.addEventListener('loadedmetadata', function() {
        durationSpan.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function() {
        if (!isDragging) {
            updateProgress();
        }
    });

    audio.addEventListener('ended', function() {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.setAttribute('aria-label', 'Play welcome message');
        progressBar.style.width = '0%';
        progressHandle.style.left = '0%';
        currentTimeSpan.textContent = '0:00';
    });

    // Progress bar functionality
    progressContainer.addEventListener('click', function(e) {
        if (!audio.duration) return;
        
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * audio.duration;
        
        audio.currentTime = newTime;
        updateProgress();
    });

    // Progress handle dragging
    progressHandle.addEventListener('mousedown', startDrag);
    progressHandle.addEventListener('touchstart', startDrag, { passive: true });

    function startDrag(e) {
        isDragging = true;
        document.addEventListener('mousemove', dragProgress);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', dragProgress, { passive: true });
        document.addEventListener('touchend', stopDrag);
        e.preventDefault();
    }

    function dragProgress(e) {
        if (!isDragging || !audio.duration) return;

        const rect = progressContainer.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        let percent = (clientX - rect.left) / rect.width;
        
        percent = Math.max(0, Math.min(1, percent));
        
        const newTime = percent * audio.duration;
        audio.currentTime = newTime;
        updateProgress();
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', dragProgress);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', dragProgress);
        document.removeEventListener('touchend', stopDrag);
    }

    // Volume control
    volumeSlider.addEventListener('input', function() {
        audio.volume = volumeSlider.value / 100;
    });

    // Update progress display
    function updateProgress() {
        if (!audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    }

    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Show audio error
    function showAudioError() {
        playPauseBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        playPauseBtn.setAttribute('aria-label', 'Audio unavailable');
        playPauseBtn.style.background = 'var(--primary-blue)';
    }
}

/* ================================
   EPISODES TABS FUNCTIONALITY
   ================================ */
function initEpisodeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const seasonContents = document.querySelectorAll('.season-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const season = this.getAttribute('data-season');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            seasonContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`season-${season}`).classList.add('active');
            
            // Animate the content change
            const activeContent = document.getElementById(`season-${season}`);
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
                activeContent.style.transition = 'all 0.3s ease';
            }, 50);
        });
    });
}

/* ================================
   CONTACT FORM FUNCTIONALITY
   ================================ */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'message'));

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isMessageValid = validateField(messageInput, 'message');
        
        if (isNameValid && isEmailValid && isMessageValid) {
            submitForm();
        }
    }

    function validateField(field, type) {
        const errorElement = document.getElementById(`${type}-error`);
        let isValid = true;
        let errorMessage = '';

        // Clear previous styles
        field.style.borderColor = '#e2e8f0';
        errorElement.style.display = 'none';

        switch (type) {
            case 'name':
                if (field.value.trim().length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'message':
                if (field.value.trim().length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            field.style.borderColor = '#ef4444';
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }

        return isValid;
    }

    function submitForm() {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Create FormData object
        const formData = new FormData(form);

        // Simulate form submission (replace with actual Formspree submission)
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showSuccessMessage();
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showErrorMessage();
        })
        .finally(() => {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
                <i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.
            </div>
        `;
        
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="background: #ef4444; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
                <i class="fas fa-exclamation-triangle"></i> There was an error sending your message. Please try again.
            </div>
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

/* ================================
   SCROLL ANIMATIONS
   ================================ */
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(`
        .about-content,
        .social-link,
        .episode-card,
        .external-link,
        .review-card,
        .sponsor-card,
        .contact-form
    `);

    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });

    // Stagger animation for grid items
    const gridContainers = document.querySelectorAll('.social-links, .episodes-grid, .reviews-grid, .sponsors-grid');
    
    gridContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
        });
    });
}

/* ================================
   PERFORMANCE OPTIMIZATIONS
   ================================ */
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy-load');
            imageObserver.observe(img);
        });
    }

    // Optimize scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // Preload critical resources
    const criticalImages = [
        'images/ktrplogo.jpg',
        'images/hostspicture.jpg',
        'images/podcastbanner.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/* ================================
   SMOOTH SCROLLING
   ================================ */
function initSmoothScrolling() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Add focus indicators for keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-blue) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

/* ================================
   ERROR HANDLING & FALLBACKS
   ================================ */

// Global error handler
window.addEventListener('error', function(e) {
    console.warn('JavaScript error handled gracefully');
    
    // Graceful degradation for critical features
    if (e.error && e.error.message.includes('audio')) {
        const audioPlayer = document.querySelector('.custom-audio-player');
        if (audioPlayer) {
            audioPlayer.innerHTML = '<p style="text-align: center; color: var(--gray-medium);">Audio player temporarily unavailable</p>';
        }
    }
});