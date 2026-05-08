/* ============================================================
   HSC ICT Solution — Main JavaScript
   Contains: Loading, Navbar, Matrix Rain, Animations, Counters,
             Slider, FAQ, Form Validation, Scroll Effects
   ============================================================ */

/* ---- LOADING SCREEN ---- */
window.addEventListener('load', function () {
  setTimeout(function () {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

/* ---- SCROLL PROGRESS BAR ---- */
window.addEventListener('scroll', function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const scrollTop    = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  bar.style.width    = (scrollTop / scrollHeight * 100) + '%';

  // Navbar scrolled style
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);

  // Back to top button
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) backBtn.classList.toggle('visible', scrollTop > 400);

  // Scroll reveal
  revealOnScroll();
});

/* ---- BACK TO TOP ---- */
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- HAMBURGER MENU ---- */
const hamburger = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

/* ---- ACTIVE NAV LINK (highlight current page) ---- */
(function () {
  const links = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- MATRIX RAIN ANIMATION ---- */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars   = '01<>{}[]10A/+-&$%#!*BCDEF';
  const fontSize = 14;
  let columns   = Math.floor(canvas.width / fontSize);
  let drops     = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(2,8,24,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d4ff';
    ctx.font      = fontSize + 'px Share Tech Mono, monospace';

    // Recalculate columns on resize
    columns = Math.floor(canvas.width / fontSize);
    while (drops.length < columns) drops.push(1);

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(draw, 50);
}
initMatrixRain();

/* ---- FLOATING PARTICLES ---- */
function initParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;

  const colors = ['#00d4ff', '#00fff5', '#a855f7'];
  const count  = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p   = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${color};
      animation-duration:${Math.random()*10+8}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(p);
  }
}
initParticles();

/* ---- TYPING ANIMATION ---- */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const texts = [
    'Learn ICT Smartly_',
    'Number System শিখি_',
    'C Programming করি_',
    'Logic Gate বুঝি_',
    'HTML তৈরি করি_'
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  type();
}
initTyping();

/* ---- SCROLL REVEAL ---- */
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  reveals.forEach(function (el) {
    const rect   = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.88;
    if (visible) el.classList.add('visible');
  });
}
revealOnScroll(); // Run once on load

/* ---- ANIMATED COUNTERS ---- */
function animateCounter(el) {
  const target  = parseInt(el.getAttribute('data-target'));
  const suffix  = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;

  function update() {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
    } else {
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }
  }
  update();
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
}
initCounters();

/* ---- TESTIMONIALS SLIDER ---- */
function initSlider() {
  const track    = document.querySelector('.testimonials-track');
  const prevBtn  = document.getElementById('prev-slide');
  const nextBtn  = document.getElementById('next-slide');
  if (!track || !prevBtn || !nextBtn) return;

  let index  = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const count = cards.length;

  function getVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function slide() {
    const visible  = getVisible();
    const cardWidth = cards[0].offsetWidth + 24; // gap
    const maxIndex  = Math.max(0, count - visible);
    index = Math.min(index, maxIndex);
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', function () {
    const visible = getVisible();
    if (index < count - visible) { index++; slide(); }
    else { index = 0; slide(); }
  });

  prevBtn.addEventListener('click', function () {
    if (index > 0) { index--; slide(); }
    else { index = count - getVisible(); slide(); }
  });

  window.addEventListener('resize', slide);

  // Auto play
  setInterval(function () {
    nextBtn.click();
  }, 5000);
}
initSlider();

/* ---- FAQ ACCORDION ---- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item    = btn.closest('.faq-item');
      const isOpen  = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });

      // Open clicked (toggle)
      if (!isOpen) item.classList.add('open');
    });
  });
}
initFAQ();

/* ---- ADMISSION FORM VALIDATION ---- */
function initAdmissionForm() {
  const form    = document.getElementById('admission-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Name
    const name    = document.getElementById('f-name');
    const nameErr = document.getElementById('err-name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      name.classList.add('error');
      nameErr.classList.add('show');
      valid = false;
    } else {
      name.classList.remove('error');
      nameErr.classList.remove('show');
    }

    // College
    const college    = document.getElementById('f-college');
    const collegeErr = document.getElementById('err-college');
    if (!college.value.trim()) {
      college.classList.add('error');
      collegeErr.classList.add('show');
      valid = false;
    } else {
      college.classList.remove('error');
      collegeErr.classList.remove('show');
    }

    // Phone
    const phone    = document.getElementById('f-phone');
    const phoneErr = document.getElementById('err-phone');
    const phoneVal = phone.value.trim().replace(/\s/g, '');
    if (!/^01[3-9]\d{8}$/.test(phoneVal)) {
      phone.classList.add('error');
      phoneErr.classList.add('show');
      valid = false;
    } else {
      phone.classList.remove('error');
      phoneErr.classList.remove('show');
    }

    // Batch
    const batch    = document.getElementById('f-batch');
    const batchErr = document.getElementById('err-batch');
    if (!batch.value) {
      batch.classList.add('error');
      batchErr.classList.add('show');
      valid = false;
    } else {
      batch.classList.remove('error');
      batchErr.classList.remove('show');
    }

    if (valid) {
      form.style.display = 'none';
      success.classList.add('show');
    }
  });
}
initAdmissionForm();

/* ---- SEAT BAR ANIMATION ---- */
function initSeatBars() {
  const bars = document.querySelectorAll('.seat-fill');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const pct = entry.target.getAttribute('data-pct') || '70';
        entry.target.style.width = pct + '%';
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function (b) {
    b.style.width = '0%';
    observer.observe(b);
  });
}
initSeatBars();

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

function initAdmissionForm() {
  const form = document.getElementById('admission-form');
  const successMsg = document.getElementById('form-success');
  // নিচে আপনার ডিলয় করা লিঙ্কটি বসান
  const scriptURL = 'https://script.google.com/macros/s/AKfycbx1Ss-pM8UY8oyATXxNBMasv0cYudn-IciGlf_Uijz854zbls9ClZi7sVovQpJkS_YY/exec'; 

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // বাটন লোডিং স্টেট
    const btn = form.querySelector('button');
    const originalBtnText = btn.textContent;
    btn.textContent = 'তথ্য পাঠানো হচ্ছে...';
    btn.disabled = true;

    // ডাটা পাঠানোর প্রক্রিয়া
    fetch(scriptURL, { 
      method: 'POST', 
      body: new FormData(form)
    })
    .then(response => {
      btn.textContent = originalBtnText;
      btn.disabled = false;
      
      // ফর্ম লুকিয়ে সাকসেস মেসেজ দেখানো
      form.style.display = 'none';
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.style.display = 'block';
        successMsg.innerHTML = "<h3>ধন্যবাদ!</h3><p>আপনার ভর্তির তথ্য সফলভাবে জমা হয়েছে।</p>";
      }
    })
    .catch(error => {
      btn.textContent = originalBtnText;
      btn.disabled = false;
      console.error('Error!', error.message);
      alert('দুঃখিত! ডাটা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    });
  });
}

// ফাংশনটি কল করা নিশ্চিত করুন
initAdmissionForm();