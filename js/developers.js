document.addEventListener('DOMContentLoaded', function() {
    // Tab switching for section navigation
    const navItems = document.querySelectorAll('.dev-nav-item');
    const sections = document.querySelectorAll('.dev-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Get the target section from the href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Make target section active
            if (targetSection) {
                targetSection.classList.add('active-section');
                // Scroll to the top of the section with a small offset
                window.scrollTo({
                    top: targetSection.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // API documentation code tabs
    const codeTabs = document.querySelectorAll('.code-tab');
    const codePanels = document.querySelectorAll('.code-panel');
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panels
            codeTabs.forEach(t => t.classList.remove('active'));
            codePanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the target panel
            const lang = this.getAttribute('data-lang');
            const targetPanel = document.getElementById(`${lang}-panel`);
            
            // Make target panel active
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // API search functionality
    const apiSearchInput = document.querySelector('.api-search-input');
    
    if (apiSearchInput) {
        apiSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const apiItems = document.querySelectorAll('.api-group ul li a');
            
            apiItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                const listItem = item.parentElement;
                
                if (itemText.includes(searchTerm)) {
                    listItem.style.display = 'block';
                } else {
                    listItem.style.display = 'none';
                }
            });
            
            // Show/hide group headers based on visible items
            const apiGroups = document.querySelectorAll('.api-group');
            
            apiGroups.forEach(group => {
                const visibleItems = group.querySelectorAll('ul li[style="display: block"]').length;
                const groupHeader = group.querySelector('h4');
                
                if (visibleItems === 0 && searchTerm !== '') {
                    groupHeader.style.display = 'none';
                } else {
                    groupHeader.style.display = 'block';
                }
            });
        });
    }
    
    // Copy code examples
    const copyButtons = document.querySelectorAll('.api-action-btn');
    
    copyButtons.forEach(button => {
        if (button.innerHTML.includes('copy')) {
            button.addEventListener('click', function() {
                // Find closest code block
                const codeElement = this.closest('.api-content').querySelector('pre code');
                
                if (codeElement) {
                    // Create a temporary textarea element
                    const textarea = document.createElement('textarea');
                    textarea.value = codeElement.textContent;
                    document.body.appendChild(textarea);
                    
                    // Select and copy the text
                    textarea.select();
                    document.execCommand('copy');
                    
                    // Remove the textarea
                    document.body.removeChild(textarea);
                    
                    // Show a success message
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    
                    // Reset the button text after a delay
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                }
            });
        }
    });
    
    // Try It button functionality
    const tryButtons = document.querySelectorAll('.api-action-btn');
    
    tryButtons.forEach(button => {
        if (button.innerHTML.includes('Try It')) {
            button.addEventListener('click', function() {
                // Redirect to API playground section
                const playground = document.getElementById('playground');
                
                if (playground) {
                    // Update navigation
                    navItems.forEach(i => i.classList.remove('active'));
                    document.querySelector('a[href="#playground"]').classList.add('active');
                    
                    // Update sections
                    sections.forEach(s => s.classList.remove('active-section'));
                    playground.classList.add('active-section');
                    
                    // Scroll to the playground
                    window.scrollTo({
                        top: playground.offsetTop - 120,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Sticky navigation handling
    const devNav = document.querySelector('.dev-nav');
    const header = document.querySelector('header');
    
    if (devNav && header) {
        const devNavTop = devNav.offsetTop;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > devNavTop) {
                devNav.classList.add('sticky');
                devNav.style.top = header.offsetHeight + 'px';
            } else {
                devNav.classList.remove('sticky');
                devNav.style.top = '0';
            }
        });
    }
    
    // API Playground Editor Tabs
    const editorTabs = document.querySelectorAll('.editor-tab');
    const editorContents = document.querySelectorAll('.editor-content');
    
    editorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            editorTabs.forEach(t => t.classList.remove('active'));
            editorContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the target content
            const targetTab = this.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab + '-editor');
            
            // Make target content active
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Parameter Editor Functionality
    const addParamButtons = document.querySelectorAll('.add-param');
    
    addParamButtons.forEach(button => {
        button.addEventListener('click', function() {
            const paramEditor = this.parentElement;
            const paramRow = paramEditor.querySelector('.param-row:not(.header)');
            
            if (paramRow) {
                // Clone the row
                const newRow = paramRow.cloneNode(true);
                
                // Clear input values
                newRow.querySelectorAll('input').forEach(input => {
                    input.value = '';
                    input.placeholder = paramRow.querySelectorAll('input')[0].placeholder;
                });
                
                // Add delete button functionality
                const deleteButton = newRow.querySelector('.delete-param');
                if (deleteButton) {
                    deleteButton.addEventListener('click', function() {
                        newRow.remove();
                    });
                }
                
                // Insert before the add button
                paramEditor.insertBefore(newRow, this);
            }
        });
    });
    
    // Add functionality to existing delete buttons
    const deleteParamButtons = document.querySelectorAll('.delete-param');
    
    deleteParamButtons.forEach(button => {
        button.addEventListener('click', function() {
            const paramRow = this.closest('.param-row');
            
            // Only delete if there's more than one parameter row (excluding header)
            const paramEditor = this.closest('.param-editor');
            const paramRows = paramEditor.querySelectorAll('.param-row:not(.header)');
            
            if (paramRows.length > 1) {
                paramRow.remove();
            } else {
                // Clear the values instead of deleting the last row
                paramRow.querySelectorAll('input').forEach(input => {
                    input.value = '';
                });
            }
        });
    });
    
    // Playground Send Request Button
    const sendRequestButton = document.querySelector('.playground-button');
    
    if (sendRequestButton) {
        sendRequestButton.addEventListener('click', function() {
            // Show simple loading animation
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API request with timeout
            setTimeout(() => {
                // Reset button
                this.innerHTML = 'Send Request';
                
                // Show response section
                const response = document.querySelector('.playground-response');
                if (response) {
                    response.style.display = 'block';
                    
                    // Highlight code
                    if (window.hljs) {
                        const codeElement = response.querySelector('pre code');
                        if (codeElement) {
                            hljs.highlightElement(codeElement);
                        }
                    }
                }
            }, 800);
        });
    }
    
    // Playground API Endpoints Navigation
    const endpointLinks = document.querySelectorAll('.endpoint-category ul li a');
    
    endpointLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            endpointLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Get endpoint information from the link text
            const endpointText = this.textContent.trim();
            
            // Update header
            const header = document.querySelector('.playground-header h3');
            if (header) {
                // Get the category and prepare a HTTP method based on the endpoint
                const category = this.closest('.endpoint-category').querySelector('h4').textContent;
                let method = 'GET';
                
                if (endpointText.startsWith('Create') || endpointText.startsWith('Add') || endpointText === 'Get Token') {
                    method = 'POST';
                } else if (endpointText.startsWith('Update') || endpointText.startsWith('Edit')) {
                    method = 'PUT';
                } else if (endpointText.startsWith('Delete') || endpointText.startsWith('Remove')) {
                    method = 'DELETE';
                }
                
                // Update method select
                const methodSelect = document.querySelector('.http-method-select');
                if (methodSelect) {
                    for (let i = 0; i < methodSelect.options.length; i++) {
                        if (methodSelect.options[i].value === method) {
                            methodSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                
                // Update header text
                header.textContent = `${category.charAt(0) + category.slice(1).toLowerCase()} - ${endpointText}`;
                
                // Update URL based on endpoint
                const urlInput = document.querySelector('.endpoint-url');
                if (urlInput) {
                    let endpoint = endpointText.toLowerCase().replace(/\s+/g, '-');
                    let url = `https://api.lattis-nexus.com/v2/${category.toLowerCase().replace(/\s+/g, '-')}`;
                    
                    if (endpoint === 'get-token') {
                        url = 'https://api.lattis-nexus.com/v2/auth/token';
                    } else if (endpoint.includes('vehicle')) {
                        url = `https://api.lattis-nexus.com/v2/vehicles`;
                        if (endpoint.includes('get-vehicle')) {
                            url += '/{vehicle_id}';
                        }
                    } else if (endpoint.includes('location')) {
                        url = `https://api.lattis-nexus.com/v2/vehicles/{vehicle_id}/location`;
                    } else if (endpoint.includes('route')) {
                        url = `https://api.lattis-nexus.com/v2/routing/routes`;
                    } else if (category.includes('ANALYTICS')) {
                        url = `https://api.lattis-nexus.com/v2/analytics/${endpoint}`;
                    }
                    
                    urlInput.value = url;
                }
            }
        });
    });
});