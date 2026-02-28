/* app.js — Oil Market Infographic */

(function() {
  'use strict';

  // =============================================
  // INTERSECTION OBSERVER FALLBACK FOR SCROLL REVEALS
  // (For browsers that don't support animation-timeline: scroll())
  // =============================================
  if (!CSS.supports || !CSS.supports('animation-timeline: scroll()')) {
    const fadeEls = document.querySelectorAll('.fade-in');
    
    // Set initial state
    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
  }

  // =============================================
  // ANIMATED COUNTERS FOR PRICE VALUES
  // =============================================
  function animateValue(el, start, end, duration, prefix, suffix) {
    const startTime = performance.now();
    const easing = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easing(progress);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Animate price card values when they come into view
  const priceCards = document.querySelectorAll('.price-card__value');
  const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        // Parse numeric value — handle ranges like "$8-10"
        const match = text.match(/\$(\d+)(?:-(\d+))?/);
        if (match && !match[2]) {
          const target = parseInt(match[1]);
          const suffix = el.querySelector('.price-card__unit') ? '' : '';
          const unitEl = el.querySelector('.price-card__unit');
          const unitText = unitEl ? unitEl.textContent : '';
          
          // Only animate the number part
          animateValue(el, 0, target, 1200, '$', '');
          // Re-add the unit after animation
          setTimeout(() => {
            el.innerHTML = '$' + target + '<span class="price-card__unit">' + unitText + '</span>';
          }, 1250);
        }
        priceObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  priceCards.forEach(el => priceObserver.observe(el));

  // =============================================
  // SCENARIO BAR ANIMATION
  // =============================================
  const scenarioBars = document.querySelectorAll('.scenario-bar__fill');
  
  // Set initial width to 0
  scenarioBars.forEach(bar => {
    const targetWidth = bar.style.getPropertyValue('--target-width');
    bar.style.width = '0%';
    bar.dataset.targetWidth = targetWidth;
  });

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        requestAnimationFrame(() => {
          bar.style.width = bar.dataset.targetWidth;
        });
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  scenarioBars.forEach(bar => barObserver.observe(bar));

  // =============================================
  // STAGGERED ENTRANCE FOR GRIDS
  // =============================================
  const grids = document.querySelectorAll('.fact-grid, .impact-grid, .scenario-cards, .friend-cards');
  
  grids.forEach(grid => {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.fade-in');
          items.forEach((item, i) => {
            item.style.transitionDelay = (i * 60) + 'ms';
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    gridObserver.observe(grid);
  });

  // =============================================
  // SMOOTH SCROLL FOR INTERNAL LINKS
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
