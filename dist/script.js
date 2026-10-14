'use strict';
const whatsappNumber = window.PERFESTUDIO_CONFIG?.whatsappNumber;
if (/^\d{12,15}$/.test(whatsappNumber || '')) {
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const message = link.dataset.package
      ? `Olá! Conheci os pacotes newborn do PERFESTUDIO e tenho interesse no ${link.dataset.package} (R$ ${link.dataset.price}). Gostaria de consultar as datas disponíveis e saber como reservar meu ensaio.`
      : link.dataset.message;
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  });
}
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', expanded);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
const dialog = document.querySelector('#comparison-dialog');
const compareButton = document.querySelector('#compare-button');
if (typeof dialog.showModal === 'function') {
  compareButton.hidden = false;
  compareButton.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    compareButton.focus();
  });
}
document.querySelector('#copyright-year').textContent = new Intl.DateTimeFormat('pt-BR', {year:'numeric',timeZone:'America/Sao_Paulo'}).format(new Date());

// Carrossel leve, sem biblioteca: só mostra a próxima foto quando já carregou.
function initializeHeroCarousel() {
  const carousel = document.querySelector('.hero-visual');
  const frame = carousel.querySelector('.photo-frame');
  const placeholder = frame.querySelector('.photo-placeholder');
  const controls = carousel.querySelector('.carousel-controls');
  const dots = carousel.querySelector('.carousel-dots');
  const toggle = carousel.querySelector('.carousel-toggle');
  const status = carousel.querySelector('.carousel-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const photos = (window.PERFESTUDIO_CONFIG?.heroPhotos || []).filter(photo => photo && typeof photo.src === 'string' && photo.src.trim());
  const interval = Math.max(2500, Number(window.PERFESTUDIO_CONFIG?.carouselInterval) || 5000);
  let current = -1;
  let timer;
  let paused = motion.matches;
  let hovering = false;
  let inView = true;
  const slides = [];
  const firstImage = frame.querySelector('img');

  function isReady(slide) {
    return slide.image.complete && slide.image.naturalWidth > 0 && !slide.failed;
  }

  function readyCount() {
    return slides.filter(isReady).length;
  }

  function updateTimer() {
    clearTimeout(timer);
    const running = !paused;
    toggle.setAttribute('aria-label', running ? 'Pausar carrossel' : 'Reproduzir carrossel');
    toggle.replaceChildren(document.createTextNode(running ? 'Pausar ' : 'Reproduzir '));
    const symbol = document.createElement('span');
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = running ? 'Ⅱ' : '▷';
    toggle.append(symbol);
    frame.setAttribute('aria-live', running ? 'off' : 'polite');
    if (running && !hovering && inView && !document.hidden && !carousel.contains(document.activeElement) && readyCount() > 1) {
      timer = setTimeout(() => {
        for (let step = 1; step <= slides.length; step++) {
          const next = (current + step) % slides.length;
          if (isReady(slides[next])) {
            showSlide(next);
            break;
          }
        }
      }, interval);
    }
  }

  function showSlide(index, announce = false) {
    if (!isReady(slides[index])) return;
    current = index;
    placeholder.hidden = true;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.image.classList.toggle('is-active', active);
      slide.image.setAttribute('aria-hidden', String(!active));
      slide.dot.setAttribute('aria-pressed', String(active));
    });
    if (announce) status.textContent = `Fotografia ${index + 1} de ${slides.length}: ${slides[index].image.alt}`;
    updateTimer();
  }

  function refreshImages() {
    slides.forEach(slide => { slide.dot.disabled = !isReady(slide); });
    controls.hidden = readyCount() < 2;
    if (current < 0 || !isReady(slides[current])) {
      const firstReady = slides.findIndex(isReady);
      if (firstReady >= 0) showSlide(firstReady);
      else {
        placeholder.hidden = false;
        slides.forEach(slide => {
          slide.image.classList.remove('is-active');
          slide.image.setAttribute('aria-hidden', 'true');
        });
      }
    }
    updateTimer();
  }

  if (!photos.length) {
    firstImage.remove();
    placeholder.hidden = false;
    return;
  }

  photos.forEach((photo, index) => {
    const image = index === 0 ? firstImage : new Image();
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Mostrar fotografia ${index + 1} de ${photos.length}`);
    dot.setAttribute('aria-controls', 'hero-photos');
    dot.setAttribute('aria-pressed', 'false');
    dot.disabled = true;
    const slide = { image, dot, failed: false };
    slides.push(slide);
    image.className = 'carousel-slide';
    image.alt = photo.alt || 'Fotografia do PERFESTUDIO';
    image.style.objectPosition = photo.position || '50% 50%';
    image.decoding = 'async';
    image.fetchPriority = index === 0 ? 'high' : 'low';
    image.setAttribute('aria-hidden', 'true');
    image.addEventListener('load', refreshImages);
    image.addEventListener('error', () => {
      slide.failed = true;
      image.hidden = true;
      refreshImages();
    });
    image.src = photo.src;
    if (index > 0) frame.append(image);
    dots.append(dot);
    dot.addEventListener('click', () => {
      paused = true;
      showSlide(index, true);
    });
  });
  refreshImages();
  toggle.addEventListener('click', () => {
    paused = !paused;
    updateTimer();
  });
  carousel.addEventListener('mouseenter', () => { hovering = true; updateTimer(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; updateTimer(); });
  carousel.addEventListener('focusin', updateTimer);
  carousel.addEventListener('focusout', () => setTimeout(updateTimer, 0));
  document.addEventListener('visibilitychange', updateTimer);
  motion.addEventListener('change', event => {
    if (event.matches) paused = true;
    updateTimer();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateTimer();
    }, { threshold: 0.15 });
    observer.observe(carousel);
  }
}
initializeHeroCarousel();

// Cabeçalho fixo: ganha uma sombra discreta depois que a página rola.
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Portfólio: amplia as fotos sem sair da página. Sem JavaScript, o link abre a imagem.
function initializeLightbox() {
  const lightbox = document.querySelector('#lightbox');
  const shots = [...document.querySelectorAll('.shot')];
  if (!lightbox || !shots.length || typeof lightbox.showModal !== 'function') return;
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  const counter = lightbox.querySelector('.lightbox-counter');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let opener = null;

  function show(next) {
    index = (next + shots.length) % shots.length;
    const shot = shots[index];
    image.src = shot.getAttribute('href');
    image.alt = shot.querySelector('img').alt;
    caption.textContent = shot.dataset.caption || '';
    counter.textContent = `${index + 1} / ${shots.length}`;
    if (!motion.matches && typeof image.animate === 'function') {
      image.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }

  shots.forEach((shot, i) => shot.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = shot;
    show(i);
    lightbox.showModal();
    document.body.classList.add('modal-open');
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus();
  });
}
initializeLightbox();

// Logo grande: acompanha o ponteiro, o "&" dá uma volta a cada clique e o desenho aparece ao entrar na tela.
function initializeLogoStage() {
  const stage = document.querySelector('[data-logo-stage]');
  if (!stage) return;
  const area = stage.closest('section') || stage;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let turns = 0;
  if ('IntersectionObserver' in window && !motion.matches) {
    stage.dataset.armed = '';
    new IntersectionObserver(([entry], observer) => {
      if (!entry.isIntersecting) return;
      stage.classList.add('is-in');
      observer.disconnect();
    }, { threshold: 0.4 }).observe(stage);
  }
  area.addEventListener('pointermove', (event) => {
    if (motion.matches) return;
    const rect = area.getBoundingClientRect();
    const clamp = (value) => Math.max(-1, Math.min(1, value)).toFixed(3);
    stage.style.setProperty('--mx', clamp(((event.clientX - rect.left) / rect.width) * 2 - 1));
    stage.style.setProperty('--my', clamp(((event.clientY - rect.top) / rect.height) * 2 - 1));
  });
  area.addEventListener('pointerleave', () => {
    stage.style.setProperty('--mx', '0');
    stage.style.setProperty('--my', '0');
  });
  stage.addEventListener('click', () => {
    if (!motion.matches) stage.style.setProperty('--turns', String(++turns));
  });
}
initializeLogoStage();

// Feed do Instagram: curtir (salvo só neste aparelho), comentar (abre a publicação) e compartilhar.
function initializeFeed() {
  const cards = [...document.querySelectorAll('.ig-card')];
  const toast = document.querySelector('#toast');
  if (!cards.length) return;
  const storageKey = 'pb-liked';
  let liked = [];
  try { liked = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { liked = []; }
  if (!Array.isArray(liked)) liked = [];
  let toastTimer;
  let hinted = false;

  function say(text) {
    toast.textContent = text;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 3200);
  }

  function replay(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function render(card) {
    const isLiked = liked.includes(card.dataset.post);
    const total = Number(card.dataset.likes) + (isLiked ? 1 : 0);
    const button = card.querySelector('.ig-like');
    button.setAttribute('aria-pressed', String(isLiked));
    button.setAttribute('aria-label', isLiked ? 'Descurtir' : 'Curtir');
    card.querySelector('.ig-count').textContent = String(total);
    card.querySelector('.ig-noun').textContent = total === 1 ? 'curtida' : 'curtidas';
  }

  function setLiked(card, next) {
    const code = card.dataset.post;
    if (liked.includes(code) === next) return;
    liked = next ? [...liked, code] : liked.filter((item) => item !== code);
    try { localStorage.setItem(storageKey, JSON.stringify(liked)); } catch { /* sem armazenamento: vale só nesta visita */ }
    render(card);
    if (next) {
      replay(card.querySelector('.ig-like'), 'is-pop');
      if (!hinted) {
        hinted = true;
        say('Curtida salva neste aparelho. Para curtir no Instagram, abra a publicação.');
      }
    }
  }

  cards.forEach((card) => {
    const like = card.querySelector('.ig-like');
    const burst = card.querySelector('.ig-burst');
    render(card);
    like.addEventListener('click', () => setLiked(card, like.getAttribute('aria-pressed') !== 'true'));
    card.querySelector('.ig-media').addEventListener('dblclick', () => {
      setLiked(card, true);
      replay(burst, 'is-on');
    });
    burst.addEventListener('animationend', (event) => {
      if (event.target === burst) burst.classList.remove('is-on');
    });
    card.querySelector('.ig-share').addEventListener('click', async () => {
      const url = card.dataset.url;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'P&B Newborn · Fotografia', url });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        say('Link da publicação copiado!');
      } catch {
        say('Não deu para copiar. Abra a publicação e copie o link por lá.');
      }
    });
  });
}
initializeFeed();

// Neve natalina: flocos leves em CSS dentro de cada [data-snow]. Pausa fora da tela e some com prefers-reduced-motion.
function initializeSnow() {
  const areas = [...document.querySelectorAll('[data-snow]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!areas.length || motion.matches) return;
  const total = window.innerWidth < 640 ? 18 : 36;
  const between = (min, max) => (min + Math.random() * (max - min)).toFixed(2);
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-idle', !entry.isIntersecting)))
    : null;
  areas.forEach((area) => {
    const flakes = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const flake = document.createElement('i');
      flake.style.cssText = `--x:${between(0, 100)}%;--s:${between(3, 8)}px;--o:${between(0.45, 0.9)};--d:${between(9, 18)}s;--dl:-${between(0, 18)}s;--drift:${between(-60, 60)}px`;
      flakes.append(flake);
    }
    area.append(flakes);
    observer?.observe(area);
  });
  motion.addEventListener('change', (event) => {
    if (event.matches) areas.forEach((area) => area.replaceChildren());
  });
}
initializeSnow();
