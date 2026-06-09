/* ==========================================
   Opening Animation：終了後にDOMから除去
   ========================================== */
(function () {
  const opening = document.getElementById('opening');
  if (!opening) return;
  // スクロールを一時的に固定
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    opening.classList.add('done');
    document.body.style.overflow = '';
  }, 3100);
})();

/* ==========================================
   Header: scroll effect
   ========================================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ==========================================
   Hamburger menu
   ========================================== */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ==========================================
   ① FV テキスト：オープニング後に順番にふわっと登場
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
  const fvSub   = document.querySelector('.fv__sub');
  const fvTitle = document.querySelector('.fv__title');
  const fvDesc  = document.querySelector('.fv__desc');
  const fvBtn   = document.querySelector('.fv__content .btn');

  // オープニング（約3.1秒）終了に合わせて開始
  const START = 3000;

  [fvSub, fvTitle, fvDesc, fvBtn].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';

      // ボタンはイントロ後にインラインstyleを除去し、CSSのhoverを有効化
      if (el === fvBtn) {
        setTimeout(() => {
          el.style.transition = '';
          el.style.transform = '';
        }, 900);
      }
    }, START + i * 180);
  });
});

/* ==========================================
   ② カスタムカーソル
   ========================================== */
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// リングは少し遅れてついてくる（lerp）
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ホバー時にリングが大きくなる
document.querySelectorAll('a, button, .works__item, .price__card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--hover'));
});



/* ==========================================
   ④-a パララックス（スクロール追従）
   ========================================== */
(function () {
  // data-parallax 属性を持つ要素を収集
  const items = [...document.querySelectorAll('[data-parallax]')].map(el => ({
    el,
    speed: parseFloat(el.dataset.parallax),
    offsetTop: 0,
  }));

  if (!items.length) return;

  // 各要素のドキュメント上のY座標を記録
  function calcOffsets() {
    items.forEach(item => {
      item.offsetTop = item.el.getBoundingClientRect().top + window.scrollY;
    });
  }
  calcOffsets();
  window.addEventListener('resize', calcOffsets, { passive: true });

  // rAFループで滑らかに更新
  let scrollY = window.scrollY;
  let ticking  = false;

  function update() {
    scrollY = window.scrollY;
    const vh = window.innerHeight;

    items.forEach(({ el, speed, offsetTop }) => {
      // 要素の中心が画面中央からどれだけズレているか
      const center  = offsetTop + el.offsetHeight / 2;
      const fromMid = scrollY + vh / 2 - center;
      const shift   = fromMid * speed;
      el.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // 初期位置を適用
})();

/* ==========================================
   ④-b Works ホバー：ふわっと浮く
   ========================================== */

/* ==========================================
   Scroll fade-in (IntersectionObserver)
   ========================================== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.section__header, .about__intro, .about__value, .works__item, .flow__item, .price__card, .contact__line'
).forEach((el, i) => {
  el.classList.add('fade-in');
  if (el.closest('.works__grid') || el.closest('.price__grid')) {
    el.style.transitionDelay = `${(i % 4) * 0.12}s`;
  }
  fadeObserver.observe(el);
});

/* ==========================================
   Active nav link on scroll
   ========================================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__nav-list a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.opacity    = link.getAttribute('href') === `#${id}` ? '1' : '';
        link.style.fontWeight = link.getAttribute('href') === `#${id}` ? '400' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ==========================================
   Lightbox
   ========================================== */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.body.classList.remove('lightbox-open');
}

document.querySelectorAll('.works__item[data-lightbox]').forEach(item => {
  item.addEventListener('click', () => {
    openLightbox(item.dataset.lightbox, item.dataset.title);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__inner')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeLpViewer();
  }
});

/* ==========================================
   LP Viewer (iframe modal)
   ========================================== */
const lpViewer      = document.getElementById('lpViewer');
const lpViewerFrame = document.getElementById('lpViewerFrame');
const lpViewerTitle = document.getElementById('lpViewerTitle');
const lpViewerClose = document.getElementById('lpViewerClose');

function openLpViewer(url, title) {
  lpViewerFrame.src = url;
  lpViewerTitle.textContent = title;
  lpViewer.classList.add('active');
  lpViewer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLpViewer() {
  if (!lpViewer.classList.contains('active')) return;
  lpViewer.classList.remove('active');
  lpViewer.setAttribute('aria-hidden', 'true');
  lpViewerFrame.src = '';
  document.body.style.overflow = '';
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
}

document.querySelectorAll('.works__item[data-lp]').forEach(item => {
  item.addEventListener('click', () => {
    openLpViewer(item.dataset.lp, item.dataset.title);
  });
});

lpViewerClose.addEventListener('click', closeLpViewer);

/* iframeにマウスが入ったら親カーソルを非表示 */
lpViewerFrame.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
lpViewerFrame.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});
