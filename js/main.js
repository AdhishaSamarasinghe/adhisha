// Modern JavaScript for Interactive Personal Website

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contactForm');

// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing-text');
    const originalText = typingElement.innerHTML;
    typeWriter(typingElement, originalText.replace(/<[^>]*>/g, ''), 80);
});

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate stats counters
            if (entry.target.classList.contains('stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    animateCounter(stat, target);
                });
            }
            
            // Add animation classes
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.stats, .skill-category, .project-card');
    animateElements.forEach(el => observer.observe(el));
});

// Particles animation for hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float ${3 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 4}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}

// Contact form handling with multiple storage options
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create submission object
    const submission = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random().toString(36).substr(2, 9)
    };
    
    // Store submission locally
    storeSubmissionLocally(submission);
    
    // Send email (if EmailJS is configured)
    sendEmailSubmission(submission);
    
    // Show success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
});

// Store submissions in browser's local storage
function storeSubmissionLocally(submission) {
    try {
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        console.log('📩 Contact submission stored locally:', submission);
    } catch (error) {
        console.error('Error storing submission:', error);
    }
}

// Send email using EmailJS (requires setup)
function sendEmailSubmission(submission) {
    // This requires EmailJS setup - see instructions below
    if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: submission.name,
            from_email: submission.email,
            subject: submission.subject,
            message: submission.message,
            to_email: 'adhishanilhara@gmail.com'
        }).then(() => {
            console.log('✅ Email sent successfully');
        }).catch((error) => {
            console.error('❌ Email send failed:', error);
        });
    }
}

// Function to view all submissions (for testing)
function viewSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    console.table(submissions);
    return submissions;
}

// Function to download submissions as JSON
function downloadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'contact-submissions.json';
    link.click();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// Smooth reveal animations for sections
function revealSection() {
    const reveals = document.querySelectorAll('.section-title, .about-text, .project-card');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('animate-in');
        }
    });
}

window.addEventListener('scroll', revealSection);

// Initialize particles
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
});

// Skills hover effect
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Project card tilt effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
});

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trailElements = [];

function createCursorTrail() {
    for (let i = 0; i < 10; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i * 0.1};
            transform: scale(${1 - i * 0.1});
        `;
        document.body.appendChild(trail);
        trailElements.push(trail);
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrail() {
    trailElements.forEach((trail, index) => {
        const factor = index / trailElements.length;
        trail.style.left = mouseX - 3 + Math.sin(Date.now() * 0.01 + index) * 10 * factor + 'px';
        trail.style.top = mouseY - 3 + Math.cos(Date.now() * 0.01 + index) * 10 * factor + 'px';
    });
    requestAnimationFrame(animateTrail);
}

// Initialize cursor trail
document.addEventListener('DOMContentLoaded', () => {
    createCursorTrail();
    animateTrail();
});

// Admin Panel Functions
function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const container = document.getElementById('submissions-container');
    
    if (submissions.length === 0) {
        container.innerHTML = '<div class="no-submissions">No submissions yet.</div>';
        return;
    }
    
    container.innerHTML = submissions.map(submission => `
        <div class="submission-card">
            <div class="submission-header">
                <div class="submission-meta">
                    <strong>ID:</strong> ${submission.id}<br>
                    <strong>Date:</strong> ${new Date(submission.timestamp).toLocaleString()}
                </div>
                <button class="btn btn-small btn-outline" onclick="deleteSubmission('${submission.id}')">Delete</button>
            </div>
            <div class="submission-content">
                <h4>${submission.subject}</h4>
                <p><strong>From:</strong> ${submission.name} (${submission.email})</p>
                <div class="submission-message">
                    ${submission.message}
                </div>
            </div>
        </div>
    `).join('');
}

function clearSubmissions() {
    if (confirm('Are you sure you want to delete all submissions?')) {
        localStorage.removeItem('contactSubmissions');
        loadSubmissions();
        showNotification('All submissions cleared!', 'info');
    }
}

function deleteSubmission(id) {
    if (confirm('Delete this submission?')) {
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions = submissions.filter(sub => sub.id !== id);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        loadSubmissions();
        showNotification('Submission deleted!', 'info');
    }
}

function toggleAdminPanel() {
    const adminPanel = document.getElementById('admin');
    if (adminPanel.style.display === 'none') {
        adminPanel.style.display = 'block';
        loadSubmissions();
        adminPanel.scrollIntoView({ behavior: 'smooth' });
    } else {
        adminPanel.style.display = 'none';
    }
}

// Add admin toggle button
document.addEventListener('DOMContentLoaded', () => {
    const adminToggle = document.createElement('button');
    adminToggle.className = 'admin-toggle';
    adminToggle.innerHTML = '👤 Admin';
    adminToggle.onclick = toggleAdminPanel;
    document.body.appendChild(adminToggle);
});

console.log('🚀 Personal Website Loaded Successfully!');
console.log('✨ Interactive features enabled');
console.log('🎨 Modern animations activated');
