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

  /* ============================================
     3. КАТАЛОГ ТОВАРОВ
     ============================================ */

  // Данные. В реальном проекте придут из API: fetch('/api/products')
  const PRODUCTS = [
    {
      id: 1,
      title: 'Premium Dog Food',
      category: 'dogs',
      price: 24.99,
      rating: 4.8,
      reviews: 124,
      badge: 'Hit',
      image: 'assets/images/product-1.webp',
    },
    {
      id: 2,
      title: 'Cat Scratching Post',
      category: 'cats',
      price: 39.5,
      rating: 4.6,
      reviews: 87,
      badge: null,
      image: 'assets/images/product-2.webp',
    },
    {
      id: 3,
      title: 'Bird Cage Deluxe',
      category: 'birds',
      price: 89.0,
      rating: 4.9,
      reviews: 42,
      badge: 'New',
      image: 'assets/images/product-3.webp',
    },
    {
      id: 4,
      title: 'Chew Toy Set',
      category: 'dogs',
      price: 12.9,
      rating: 4.5,
      reviews: 210,
      badge: '-20%',
      image: 'assets/images/product-1.webp',
    },
    {
      id: 5,
      title: 'Cozy Cat Bed',
      category: 'cats',
      price: 54.0,
      rating: 4.7,
      reviews: 96,
      badge: null,
      image: 'assets/images/product-2.webp',
    },
    {
      id: 6,
      title: 'Bird Seed Mix',
      category: 'birds',
      price: 8.75,
      rating: 4.4,
      reviews: 63,
      badge: null,
      image: 'assets/images/product-3.webp',
    },
  ];
  const grid = document.getElementById('products-grid');
  const emptyMsg = document.getElementById('products-empty');
  const filters = document.querySelectorAll('.filter');
  const cartCount = document.getElementById('cart-count');

  let currentFilter = 'all';
  let cartItems = 2; // начальное значение из макета

  /* ---- Форматирование цены ---- */
  // Intl.NumberFormat — правильный способ вывода денег (знает о локалях и валютах)
  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  /* ---- Экранирование: защита от XSS и «ломающих» кавычек ---- */

  const escapeHTML = (str) =>
    String(str).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[ch],
    );
  /* ---- SVG-звезда ---- */
  const starSVG = (filled) => `
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z"
            fill="${filled ? 'currentColor' : 'none'}"
            stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
  /* ---- Разметка одной карточки ---- */
  function createCardHTML(product) {
    const full = Math.floor(product.rating);
    const stars = Array.from({ length: 5 }, (_, i) => starSVG(i < full)).join('');

    return `
      <li class="product-card">
        <div class="product-card__media">
          <img class="product-card__img"
               src="${escapeHTML(product.image)}"
               alt="${escapeHTML(product.title)}"
               width="400" height="300"
               loading="lazy" decoding="async">
          ${
            product.badge
              ? `<span class="product-card__badge">${escapeHTML(product.badge)}</span>`
              : ''
          }
        </div>

        <div class="product-card__body">
          <h3 class="product-card__title">${escapeHTML(product.title)}</h3>

          <div class="rating">
            <span class="rating__stars" aria-hidden="true">${stars}</span>
            <span class="rating__count">${product.rating} (${product.reviews})</span>
            <span class="visually-hidden">Рейтинг: ${product.rating} из 5, отзывов: ${product.reviews}</span>
          </div>

          <div class="product-card__footer">
            <span class="product-card__price">${priceFormatter.format(product.price)}</span>
            <button class="product-card__add" type="button"
                    data-id="${product.id}"
                    aria-label="Добавить в корзину: ${escapeHTML(product.title)}">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor"
                      stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </li>`;
  }

  /* ---- Рендер списка ---- */
  function renderProducts() {
    if (!grid) return;

    const list =
      currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === currentFilter);

    grid.innerHTML = list.map(createCardHTML).join('');
    emptyMsg.hidden = list.length > 0;
  }

  /* ---- Фильтрация ---- */
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;

      filters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      renderProducts();
    });
  });

  /* ---- Добавление в корзину (делегирование событий) ---- */
  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-card__add');
      if (!btn) return;

      cartItems += 1;
      if (cartCount) {
        cartCount.textContent = cartItems;
        cartCount.closest('.cart')?.setAttribute('aria-label', `Корзина, товаров: ${cartItems}`);
      }

      // Визуальный отклик
      btn.classList.add('is-added');
      window.setTimeout(() => btn.classList.remove('is-added'), 600);
    });
  }

  renderProducts(); // первый рендер при загрузке

  /* ============================================
     4. ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ
     ============================================ */

  const revealTargets = document.querySelectorAll(
    '.about__media, .about__content, .benefits__item',
  );

  if (revealTargets.length && 'IntersectionObserver' in window) {
    revealTargets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // анимируем один раз — экономим ресурсы
          }
        });
      },
      {
        threshold: 0.15, // срабатывает, когда видно 15% элемента
        rootMargin: '0px 0px -40px 0px', // чуть «до» появления в кадре
      },
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  /* ============================================
     5. АКТУАЛЬНЫЙ ГОД В КОПИРАЙТЕ
     ============================================ */

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Конец ---- */
});
