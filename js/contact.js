document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'company', 'subject', 'message', 'privacy'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                const value = formValues[field];
                
                if (!value || value.trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ff4d4d';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formValues.email)) {
                isValid = false;
                document.getElementById('email').style.borderColor = '#ff4d4d';
            }
            
            if (isValid) {
                // In a real implementation, you would send the data to a server
                // For this demo, we'll just simulate a successful submission
                
                // Disable submit button and show loading state
                const submitButton = contactForm.querySelector('.submit-button');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                // Simulate API call
                setTimeout(() => {
                    // Create success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = `
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Message Sent!</h3>
                        <p>Thank you for contacting us. We'll get back to you shortly.</p>
                    `;
                    
                    // Replace form with success message
                    contactForm.style.opacity = '0';
                    
                    setTimeout(() => {
                        contactForm.parentNode.replaceChild(successMessage, contactForm);
                        successMessage.style.opacity = '0';
                        
                        setTimeout(() => {
                            successMessage.style.opacity = '1';
                        }, 50);
                    }, 300);
                    
                }, 1500);
            }
        });
    }
    
    // Form field animations
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    formInputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        // Blur effect
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            
            // Add 'filled' class if input has value
            if (this.value.trim() !== '') {
                this.parentNode.classList.add('filled');
            } else {
                this.parentNode.classList.remove('filled');
            }
        });
        
        // Check initial state for pre-filled inputs
        if (input.value.trim() !== '') {
            input.parentNode.classList.add('filled');
        }
    });
    
    // Add form styles
    const formStyle = document.createElement('style');
    formStyle.textContent = `
        .form-group.focused label {
            color: var(--primary-color);
        }
        
        .form-success-message {
            background-color: rgba(0, 150, 255, 0.1);
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            transition: opacity 0.3s ease;
        }
        
        .success-icon {
            font-size: 4rem;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
        }
        
        .form-success-message h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: white;
        }
        
        .form-success-message p {
            font-size: 1.1rem;
            color: var(--light-text);
        }
    `;
    document.head.appendChild(formStyle);
});