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
