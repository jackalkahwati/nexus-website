document.addEventListener('DOMContentLoaded', function() {
    // Add a Try Demo button to the site
    const ctaSection = document.querySelector('.cta-buttons');
    if (ctaSection) {
        // Create a new demo button
        const demoButton = document.createElement('a');
        demoButton.href = 'https://nexus-dashboard.pages.dev/login/';
        demoButton.className = 'primary-button';
        demoButton.id = 'try-demo-button';
        demoButton.innerHTML = 'Access Demo';
        demoButton.style.backgroundColor = '#0891b2'; // Teal color to stand out

        // Add it to the CTA section
        ctaSection.prepend(demoButton);

        // Add click event to auto-fill demo credentials
        demoButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Store demo credentials in localStorage so the login page can read them
            localStorage.setItem('autofill_demo', 'true');
            // Navigate to login page
            window.location.href = 'https://nexus-dashboard.pages.dev/login/';
        });
    }

    // Ensure all account buttons go straight to Nexus Core dashboard
    document.querySelectorAll('.account-button').forEach(btn => {
        // Redirect account button to the new dashboard sign-in route
        btn.setAttribute('href', 'https://nexus-dashboard.pages.dev/login/');
    });

    // Login button redirect directly to Nexus Core dashboard without alerts
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Navigate to dashboard sign-in
            window.location.href = 'https://nexus-dashboard.pages.dev/login/';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll-based animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-block, .story-content');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Add initial animation classes
    document.querySelectorAll('.feature-block, .story-content').forEach(element => {
        element.classList.add('fade-up');
    });

    // Customer stories tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const storyContents = document.querySelectorAll('.story-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Hide all story contents
            storyContents.forEach(content => {
                content.style.opacity = '0';
                content.style.display = 'none';
            });

            // Show selected story content with fade animation
            const selectedContent = document.querySelector('.story-content.active');
            if (selectedContent) {
                selectedContent.style.display = 'flex';
                setTimeout(() => {
                    selectedContent.style.opacity = '1';
                }, 50);
            }
        });
    });

    // Mobile menu handling
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            }
        });
    }

    // Hero image parallax effect
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            }
        }, 250);
    });

    // Form submission handling
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Here you would typically send the data to your backend
                // For now, we'll just show a success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';

                contactForm.appendChild(successMessage);
                contactForm.reset();

                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        });
    }

    // Process CTA buttons - redirect without alerts
    document.querySelectorAll('.primary-button, .secondary-button, .feature-link').forEach(button => {
        // No special handling needed - links will work directly
        // We're removing the custom click handlers that showed alerts
    });

    // Testimonial slider rotation
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length) {
        let currentIndex = 0;
        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, 7000);
    }

    /******** Solution Finder Wizard ********/
    const overlay = document.getElementById('sf-overlay');
    const btnNav = document.getElementById('solution-finder-btn');
    const btnHero = document.getElementById('solution-finder-btn-hero');
    const form = document.getElementById('sf-form');
    if (overlay && btnNav && btnHero && form) {
        const steps = Array.from(document.querySelectorAll('.sf-step'));
        let currentStep = 0;
        const showStep = (i) => {
            steps.forEach((s, idx) => s.classList.toggle('hidden', idx !== i));
            currentStep = i;
        };
        const openModal = () => { overlay.classList.remove('hidden'); overlay.style.display = 'flex'; showStep(0); document.getElementById('sf-result').classList.add('hidden'); };
        [btnNav, btnHero].forEach(b=>b.addEventListener('click', e=>{e.preventDefault();openModal();}));
        document.addEventListener('click', e=>{ if(e.target===overlay){ overlay.style.display='none'; overlay.classList.add('hidden'); }});
        document.getElementById('sf-next-1').onclick = () => showStep(1);
        document.getElementById('sf-next-2').onclick = () => showStep(2);
        document.getElementById('sf-prev-2').onclick = () => showStep(0);
        document.getElementById('sf-prev-3').onclick = () => showStep(1);
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());
            let link='#';
            if(data.industry==='logistics') link='solutions.html#logistics';
            else if(data.industry==='automotive') link='solutions.html#automotive';
            else link='solutions.html#transit';
            const result = document.getElementById('sf-result');
            result.innerHTML = `<p>Recommended solution:</p><a href="${link}" class="primary-button">View Solution</a>`;
            result.classList.remove('hidden');
            steps.forEach(s=>s.classList.add('hidden'));
        });
    }

    /******** Code Copy Buttons ********/
    document.querySelectorAll('pre > code').forEach(block=>{
        const pre = block.parentElement;
        pre.classList.add('code-block');
        const btn = document.createElement('button');
        btn.textContent='Copy';
        btn.className='copy-btn';
        btn.onclick=()=>{
            navigator.clipboard.writeText(block.textContent).then(()=>{btn.textContent='Copied!';setTimeout(()=>btn.textContent='Copy',1500);});
        };
        pre.appendChild(btn);
    });

    /******** Simple API Sandbox ********/
    const runBtn = document.getElementById('sandbox-run');
    if (runBtn) {
        const respEl = document.getElementById('sandbox-response');
        runBtn.addEventListener('click', async ()=>{
            const endpoint = document.getElementById('sandbox-endpoint').value;
            try {
                const res = await fetch(`http://localhost:3000${endpoint}`);
                const text = await res.text();
                respEl.textContent = text;
            } catch(err){
                respEl.textContent = 'Error: '+err;
            }
        });
    }

    // Ensure all Login buttons navigate correctly even without JS click handlers
    document.querySelectorAll('#login-button').forEach(btn => {
        btn.setAttribute('href', 'https://nexus-dashboard.pages.dev/login/');
        // Optional: remove id to avoid duplicate IDs after initial use
        btn.removeAttribute('id');
    });
});
