(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    reveal.forEach(el => observer.observe(el));
  } else {
    reveal.forEach(el => el.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-count]').forEach(counter => {
    const end = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const run = () => {
      let start = 0;
      const duration = 900;
      const begin = performance.now();
      const tick = now => {
        const progress = Math.min((now - begin) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(start + (end - start) * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { run(); io.disconnect(); }
      }, { threshold: .7 });
      io.observe(counter);
    } else run();
  });

  // Evidence cards open one shared dossier modal.
  const modal = document.querySelector('#evidence-modal');
  if (modal) {
    const title = modal.querySelector('[data-modal-title]');
    const copy = modal.querySelector('[data-modal-copy]');
    const facts = modal.querySelector('[data-modal-facts]');
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      body.classList.remove('modal-lock');
    };
    document.querySelectorAll('[data-evidence]').forEach(button => {
      button.addEventListener('click', () => {
        const data = JSON.parse(button.dataset.evidence);
        title.textContent = data.title;
        copy.textContent = data.copy;
        facts.innerHTML = data.facts.map(fact => `<div class="modal-fact"><strong>${fact[0]}</strong>${fact[1]}</div>`).join('');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        body.classList.add('modal-lock');
      });
    });
    modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }

  // Theory filters and disclosure details.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const theories = document.querySelectorAll('[data-theory]');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.filter;
      theories.forEach(theory => theory.classList.toggle('is-hidden', filter !== 'all' && theory.dataset.theory !== filter));
    });
  });
  document.querySelectorAll('[data-theory-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.theory');
      item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    });
  });

  // Accessible accordions on the sources page.
  document.querySelectorAll('.accordion-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  // Tiny live clock makes the "waiting for a signal" motif feel present without external assets.
  document.querySelectorAll('[data-clock]').forEach(clock => {
    const update = () => {
      const now = new Date();
      clock.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
    };
    update();
    window.setInterval(update, 1000);
  });

  // Scroll progress on the chronology page.
  const progress = document.querySelector('[data-scroll-progress]');
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.height = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }
})();
