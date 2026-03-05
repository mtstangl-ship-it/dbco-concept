/**
 * Design Build & Co - Scroll Animations & Virtual Agent
 */

// ===== Scroll Reveal =====
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach((el) => {
  observer.observe(el);
});

// Stagger children within grids
document.querySelectorAll('.services-grid .service-card, .process-timeline .process-step, .portfolio-grid .portfolio-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

// ===== Hero parallax =====
const heroBg = document.getElementById('hero-bg');
const heroBgMedia = heroBg?.querySelector('.hero-bg-media');

window.addEventListener('scroll', () => {
  if (heroBgMedia && window.innerHeight) {
    const scrolled = window.scrollY;
    const rate = 0.15;
    heroBgMedia.style.transform = `translate3d(0, ${scrolled * rate}px, 0)`;
  }
});

// ===== Navbar scroll state =====
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ===== Video Marquee: CAD → Live replay on loop =====
const marqueeVideo = document.querySelector('.marquee-video');
const cadOverlay = document.getElementById('cad-overlay');

if (marqueeVideo && cadOverlay) {
  const replayCadEffect = () => {
    cadOverlay.style.animation = 'none';
    marqueeVideo.style.animation = 'none';
    cadOverlay.offsetHeight; // force reflow
    marqueeVideo.offsetHeight;
    cadOverlay.style.animation = 'cadToLive 6s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards';
    marqueeVideo.style.animation = 'videoReveal 6s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards';
  };
  marqueeVideo.addEventListener('ended', replayCadEffect);
}

// ===== Testimonials Carousel =====
const carouselTrack = document.getElementById('carousel-track');
const carouselDots = document.getElementById('carousel-dots');
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides?.length || 0;
let currentSlide = 0;

function goToSlide(index) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentSlide = index;
  if (carouselTrack) carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
  document.querySelectorAll('.carousel-slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });
}

if (totalSlides > 0) {
  document.querySelectorAll('.carousel-slide').forEach((s, i) => s.classList.toggle('active', i === 0));
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    carouselDots?.appendChild(dot);
  });

  document.querySelector('.carousel-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.querySelector('.carousel-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  let touchStartX = 0, touchEndX = 0;
  carouselTrack?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carouselTrack?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1);
    if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1);
  }, { passive: true });

  let mouseStartX = 0, mouseEndX = 0;
  carouselTrack?.addEventListener('mousedown', (e) => { mouseStartX = e.pageX; });
  carouselTrack?.addEventListener('mouseup', (e) => {
    mouseEndX = e.pageX;
    if (Math.abs(mouseEndX - mouseStartX) > 50) {
      if (mouseStartX - mouseEndX > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }
  });
}

// ===== Virtual Agent =====
const agentToggle = document.getElementById('agent-toggle');
const agentPanel = document.getElementById('agent-panel');
const agentClose = document.getElementById('agent-close');
const agentForm = document.getElementById('agent-form');
const agentInput = document.getElementById('agent-input');
const agentMessages = document.getElementById('agent-messages');
const suggestionsContainer = document.getElementById('agent-suggestions');

// Show bubble after delay when panel closed
const agentWrapper = document.getElementById('agent-wrapper');
setTimeout(() => agentWrapper?.classList.add('bubble-visible'), 4000);

const responses = {
  default: "That's a great question! I'd recommend reaching out to us directly at hello@designbuildandco.com for personalized assistance. Our team would love to discuss your project.",
  quote: "Upload reference photos above and tap **Generate Quote Estimate** to get an estimated price range. Our team will review your images and provide a tailored estimate. You can also email hello@designbuildandco.com for a consultation.",
  services: "We offer five main services: **Kitchen Remodel** — custom kitchens tailored to your lifestyle; **Whole Home Remodel** — complete transformations; **Additions & ADUs** — thoughtful expansions; **Bath Remodel** — spa-inspired bathrooms; and **Lower Level Finishes** — turning basements into livable spaces. Would you like details on any specific service?",
  kitchen: "Our **Kitchen Remodel** service combines architectural layout with interior design to create custom kitchens that match your lifestyle. We handle everything from concept to completion. Ready to get started? Contact us at hello@designbuildandco.com",
  bath: "Our **Bath Remodel** service creates luxurious, spa-inspired bathrooms built for daily rejuvenation. We work with you on layout, fixtures, and finishes. Want to learn more? Reach out for a consultation!",
  whole: "A **Whole Home Remodel** is a complete transformation that honors your home's character while modernizing every detail. We bring 25+ years of experience to ensure every corner reflects your vision.",
  addition: "Our **Additions & ADUs** service creates thoughtful expansions that integrate seamlessly with your existing home. We design for flow, light, and livability.",
  lower: "**Lower Level Finishes** transform unfinished basements into livable, inviting spaces—from family rooms to guest suites. We handle everything from framing to finishes.",
  start: "Getting started is easy! Reach out via email at hello@designbuildandco.com or give us a call. We'll schedule a consultation to discuss your vision, budget, and timeline. We believe answering your questions is the perfect place to begin.",
  about: "Design Build & Co brings 25 years of award-winning experience in home renovation. Our motivation is founded in family, friends, and community. We combine design with construction—communication is our greatest strength.",
};

function getResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('kitchen')) return responses.kitchen;
  if (lower.includes('bath')) return responses.bath;
  if (lower.includes('whole') || lower.includes('entire')) return responses.whole;
  if (lower.includes('addition') || lower.includes('adu')) return responses.addition;
  if (lower.includes('lower') || lower.includes('basement')) return responses.lower;
  if (lower.includes('service') || lower.includes('offer') || lower.includes('do')) return responses.services;
  if (lower.includes('start') || lower.includes('begin') || lower.includes('get started')) return responses.start;
  if (lower.includes('about') || lower.includes('who')) return responses.about;
  if (lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('estimate') || lower.includes('upload')) return responses.quote;
  return responses.default;
}

function formatResponse(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function addMessage(text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `agent-msg agent-msg-${isUser ? 'user' : 'bot'}`;
  const p = document.createElement('p');
  p.innerHTML = isUser ? text : formatResponse(text);
  msg.appendChild(p);
  agentMessages.appendChild(msg);
  agentMessages.scrollTop = agentMessages.scrollHeight;
}

function sendMessage() {
  const text = agentInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  agentInput.value = '';

  // Simulate typing delay
  setTimeout(() => {
    const response = getResponse(text);
    addMessage(response);
  }, 600);
}

agentToggle?.addEventListener('click', () => {
  agentPanel.classList.toggle('open');
  agentWrapper?.classList.toggle('panel-open', agentPanel.classList.contains('open'));
  if (agentPanel.classList.contains('open')) {
    agentInput.focus();
  }
});

agentClose?.addEventListener('click', () => {
  agentPanel.classList.remove('open');
  agentWrapper?.classList.remove('panel-open');
});

agentForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

document.querySelectorAll('.suggestion-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const msg = btn.dataset.msg;
    addMessage(msg, true);
    setTimeout(() => addMessage(getResponse(msg)), 600);
  });
});

// ===== Upload & Quote =====
const quoteImagesInput = document.getElementById('quote-images');
const uploadPreview = document.getElementById('upload-preview');
const btnGetQuote = document.getElementById('btn-get-quote');

let uploadedFiles = [];

quoteImagesInput?.addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  uploadedFiles = files;
  uploadPreview.innerHTML = '';
  files.slice(0, 6).forEach((file) => {
    const url = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = url;
    img.alt = file.name;
    uploadPreview.appendChild(img);
  });
  btnGetQuote.disabled = files.length === 0;
});

btnGetQuote?.addEventListener('click', () => {
  if (uploadedFiles.length === 0) return;
  btnGetQuote.disabled = true;
  btnGetQuote.textContent = 'Generating...';

  addMessage('Generating quote based on your reference images...', true);
  setTimeout(() => {
    const baseRange = { kitchen: [45000, 85000], bath: [15000, 35000], whole: [120000, 280000] };
    const types = ['kitchen', 'bath', 'whole'];
    const t = types[uploadedFiles.length % 3];
    const [low, high] = baseRange[t];
    const est = `Based on ${uploadedFiles.length} reference image(s), your estimated remodel range is **$${low.toLocaleString()} – $${high.toLocaleString()}**. This is a preliminary estimate—schedule a consultation at hello@designbuildandco.com for a detailed proposal.`;
    addMessage(est);
    btnGetQuote.textContent = 'Generate Quote Estimate';
    btnGetQuote.disabled = false;
  }, 2000);
});
