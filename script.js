document.addEventListener('DOMContentLoaded', () => {
 
  /* ==========================================
     1. HEADER — scroll effect + active link
  ========================================== */
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('section[id]');
 
  function onScroll() {
    // Encolhe header ao rolar
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
 
    // Destaca link ativo conforme seção visível
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
 
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
 
  window.addEventListener('scroll', onScroll, { passive: true });
 
 
  /* ==========================================
     2. MENU MOBILE — hamburger toggle
  ========================================== */
  const nav = document.querySelector('nav');
  const navUl = document.querySelector('nav ul');
 
  // Cria botão hamburger dinamicamente
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Abrir menu');
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  header.querySelector('.nav').appendChild(hamburger);
 
  hamburger.addEventListener('click', () => {
    const isOpen = navUl.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
 
  // Fecha menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navUl.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
 
  // Fecha menu ao clicar fora
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      navUl.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
 
 
  /* ==========================================
     3. ANIMAÇÕES DE ENTRADA — Intersection Observer
  ========================================== */
  // Adiciona classes base em todos os elementos animáveis
  const animTargets = document.querySelectorAll(
    '.textp h1, .textp p, .btn, .beneficio h2, .beneficio > p, ' +
    '.card-orange, .card-black, .proj h2, .cardproj, .rodape'
  );
 
  animTargets.forEach((el, i) => {
    el.classList.add('fade-up');
    // Delay escalonado por grupos
    el.style.transitionDelay = `${(i % 5) * 80}ms`;
  });
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  }, { threshold: 0.15 });
 
  animTargets.forEach(el => observer.observe(el));
 
 
  /* ==========================================
     4. CONTADOR ANIMADO — stats (se existirem)
     Adiciona contadores automáticos a elementos
     com data-count="valor"
  ========================================== */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
 
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, step);
  }
 
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
 
  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });
 
 
  /* ==========================================
     5. PARTÍCULAS FLUTUANTES NO HERO
  ========================================== */
  const hero = document.querySelector('.principal');
 
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0.35;
    `;
    hero.appendChild(canvas);
 
    // Garante que conteúdo fique acima do canvas
    const heroContent = hero.querySelector('.textp');
    if (heroContent) heroContent.style.position = 'relative';
 
    const ctx = canvas.getContext('2d');
    let W, H, particles;
 
    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }
 
    function createParticles() {
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
      }));
    }
 
    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
 
      // Linhas de conexão
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(242, 101, 34, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
 
      // Pontos
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 101, 34, ${p.alpha})`;
        ctx.fill();
 
        p.x += p.vx;
        p.y += p.vy;
 
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
 
      requestAnimationFrame(drawParticles);
    }
 
    resize();
    createParticles();
    drawParticles();
 
    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }
 
 
  /* ==========================================
     6. SMOOTH SCROLL — âncoras internas
  ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
 
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
 
 
  /* ==========================================
     7. CURSOR GLOW — efeito de brilho no mouse
  ========================================== */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
 
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
 
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
 
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
 
 
  /* ==========================================
     8. BOTÃO "VOLTAR AO TOPO"
  ========================================== */
  const toTop = document.createElement('button');
  toTop.className = 'btn-topo';
  toTop.setAttribute('aria-label', 'Voltar ao topo');
  toTop.innerHTML = '↑';
  document.body.appendChild(toTop);
 
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
 
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
 
});
 
 
/* ==========================================
   ESTILOS INJETADOS VIA JS
   (complementam o style.css)
========================================== */
const styleJS = document.createElement('style');
styleJS.textContent = `
 
  /* ---- Header scrolled ---- */
  header.scrolled {
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    border-bottom-color: rgba(242,101,34,0.35);
  }
 
  /* ---- Link ativo ---- */
  nav ul li a.active {
    color: #F26522;
  }
  nav ul li a.active::after {
    width: 100%;
  }
 
  /* ---- Hamburger ---- */
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 28px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 200;
  }
 
  .hamburger span {
    display: block;
    width: 100%;
    height: 2px;
    background: #FFFFFF;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }
 
  .hamburger.active span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  .hamburger.active span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .hamburger.active span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
 
  @media (max-width: 768px) {
    .hamburger { display: flex; }
 
    nav ul {
      position: fixed;
      top: 0;
      right: -100%;
      width: 75%;
      max-width: 320px;
      height: 100vh;
      background: #1A1A1A;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      transition: right 0.4s cubic-bezier(.77,0,.18,1);
      border-left: 1px solid rgba(242,101,34,0.2);
      z-index: 100;
    }
 
    nav ul.open {
      right: 0;
    }
 
    nav ul li a {
      font-size: 1rem;
      letter-spacing: 2px;
    }
  }
 
  /* ---- Animações fade-up ---- */
  .fade-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
 
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
 
  /* ---- Cursor glow ---- */
  .cursor-glow {
    position: fixed;
    top: -150px;
    left: -150px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(242,101,34,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    will-change: transform;
  }
 
  /* ---- Botão voltar ao topo ---- */
  .btn-topo {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 46px;
    height: 46px;
    background: #F26522;
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
    z-index: 999;
    line-height: 1;
  }
 
  .btn-topo.show {
    opacity: 1;
    transform: translateY(0);
  }
 
  .btn-topo:hover {
    background: #FF8C42;
  }
 
`;
document.head.appendChild(styleJS);