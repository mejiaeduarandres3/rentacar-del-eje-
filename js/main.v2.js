document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initGallery();
  initFAQ();
  initScrollAnimations();
  initVideoLazyLoad();
  initConversionTracking();
  initUTMPreservation();
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

function initVideoLazyLoad() {
  var videos = document.querySelectorAll('video[data-src]');
  if (!videos.length) return;

  function startVideo(video) {
    if (!video.dataset.src) return;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.removeAttribute('preload');
    video.src = video.dataset.src;
    delete video.dataset.src;

    var tryPlay = function() { video.play().catch(function() {}); };
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.load();
    setTimeout(tryPlay, 500);
    setTimeout(tryPlay, 1500);
    setTimeout(tryPlay, 3000);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      startVideo(entry.target);
    });
  }, { threshold: 0.1 });

  videos.forEach(function(video) { observer.observe(video); });

  setTimeout(function() {
    videos.forEach(function(video) { startVideo(video); });
  }, 4000);
}

function initConversionTracking() {
  var ADS_WHATSAPP = 'AW-18209447648/0pzsCJqOt9EcEOC9-OpD';
  var ADS_CALL = 'AW-18209447648/Gti6CJ2Ot9EcEOC9-OpD';

  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';

    if (href.indexOf('wa.me/') !== -1 || href.indexOf('whatsapp') !== -1) {
      var page = location.pathname.split('/').pop() || 'index';
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'lead',
          event_label: page,
          transport_type: 'beacon'
        });
        gtag('event', 'conversion', {
          send_to: ADS_WHATSAPP,
          event_callback: function() {}
        });
      }
    }

    if (href.indexOf('tel:') === 0) {
      var page = location.pathname.split('/').pop() || 'index';
      if (typeof gtag === 'function') {
        gtag('event', 'call_click', {
          event_category: 'lead',
          event_label: page,
          transport_type: 'beacon'
        });
        gtag('event', 'conversion', {
          send_to: ADS_CALL,
          event_callback: function() {}
        });
      }
    }
  });
}

function initUTMPreservation() {
  var params = new URLSearchParams(location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
  var utmParams = new URLSearchParams();
  utmKeys.forEach(function(key) {
    if (params.has(key)) utmParams.set(key, params.get(key));
  });
  if (!utmParams.toString()) return;

  document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    if (href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;
    if (href.indexOf('http') === 0 && href.indexOf(location.hostname) === -1) return;

    try {
      var url = new URL(href, location.origin);
      utmKeys.forEach(function(key) {
        if (utmParams.has(key) && !url.searchParams.has(key)) {
          url.searchParams.set(key, utmParams.get(key));
        }
      });
      link.setAttribute('href', url.pathname + url.search + url.hash);
    } catch(e) {}
  });
}
