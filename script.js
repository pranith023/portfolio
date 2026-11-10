(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress span");
  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll progress, compact sticky header and section-aware navigation.
  let scrollTick = false;
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    header?.classList.toggle("scrolled", scrollY > 24);
    scrollTick = false;
  };
  window.addEventListener("scroll", () => {
    if (!scrollTick) {
      requestAnimationFrame(updateScrollUI);
      scrollTick = true;
    }
  }, { passive: true });
  updateScrollUI();

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Certificate preview modal.
  const modal = document.querySelector(".certificate-modal");
  const modalTitle = document.querySelector(".modal-title");
  const modalMeta = document.querySelector(".modal-meta");
  const modalImage = document.querySelector(".modal-image");
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  };
  document.querySelectorAll(".cert-open").forEach(button => button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.title || "Certificate";
    modalMeta.textContent = button.dataset.meta || "";
    modalImage.src = button.dataset.image || "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }));
  document.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  // Futuristic cursor with a damped trailing ring, desktop only.
  if (finePointer && !reduced) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("pointermove", event => {
      mx = event.clientX; my = event.clientY;
      if (dot) dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
    }, { passive: true });
    const follow = () => {
      rx += (mx - rx) * .16;
      ry += (my - ry) * .16;
      if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(follow);
    };
    follow();
    document.querySelectorAll("a,button,.project-card,.capability-card,.cert-card").forEach(el => {
      el.addEventListener("pointerenter", () => ring?.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => ring?.classList.remove("is-hover"));
    });
  }

  // GSAP motion. ScrollTrigger is optional; IntersectionObserver is the fallback.
  if (!reduced && window.gsap) {
    document.documentElement.classList.add("js-motion");
    const hasScrollTrigger = Boolean(window.ScrollTrigger);
    if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.from(".availability", { y: 18, opacity: 0, duration: .65 })
      .from(".hero-copy .eyebrow", { x: -22, opacity: 0, duration: .55 }, "-=.38")
      .from(".hero h1", { y: 38, opacity: 0, duration: .9 }, "-=.3")
      .from(".hero-description", { y: 18, opacity: 0, duration: .65 }, "-=.45")
      .from(".hero-actions .button", { y: 16, opacity: 0, stagger: .12, duration: .55 }, "-=.35")
      .from(".hero-meta", { opacity: 0, y: 12, duration: .5 }, "-=.25")
      .from(".hero-art", { scale: .86, opacity: 0, rotateY: -12, duration: 1.2 }, "-=1.05")
      .from(".floating-chip", { opacity: 0, scale: .75, stagger: .16, duration: .45 }, "-=.7");

    const revealElements = gsap.utils.toArray(".reveal");
    const revealOne = (element, delay = 0) => gsap.fromTo(element,
      { opacity: 0, y: 34, rotateX: 2 },
      { opacity: 1, y: 0, rotateX: 0, duration: .78, delay, ease: "power2.out", clearProps: "transform" }
    );

    if (hasScrollTrigger) {
      revealElements.forEach((element, index) => {
        gsap.fromTo(element,
          { opacity: 0, y: 34, rotateX: 2 },
          { opacity: 1, y: 0, rotateX: 0, duration: .78, delay: (index % 3) * .06,
            ease: "power2.out", clearProps: "transform",
            scrollTrigger: { trigger: element, start: "top 90%", once: true }
          }
        );
      });

      gsap.utils.toArray(".section-kicker").forEach(element => {
        ScrollTrigger.create({
          trigger: element, start: "top 88%", once: true,
          onEnter: () => element.classList.add("is-visible")
        });
      });
      gsap.to(".hero-art", {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 }
      });
      gsap.to(".hero-copy", {
        yPercent: 5, opacity: .55, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 }
      });
    } else if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          revealOne(entry.target);
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .04 });
      revealElements.forEach(element => revealObserver.observe(element));

      const kickerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          kickerObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".section-kicker").forEach(element => kickerObserver.observe(element));
    } else {
      // Older browsers: never leave portfolio content hidden.
      revealElements.forEach((element, index) => revealOne(element, (index % 3) * .06));
      document.querySelectorAll(".section-kicker").forEach(element => element.classList.add("is-visible"));
    }
  }

  // Mouse-reactive light, subtle 3D tilt and magnetic action buttons.
  if (finePointer && !reduced) {
    document.querySelectorAll(".project-card,.capability-card,.cert-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        if (card.classList.contains("project-card")) {
          const rx = ((y / rect.height) - .5) * -4;
          const ry = ((x / rect.width) - .5) * 5;
          card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
        }
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
    document.querySelectorAll(".button").forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) * .12;
        const dy = (event.clientY - rect.top - rect.height / 2) * .18;
        button.style.transform = "translate(" + dx + "px," + dy + "px)";
      });
      button.addEventListener("pointerleave", () => { button.style.transform = ""; });
    });
  }

  // Three.js neural backdrop and a separate animated 3D hero crystal.
  if (reduced || !window.THREE) return;
  try {
    const bgCanvas = document.getElementById("neural-canvas");
    if (bgCanvas) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
      camera.position.z = 16;
      const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
      renderer.setSize(innerWidth, innerHeight);
      const count = innerWidth < 700 ? 48 : 82;
      const points = [], positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const point = new THREE.Vector3((Math.random() - .5) * 27, (Math.random() - .5) * 17, (Math.random() - .5) * 9);
        points.push(point); positions.set(point.toArray(), i * 3);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const cloud = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x70ddea, size: .045, transparent: true, opacity: .72 }));
      scene.add(cloud);
      const segments = [];
      for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) {
        if (points[i].distanceTo(points[j]) < 2.35) segments.push(...points[i].toArray(), ...points[j].toArray());
      }
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
      const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x637ed2, transparent: true, opacity: .13 }));
      scene.add(lines);
      let pointerX = 0, pointerY = 0, raf = 0, paused = false;
      window.addEventListener("pointermove", event => {
        pointerX = (event.clientX / innerWidth - .5) * .35;
        pointerY = (event.clientY / innerHeight - .5) * -.25;
      }, { passive: true });
      const render = () => {
        if (paused) return;
        raf = requestAnimationFrame(render);
        cloud.rotation.y += .0004; lines.rotation.y += .0004;
        cloud.rotation.x += (pointerY - cloud.rotation.x) * .015; lines.rotation.x = cloud.rotation.x;
        camera.position.x += (pointerX - camera.position.x) * .012;
        renderer.render(scene, camera);
      };
      render();
      window.addEventListener("resize", () => {
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
      }, { passive: true });
      document.addEventListener("visibilitychange", () => {
        paused = document.hidden;
        if (paused) cancelAnimationFrame(raf); else render();
      });
    }

    const heroCanvas = document.getElementById("hero-canvas");
    if (heroCanvas) {
      const heroScene = new THREE.Scene();
      const heroCamera = new THREE.PerspectiveCamera(42, 1, .1, 100);
      heroCamera.position.z = 7.4;
      const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
      heroRenderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      const core = new THREE.Group(); heroScene.add(core);
      const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 2), new THREE.MeshBasicMaterial({ color: 0x82efff, wireframe: true, transparent: true, opacity: .64 }));
      const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.12, 1), new THREE.MeshBasicMaterial({ color: 0x9c8cff, wireframe: true, transparent: true, opacity: .33 }));
      const halo = new THREE.Mesh(new THREE.TorusGeometry(2.08, .008, 8, 160), new THREE.MeshBasicMaterial({ color: 0x65ddeb, transparent: true, opacity: .65 }));
      const haloTwo = new THREE.Mesh(new THREE.TorusGeometry(2.42, .006, 8, 160), new THREE.MeshBasicMaterial({ color: 0x9c8cff, transparent: true, opacity: .32 }));
      halo.rotation.x = Math.PI * .43; halo.rotation.y = .2;
      haloTwo.rotation.x = Math.PI * .68; haloTwo.rotation.y = -.4;
      core.add(shell, inner, halo, haloTwo);
      const nodeGeometry = new THREE.SphereGeometry(.035, 8, 8);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const node = new THREE.Mesh(nodeGeometry, new THREE.MeshBasicMaterial({ color: i % 2 ? 0x9c8cff : 0x8bf0c1 }));
        node.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 1.4, Math.sin(angle * 2) * .45);
        core.add(node);
      }
      const dustCount = 220, dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        const radius = 2.5 + Math.random() * 1.3, angle = Math.random() * Math.PI * 2;
        dustPositions.set([Math.cos(angle) * radius, (Math.random() - .5) * 4.7, Math.sin(angle) * radius], i * 3);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
      const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9cefff, size: .018, transparent: true, opacity: .6 }));
      heroScene.add(dust);
      let heroW = 1, heroH = 1, heroPointerX = 0, heroPointerY = 0, heroRaf = 0, heroPaused = false;
      const resizeHero = () => {
        const rect = heroCanvas.parentElement.getBoundingClientRect();
        heroW = Math.max(1, rect.width); heroH = Math.max(1, rect.height);
        heroCamera.aspect = heroW / heroH; heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(heroW, heroH, false);
        heroRenderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      };
      resizeHero();
      heroCanvas.parentElement.addEventListener("pointermove", event => {
        const rect = heroCanvas.parentElement.getBoundingClientRect();
        heroPointerX = ((event.clientX - rect.left) / rect.width - .5) * .55;
        heroPointerY = ((event.clientY - rect.top) / rect.height - .5) * -.35;
      }, { passive: true });
      const renderHero = () => {
        if (heroPaused) return;
        heroRaf = requestAnimationFrame(renderHero);
        core.rotation.y += .0035; core.rotation.x += .0018;
        inner.rotation.y -= .004; inner.rotation.z += .002;
        halo.rotation.z += .0017; haloTwo.rotation.z -= .0011;
        dust.rotation.y -= .00045;
        core.rotation.x += (heroPointerY - core.rotation.x) * .018;
        core.rotation.y += heroPointerX * .002;
        heroRenderer.render(heroScene, heroCamera);
      };
      renderHero();
      window.addEventListener("resize", resizeHero, { passive: true });
      document.addEventListener("visibilitychange", () => {
        heroPaused = document.hidden;
        if (heroPaused) cancelAnimationFrame(heroRaf); else renderHero();
      });
    }
  } catch (error) {
    console.warn("3D motion layer unavailable; CSS visuals remain active.", error);
  }
})();