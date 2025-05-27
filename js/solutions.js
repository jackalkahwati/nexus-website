document.addEventListener('DOMContentLoaded', function() {
    // Solutions navigation functionality
    const navItems = document.querySelectorAll('.solution-nav-item');
    const solutionSections = document.querySelectorAll('.solution-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            solutionSections.forEach(section => {
                section.classList.remove('active-section');
            });
            
            // Show target section
            document.getElementById(targetId).classList.add('active-section');
            
            // Smooth scroll to section
            window.scrollTo({
                top: document.getElementById(targetId).offsetTop - 150,
                behavior: 'smooth'
            });
        });
    });
    
    // Sticky navigation highlight based on scroll position
    window.addEventListener('scroll', function() {
        // Only run if there are sections
        if (solutionSections.length === 0) return;
        
        // Get current scroll position
        const scrollPosition = window.scrollY + 200; // Adding offset for the sticky header
        
        // Find the current section in view
        let currentSection = null;
        
        solutionSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active nav item
        if (currentSection) {
            navItems.forEach(item => {
                item.classList.remove('active');
                
                if (item.getAttribute('href') === `#${currentSection}`) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Mobile navigation handling
    const solutionsNav = document.querySelector('.solutions-nav');
    
    if (solutionsNav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                solutionsNav.classList.add('sticky');
            } else {
                solutionsNav.classList.remove('sticky');
            }
        });
    }
    
    // Case study link animations
    const caseStudyLinks = document.querySelectorAll('.case-study-link');
    
    caseStudyLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });
});