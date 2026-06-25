document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initGallery();
  initFAQ();
  initScrollAnimations();
});

function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('active');
    menu.classList.toggle('active');
    toggle.innerHTML = isOpen ? '☰' : '✕';
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  menu.querySelectorAll('a:not(.nav-dropdown > a)').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.innerHTML = '☰';
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.nav-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });
}

function initGallery() {
  const mainImage = document.getElementById('galleryMainImg');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const counter = document.querySelector('.gallery-counter');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');

  if (!mainImage || thumbs.length === 0) return;

  let currentIndex = 0;
  const images = Array.from(thumbs).map(thumb => {
    const img = thumb.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });

  function updateGallery(index) {
    currentIndex = index;
    if (images[index]) {
      mainImage.src = images[index].src;
      mainImage.alt = images[index].alt;
    }
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
    if (counter) counter.textContent = `${index + 1} / ${images.length}`;
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateGallery(index));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateGallery(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateGallery(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });

  const galleryMain = document.querySelector('.gallery-main');
  if (galleryMain) {
    let touchStartX = 0;
    galleryMain.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    galleryMain.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && nextBtn) nextBtn.click();
        else if (prevBtn) prevBtn.click();
      }
    });
  }
}

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
