/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {
  /* ============================================
     1. БУРГЕР-МЕНЮ
     ============================================ */

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  if (burger && nav) {
    const toggleMenu = (open) => {
      burger.classList.toggle('is-active', open);
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      toggleMenu(!isOpen);
    });
    // Закрываем меню по клику на ссылку (важно для одностраничника)
    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });
    // Закрываем по Escape — обязательное поведение для доступности
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggleMenu(false);
        burger.focus();
      }
    });
    // Закрываем при ресайзе до десктопа, чтобы не остался «открытым»
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) toggleMenu(false);
    });
  }
  /* ============================================
     2. ТЕНЬ ШАПКИ ПРИ СКРОЛЛЕ
     ============================================ */
  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    };
    // passive: true — не блокируем скролл (важно для отзывчивости)
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});
