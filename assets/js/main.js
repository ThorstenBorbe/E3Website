/* =============================================
   E3 Advanced Technologies GmbH – blueline
   JavaScript
   ============================================= */

(function () {
  'use strict';

  // ── Navbar scroll effect ──────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Mobile hamburger menu ─────────────────────
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Menü öffnen');
    });
  });

  // ── Scroll-reveal (Intersection Observer) ────
  const fadeEls = document.querySelectorAll(
    '.problem-card, .product-card-full, .pricing-block, .team-card, ' +
    '.feature-item, .data-chain, .step-card, .stat, .shop-card, ' +
    '.kontakt-info, .kontakt-form, .problem-conclusion, .steps-chain'
  );

  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));

  // ── Active nav link on scroll ─────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ── Smooth anchor scroll with offset (fixed navbar) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 75; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Contact form ──────────────────────────────
  const form   = document.getElementById('kontakt-form');
  const notice = document.getElementById('form-notice');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    notice.textContent = '';
    notice.className = 'form-notice';

    const name      = form.name.value.trim();
    const email     = form.email.value.trim();
    const nachricht = form.nachricht.value.trim();

    // Basic validation
    if (!name) {
      showNotice('Bitte geben Sie Ihren Namen an.', true);
      form.name.focus();
      return;
    }
    if (!isValidEmail(email)) {
      showNotice('Bitte geben Sie eine gültige E-Mail-Adresse an.', true);
      form.email.focus();
      return;
    }
    if (!nachricht) {
      showNotice('Bitte geben Sie eine Nachricht ein.', true);
      form.nachricht.focus();
      return;
    }

    // Build mailto link as a simple fallback (no server required)
    const betreff  = form.betreff.value;
    const subject  = encodeURIComponent(
      (betreff ? '[' + betreff.toUpperCase() + '] ' : '') + 'Nachricht von ' + name
    );
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'E-Mail: ' + email + '\n\n' +
      nachricht
    );

    window.location.href = 'mailto:thorsten.borbe@e3at.com?subject=' + subject + '&body=' + body;

    showNotice('Vielen Dank! Ihr E-Mail-Programm wird geöffnet.', false);
    form.reset();
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showNotice(msg, isError) {
    notice.textContent = msg;
    notice.className = 'form-notice' + (isError ? ' error' : '');
  }

  // ── Staggered animation for grids ────────────
  document.querySelectorAll(
    '.problem-grid, .product-row, .pricing-grid, .team-grid, .steps-grid, .shop-grid'
  ).forEach(grid => {
    grid.querySelectorAll(':scope > *').forEach((child, i) => {
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  // ── Shop cart ───────────────────────────────
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartOpenBtn = document.getElementById('cart-open');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsEl = document.getElementById('cart-items');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cart-total');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartClearBtn = document.getElementById('cart-clear');
  const cartCheckoutBtn = document.getElementById('cart-checkout');
  const cartNoteEl = document.getElementById('cart-note');

  if (addToCartButtons.length && cartDrawer) {
    let cart = [];

    try {
      const stored = localStorage.getItem('e3_cart');
      cart = stored ? JSON.parse(stored) : [];
    } catch (_err) {
      cart = [];
    }

    function formatCurrency(value) {
      return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }

    function saveCart() {
      localStorage.setItem('e3_cart', JSON.stringify(cart));
    }

    function renderCart() {
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      cartItemsEl.innerHTML = '';

      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML =
          '<span class="cart-item-name">' + item.name + '</span>' +
          '<span class="cart-item-price">' + formatCurrency(item.price) + '</span>' +
          '<button type="button" class="cart-remove" data-remove-index="' + index + '">Entfernen</button>';
        cartItemsEl.appendChild(li);
      });

      cartCountEl.textContent = String(cart.length);
      cartTotalEl.textContent = formatCurrency(total);
      cartEmptyEl.hidden = cart.length !== 0;
      saveCart();
    }

    function openCart() {
      cartDrawer.hidden = false;
    }

    function closeCart() {
      cartDrawer.hidden = true;
    }

    addToCartButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const name = button.dataset.product || 'Produkt';
        const price = Number(button.dataset.price || '0');
        cart.push({ name, price });
        renderCart();
        openCart();
        cartNoteEl.textContent = name + ' wurde zum Warenkorb hinzugefügt.';
      });
    });

    cartOpenBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);

    cartItemsEl.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const index = target.dataset.removeIndex;
      if (index === undefined) return;

      const removeAt = Number(index);
      if (Number.isNaN(removeAt)) return;
      cart.splice(removeAt, 1);
      cartNoteEl.textContent = 'Artikel wurde aus dem Warenkorb entfernt.';
      renderCart();
    });

    cartClearBtn.addEventListener('click', () => {
      cart = [];
      cartNoteEl.textContent = 'Warenkorb wurde geleert.';
      renderCart();
    });

    cartCheckoutBtn.addEventListener('click', () => {
      if (!cart.length) {
        cartNoteEl.textContent = 'Bitte zuerst Artikel in den Warenkorb legen.';
        return;
      }
      cartNoteEl.textContent = 'Checkout wird vorbereitet. Unser Team meldet sich für den Abschluss.';
    });

    renderCart();
  }

})();
