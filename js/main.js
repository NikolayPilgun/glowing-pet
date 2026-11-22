/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {
  /* Каждый блок изолирован: падение одного не ломает остальные.
     Это принципиально: в вашей версии ошибка в каталоге убивала слайдер. */
  const safe = (name, fn) => {
    try {
      fn();
    } catch (error) {
      console.error(`[main.js] Блок "${name}" упал:`, error);
    }
  };

  /* ============================================
     1. БУРГЕР-МЕНЮ
     ============================================ */

  safe('Бургер-меню', () => {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    if (!burger || !nav) return;

    const toggleMenu = (open) => {
      burger.classList.toggle('is-active', open);
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('is-locked', open);
    };

    burger.addEventListener('click', () => {
      toggleMenu(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggleMenu(false);
        burger.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992 && nav.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  });

  /* ============================================
     2. ТЕНЬ ШАПКИ ПРИ СКРОЛЛЕ
     ============================================ */

  safe('Тень шапки', () => {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  /* ============================================
     3. КАТАЛОГ ТОВАРОВ
     ============================================ */

  safe('Каталог товаров', () => {
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

    if (!grid) return; // каталога нет на странице — выходим тихо

    let currentFilter = 'all';
    let cartItems = 2;

    const priceFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const escapeHTML = (str) =>
      String(str).replace(
        /[&<>"']/g,
        (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
      );

    const starSVG = (filled) => `
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z"
              fill="${filled ? 'currentColor' : 'none'}"
              stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`;

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
            ${product.badge ? `<span class="product-card__badge">${escapeHTML(product.badge)}</span>` : ''}
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

    function renderProducts() {
      const list =
        currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === currentFilter);

      grid.innerHTML = list.map(createCardHTML).join('');

      // Guard: элемента может не быть в разметке
      if (emptyMsg) emptyMsg.hidden = list.length > 0;
    }

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

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-card__add');
      if (!btn) return;

      cartItems += 1;

      if (cartCount) {
        cartCount.textContent = cartItems;
        const cart = cartCount.closest('.cart');
        if (cart) cart.setAttribute('aria-label', `Корзина, товаров: ${cartItems}`);
      }

      btn.classList.add('is-added');
      window.setTimeout(() => btn.classList.remove('is-added'), 600);
    });

    renderProducts();
  });

  /* ============================================
     4. СЛАЙДЕР ОТЗЫВОВ
     ============================================ */

  safe('Слайдер отзывов', () => {
    const SWIPE_THRESHOLD = 48;

    const initSlider = (root) => {
      const track = root.querySelector('[data-reviews-track]');
      const viewport =
        root.querySelector('.reviews-slider__viewport') ||
        root.querySelector('[data-reviews-viewport]') ||
        track?.parentElement;

      const slides = Array.from(root.querySelectorAll('[data-review-slide]'));
      const thumbs = Array.from(root.querySelectorAll('[data-reviews-thumb]'));
      const prevBtn = root.querySelector('[data-reviews-prev]');
      const nextBtn = root.querySelector('[data-reviews-next]');

      if (!track || slides.length === 0) {
        console.warn('[slider] Не найдены track или слайды', { track, slides: slides.length });
        return;
      }

      let index = 0;

      const setIndex = (next) => {
        const total = slides.length;
        index = ((next % total) + total) % total;

        track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;

        slides.forEach((slide, i) => {
          const isActive = i === index;
          slide.setAttribute('aria-hidden', String(!isActive));

          if (isActive) {
            slide.removeAttribute('inert');
          } else {
            slide.setAttribute('inert', '');
          }
        });

        thumbs.forEach((thumb, i) => {
          const isActive = i === index;
          thumb.classList.toggle('is-active', isActive);
          thumb.setAttribute('aria-selected', String(isActive));
          thumb.setAttribute('tabindex', isActive ? '0' : '-1');
        });
      };

      if (prevBtn) prevBtn.addEventListener('click', () => setIndex(index - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => setIndex(index + 1));

      thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => setIndex(i));
      });

      root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setIndex(index - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          setIndex(index + 1);
        }
      });

      if (viewport) {
        let startX = 0;
        let isDragging = false;

        viewport.addEventListener(
          'touchstart',
          (event) => {
            startX = event.touches[0].clientX;
            isDragging = true;
          },
          { passive: true },
        );

        viewport.addEventListener(
          'touchend',
          (event) => {
            if (!isDragging) return;
            isDragging = false;

            const deltaX = event.changedTouches[0].clientX - startX;
            if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

            setIndex(deltaX < 0 ? index + 1 : index - 1);
          },
          { passive: true },
        );
      }

      setIndex(0);
      root.setAttribute('data-reviews-ready', 'true');
    };

    const roots = document.querySelectorAll('[data-reviews-slider]');
    if (roots.length === 0) {
      console.warn('[slider] На странице нет [data-reviews-slider]');
      return;
    }

    roots.forEach(initSlider);
  });

  /* ============================================
     5. ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ
     ============================================ */

  safe('Reveal-анимации', () => {
    const revealTargets = document.querySelectorAll(
      '.about__media, .about__content, .benefits__item',
    );

    if (!revealTargets.length || !('IntersectionObserver' in window)) return;

    revealTargets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    revealTargets.forEach((el) => observer.observe(el));
  });

  /* ============================================
     6. АКТУАЛЬНЫЙ ГОД В КОПИРАЙТЕ
     ============================================ */

  safe('Год в копирайте', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  });
});
