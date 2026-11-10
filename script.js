(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
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

  // Reveal animations are progressive enhancements; all content remains visible without GSAP.
  if (!reduced && window.gsap) {
    document.documentElement.classList.add("js-motion");
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero-copy > *", { y: 24, opacity: 0, duration: .85, stagger: .1, ease: "power3.out", delay: .15 });
    gsap.from(".hero-art", { scale: .88, opacity: 0, duration: 1.2, ease: "power3.out", delay: .3 });
    gsap.utils.toArray(".reveal").forEach(el => gsap.to(el, {
      opacity: 1, y: 0, duration: .75, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    }));
    gsap.utils.toArray(".section-kicker").forEach(el => gsap.from(el, {
      opacity: 0, x: -18, duration: .7,
      scrollTrigger: { trigger: el, start: "top 90%", once: true }
    }));
  }

  // Three.js neural constellation background. CSS artwork remains as a fallback.
  const canvas = document.getElementById("neural-canvas");
  if (!canvas || !window.THREE || reduced) return;
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
    camera.position.z = 16;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    const count = innerWidth < 700 ? 55 : 95;
    const points = [];
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const point = new THREE.Vector3((Math.random() - .5) * 27, (Math.random() - .5) * 17, (Math.random() - .5) * 9);
      points.push(point);
      positions.set(point.toArray(), i * 3);
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
      cloud.rotation.y += .00045;
      lines.rotation.y += .00045;
      cloud.rotation.x += (pointerY - cloud.rotation.x) * .015;
      lines.rotation.x = cloud.rotation.x;
      camera.position.x += (pointerX - camera.position.x) * .012;
      renderer.render(scene, camera);
    };
    render();
    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      paused = document.hidden;
      if (paused) cancelAnimationFrame(raf);
      else render();
    });
  } catch (error) {
    console.warn("3D background unavailable; using CSS visuals.", error);
  }
})();