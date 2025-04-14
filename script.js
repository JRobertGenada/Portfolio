const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');
const themeToggle = document.querySelector('.theme-toggle');
const contactForm = document.getElementById('contactForm');
const skillProgressBars = document.querySelectorAll('.skill-progress');

const changingText = document.getElementById('changing-text');
const texts = ['BSIT Student', 'Web Developer', 'Gamer', 'Tech Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeNextText() {
  const currentText = texts[textIndex];
  
    if (isDeleting) {
        changingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;   } else {
        changingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;   }
  
    if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typingDelay = 1000;   } 
    else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;     typingDelay = 500;   }
  
    setTimeout(typeNextText, typingDelay);
}

function isInViewport(element, buffer = 100) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + buffer &&
    rect.bottom >= 0 - buffer &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) + buffer &&
    rect.right >= 0 - buffer
  );
}

function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
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

typeNextText();

const animatedSkills = new Set();

window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 300) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
  
    if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
    skillProgressBars.forEach((bar, index) => {
    if (isInViewport(bar.parentElement) && !animatedSkills.has(index)) {
      animatedSkills.add(index);
      const parentCard = bar.closest('.skill-card');
      
            if (parentCard.classList.contains('skill-csharp')) {
        bar.style.width = '90%';
      } else if (parentCard.classList.contains('skill-js')) {
        bar.style.width = '85%';
      } else if (parentCard.classList.contains('skill-html')) {
        bar.style.width = '95%';
      } else if (parentCard.classList.contains('skill-css')) {
        bar.style.width = '90%';
      } else if (parentCard.classList.contains('skill-canva')) {
        bar.style.width = '80%';
      } else if (parentCard.classList.contains('skill-figma')) {
        bar.style.width = '75%';
      }
    }
  });
}, 10));

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('nav-active');
  
    document.body.classList.toggle('menu-open');
});

navLinksItems.forEach(item => {
  item.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('nav-active');
    document.body.classList.remove('menu-open');
  });
});

let isLightMode = localStorage.getItem('lightMode') === 'true';

if (isLightMode) {
  document.body.classList.add('light-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  isLightMode = !isLightMode;
  document.body.classList.toggle('light-mode');
  
    if (isLightMode) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  
  localStorage.setItem('lightMode', isLightMode);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - header.offsetHeight,
        behavior: 'smooth'
      });
    }
  });
});

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = this.querySelector('#name').value;
  const email = this.querySelector('#email').value;
  const subject = this.querySelector('#subject').value;
  const message = this.querySelector('#message').value;
  let isValid = true;
  
    document.querySelectorAll('.error-message').forEach(err => err.remove());
  document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
  
    if (!name.trim()) {
    isValid = false;
    showError(this.querySelector('#name'), 'Name is required');
  }
  
  if (!email.trim() || !email.includes('@')) {
    isValid = false;
    showError(this.querySelector('#email'), 'Valid email is required');
  }
  
  if (!subject.trim()) {
    isValid = false;
    showError(this.querySelector('#subject'), 'Subject is required');
  }
  
  if (!message.trim()) {
    isValid = false;
    showError(this.querySelector('#message'), 'Message is required');
  }
  
  if (isValid) {
        const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
        setTimeout(() => {
      this.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showMessage('Message sent successfully!', 'success');
    }, 1500);
  }
});

function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.classList.add('has-error');
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  
  formGroup.appendChild(errorDiv);
  
    setTimeout(() => {
    if (formGroup.contains(errorDiv)) {
      formGroup.removeChild(errorDiv);
      formGroup.classList.remove('has-error');
    }
  }, 3000);
}


function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  document.body.appendChild(messageDiv);
  
  
  setTimeout(() => messageDiv.classList.add('show'), 10);
  
  
  setTimeout(() => {
    messageDiv.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(messageDiv)) {
        document.body.removeChild(messageDiv);
      }
    }, 300);
  }, 3000);
}


if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
}