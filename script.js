document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Terminal status rotation
const phrases = [
    "AVAILABLE FOR WORK",
    "OPEN TO COLLABORATION",
    "READY FOR NEW CHALLENGES"
];
let currentPhrase = 0;
const terminalElement = document.querySelector('.terminal-cursor');
function rotatePhrase() {
    currentPhrase = (currentPhrase + 1) % phrases.length;
    terminalElement.textContent = phrases[currentPhrase];
}
setInterval(rotatePhrase, 3000);

// Mobile menu toggle
const menuButton = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuIcon = menuButton.querySelector('i');
menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    } else {
        mobileMenu.classList.add('active');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    }
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    });
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .skill-card, .matrix-item, .project-card, .certificate-card, .interest-item, .nav-dot, .modal-close').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.backgroundColor = 'rgba(255, 0, 255, 0.5)';
        cursorFollower.style.width = '30px';
        cursorFollower.style.height = '30px';
        cursorFollower.style.borderColor = 'var(--neon-pink)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(0, 243, 255, 0.5)';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
        cursorFollower.style.borderColor = 'var(--neon-blue)';
    });
});

// Navigation Dots
const navDots = document.querySelectorAll('.nav-dot');
navDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionId = dot.getAttribute('data-section');
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Update active nav dot on scroll
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) {
            dot.classList.add('active');
        }
    });

    // Fade-in sections on scroll
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
            section.classList.add('visible');
        }
    });
});

// Modal functionality
const viewCertButtons = document.querySelectorAll('.view-cert');
const modal = document.getElementById('cert-modal');
const modalTitle = document.getElementById('modal-title');
const modalIssuer = document.getElementById('modal-issuer');
const modalImage = document.getElementById('modal-image');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.querySelector('.modal-close');

viewCertButtons.forEach(button => {
    button.addEventListener('click', () => {
        modalTitle.textContent = button.getAttribute('data-cert-title');
        modalIssuer.textContent = button.getAttribute('data-cert-issuer');
        modalImage.src = button.getAttribute('data-cert-image');
        modalDesc.textContent = button.getAttribute('data-cert-desc');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        modal.focus();
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
});

// Particle Background
function createParticles() {
    const container = document.getElementById('particles-js');
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 3;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        container.appendChild(particle);
    }
}

// Starfield Background
function createStarfield(elementId, starCount, sizeRange, speed) {
    const container = document.getElementById(elementId);
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * sizeRange[1] + sizeRange[0];
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.8 + 0.2;
        const delay = Math.random() * 5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.opacity = opacity;
        star.style.animation = `twinkle ${speed}s ease-in-out ${delay}s infinite alternate`;
        container.appendChild(star);
    }
}

// Parallax effect
window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const farStars = document.getElementById('farStars');
    const midStars = document.getElementById('midStars');
    farStars.style.transform = `translateZ(-200px) scale(1.5) translateX(${x * 20}px) translateY(${y * 20}px)`;
    midStars.style.transform = `translateZ(-100px) scale(1.2) translateX(${x * 40}px) translateY(${y * 40}px)`;
});

// Initialize effects
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createStarfield('farStars', 100, [1, 2], 5);
    createStarfield('midStars', 50, [2, 3], 3);

    // Trigger section visibility on load
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
            section.classList.add('visible');
        }
    });
});

// New JavaScript for form submission handling
const contactForm = document.getElementById('contact-form');
const formStatusMessage = document.getElementById('form-status-message');

contactForm.addEventListener('submit', async function(event) {
    // Prevent the default form submission that causes a page redirect
    event.preventDefault();

    // Get the form data
    const formData = new FormData(this);

    // Get the form action URL
    const formAction = this.getAttribute('action');

    // Display a "sending" message
    formStatusMessage.textContent = 'Sending message...';
    formStatusMessage.style.color = '#fff';

    try {
        const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formStatusMessage.textContent = 'Message sent successfully!';
            formStatusMessage.style.color = 'var(--neon-blue)';
            contactForm.reset(); // Clear the form fields
        } else {
            formStatusMessage.textContent = 'An error occurred. Please try again.';
            formStatusMessage.style.color = 'var(--neon-pink)';
        }
    } catch (error) {
        formStatusMessage.textContent = 'An error occurred. Please check your network connection.';
        formStatusMessage.style.color = 'var(--neon-pink)';
    }
});