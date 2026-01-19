/**
 * FLOKENES MASKIN SERVICE - Main JavaScript
 * Handles mobile navigation, form submission, and interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!menuToggle || !mobileNav) return;

        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('menu-toggle--active');
            mobileNav.classList.toggle('mobile-nav--active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileNav.classList.contains('mobile-nav--active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav__link');
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('menu-toggle--active');
                mobileNav.classList.remove('mobile-nav--active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('menu-toggle--active');
                mobileNav.classList.remove('mobile-nav--active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Contact Form Handling
     */
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.form-submit');
            const originalBtnText = submitBtn.textContent;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';

            // Collect form data
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                phone: contactForm.phone.value.trim(),
                address: contactForm.address ? contactForm.address.value.trim() : '',
                jobType: contactForm.jobType ? contactForm.jobType.value : '',
                description: contactForm.description.value.trim(),
                wantSiteVisit: contactForm.siteVisit ? contactForm.siteVisit.checked : false,
                timestamp: new Date().toISOString()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showMessage('error', 'Vennligst fyll ut alle påkrevde felt.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            // Validate email format
            if (!isValidEmail(formData.email)) {
                showMessage('error', 'Vennligst oppgi en gyldig e-postadresse.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                // For now, we'll simulate a successful submission
                // In production, this would send to Resend API or a backend endpoint
                await simulateFormSubmission(formData);

                showMessage('success', 'Takk for din henvendelse! Vi har mottatt meldingen din og tar kontakt så snart som mulig - vanligvis samme dag i arbeidstiden.');
                contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                showMessage('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte på 900 12 345.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    /**
     * Simulate form submission (replace with actual API call in production)
     */
    function simulateFormSubmission(data) {
        return new Promise(function(resolve, reject) {
            // Simulate network delay
            setTimeout(function() {
                // Log form data for debugging
                console.log('Form submitted:', data);

                // In production, you would send this to your backend or Resend API:
                /*
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer YOUR_API_KEY',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'noreply@flokenesmaskin.no',
                        to: 'post@flokenesmaskin.no',
                        subject: `Ny henvendelse fra ${data.name}`,
                        html: buildEmailHTML(data)
                    })
                });
                */

                resolve({ success: true });
            }, 1000);
        });
    }

    /**
     * Build email HTML content
     */
    function buildEmailHTML(data) {
        return `
            <h2>Ny henvendelse fra nettsiden</h2>
            <p><strong>Navn:</strong> ${data.name}</p>
            <p><strong>E-post:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone}</p>
            ${data.address ? `<p><strong>Adresse/Område:</strong> ${data.address}</p>` : ''}
            ${data.jobType ? `<p><strong>Type jobb:</strong> ${data.jobType}</p>` : ''}
            <p><strong>Beskrivelse:</strong></p>
            <p>${data.description}</p>
            <p><strong>Ønsker befaring:</strong> ${data.wantSiteVisit ? 'Ja' : 'Nei'}</p>
            <hr>
            <p><small>Sendt: ${new Date(data.timestamp).toLocaleString('nb-NO')}</small></p>
        `;
    }

    /**
     * Show form message
     */
    function showMessage(type, message) {
        if (!formMessage) return;

        formMessage.className = 'form-message form-message--visible';
        formMessage.classList.add(type === 'success' ? 'form-message--success' : 'form-message--error');
        formMessage.textContent = message;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(function() {
                formMessage.classList.remove('form-message--visible');
            }, 10000);
        }
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Header scroll effect
     */
    function initHeaderScroll() {
        var header = document.querySelector('.header');
        if (!header) return;

        var lastScroll = 0;

        window.addEventListener('scroll', function() {
            var currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Lazy load images
     */
    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            var lazyImages = document.querySelectorAll('img[data-src]');

            var imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Phone number click tracking (for analytics)
     */
    function initPhoneTracking() {
        document.querySelectorAll('a[href^="tel:"]').forEach(function(phoneLink) {
            phoneLink.addEventListener('click', function() {
                // Track phone click (can be extended with Google Analytics, etc.)
                console.log('Phone call initiated:', this.href);

                // If using Google Analytics:
                // gtag('event', 'click', { event_category: 'Contact', event_label: 'Phone Call' });
            });
        });
    }

    /**
     * Initialize all functionality
     */
    function init() {
        initMobileNav();
        initContactForm();
        initSmoothScroll();
        initHeaderScroll();
        initLazyLoad();
        initPhoneTracking();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
