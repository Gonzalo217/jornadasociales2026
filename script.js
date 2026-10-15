const nav = document.querySelector('.site-nav');
const menu = document.querySelector('.menu-button');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.reading-progress span');
const backToTop = document.querySelector('.back-to-top');

const updateReadingState = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
};

window.addEventListener('scroll', updateReadingState, { passive: true });
updateReadingState();

if (!reduceMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('js-enabled');
  const revealItems = document.querySelectorAll('.editorial article, .section-heading, .timeline, .paper, .committee-grid, .thanks > *');
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
  });
  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -42px' });
  revealItems.forEach(item => reveal.observe(item));
}

const summaryDialog = document.querySelector('.summary-dialog');
const dialogTitle = document.querySelector('#summary-dialog-title');
const dialogAuthor = document.querySelector('.summary-dialog__author');
const dialogText = document.querySelector('.summary-dialog__text');
const closeDialogButtons = document.querySelectorAll('.summary-dialog__close');

document.querySelectorAll('.paper').forEach((paper, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'summary-button';
  button.textContent = 'Ver resumen';
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'summary-dialog');
  button.addEventListener('click', () => {
    dialogTitle.textContent = paper.querySelector('h3').textContent;
    dialogAuthor.textContent = paper.querySelector('.paper__meta span').textContent;
    dialogText.replaceChildren();
    const paragraph = document.createElement('p');
    paragraph.textContent = paper.querySelector('.summary').textContent;
    dialogText.append(paragraph);
    summaryDialog.dataset.returnFocus = String(index);
    summaryDialog.showModal();
  });
  paper.querySelector('h3').insertAdjacentElement('afterend', button);
  paper.querySelector('.keywords')?.remove();
});

closeDialogButtons.forEach(button => button.addEventListener('click', () => summaryDialog.close()));
summaryDialog?.addEventListener('close', () => {
  const paper = document.querySelectorAll('.paper')[Number(summaryDialog.dataset.returnFocus)];
  paper?.querySelector('.summary-button')?.focus();
});
