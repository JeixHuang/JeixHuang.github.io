document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeKey = "jeix-theme-choice";
  const localeKey = "jeix-locale";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const reducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const finePointer = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
  const localeButtons = Array.from(document.querySelectorAll("[data-locale-option]"));
  const revealTargets = Array.from(document.querySelectorAll(".identity-rail, .intro-section, .section-head, .work-entry, .site-footer"));
  const workEntries = Array.from(document.querySelectorAll(".work-entry"));

  function readPersisted(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  function resolvedTheme(choice) {
    if (choice === "system") return media && media.matches ? "dark" : "light";
    return choice === "light" ? "light" : "dark";
  }

  function applyTheme(choice, shouldPersist = false) {
    const safeChoice = ["light", "dark", "system"].includes(choice) ? choice : "dark";
    const theme = resolvedTheme(safeChoice);
    root.dataset.themeChoice = safeChoice;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeOption === safeChoice));
    });
    if (shouldPersist) persist(themeKey, safeChoice);
    root.dispatchEvent(new CustomEvent("jeix:themechange", { detail: { theme } }));
  }

  function applyLocale(locale, shouldPersist = false) {
    const safeLocale = locale === "zh" ? "zh" : "en";
    root.dataset.locale = safeLocale;
    root.lang = safeLocale === "zh" ? "zh-CN" : "en-US";
    localeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.localeOption === safeLocale));
    });
    if (shouldPersist) persist(localeKey, safeLocale);
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeOption, true));
  });

  localeButtons.forEach((button) => {
    button.addEventListener("click", () => applyLocale(button.dataset.localeOption, true));
  });

  function setupMotion() {
    const motionIsReduced = reducedMotion && reducedMotion.matches;
    root.dataset.motion = motionIsReduced ? "reduced" : "ready";

    revealTargets.forEach((target) => target.classList.add("reveal-target"));

    if (motionIsReduced || !("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -7% 0px",
      threshold: 0.08,
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  function setupPointerLight() {
    if ((reducedMotion && reducedMotion.matches) || !(finePointer && finePointer.matches)) return;

    let pointerFrame = 0;
    let pointerX = window.innerWidth * 0.76;
    let pointerY = window.innerHeight * 0.18;

    document.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;

      pointerFrame = window.requestAnimationFrame(() => {
        root.style.setProperty("--cursor-x", `${pointerX}px`);
        root.style.setProperty("--cursor-y", `${pointerY}px`);
        pointerFrame = 0;
      });
    }, { passive: true });

    workEntries.forEach((entry) => {
      entry.addEventListener("pointermove", (event) => {
        const bounds = entry.getBoundingClientRect();
        entry.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
        entry.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  function setupFlowField() {
    const canvas = document.querySelector("#flow-field");
    if (!canvas || typeof canvas.getContext !== "function") return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const compact = window.matchMedia ? window.matchMedia("(max-width: 720px)") : null;
    const glyphs = ["01", "<>", "Δ", "λ", "+", "×", "∴"];
    const pointer = { x: 0.76, y: 0.22, active: false };
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let particles = [];
    let frameId = 0;
    let frameCount = 0;
    let lastPaint = 0;
    let scrollOffset = window.scrollY || 0;

    function palette() {
      return root.dataset.theme === "dark"
        ? {
            primary: [118, 207, 193],
            secondary: [121, 137, 255],
            warm: [226, 173, 111],
            alpha: 1,
          }
        : {
            primary: [8, 127, 117],
            secondary: [74, 88, 168],
            warm: [164, 101, 31],
            alpha: 0.72,
          };
    }

    function rgba(color, alpha) {
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    }

    function pseudoRandom(seed) {
      const value = Math.sin(seed * 917.371 + 41.73) * 43758.5453;
      return value - Math.floor(value);
    }

    function seedParticles() {
      const count = compact && compact.matches ? 34 : 76;
      canvas.dataset.particles = String(count);
      particles = Array.from({ length: count }, (_, index) => ({
        phase: pseudoRandom(index + 1),
        lane: index % 2,
        strand: pseudoRandom(index + 11) * 2 - 1,
        speed: 0.52 + pseudoRandom(index + 23) * 0.72,
        size: 0.7 + pseudoRandom(index + 37) * 1.6,
        glyph: glyphs[index % glyphs.length],
        glyphMode: index % 7 === 0,
      }));
    }

    function resize() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      const ratioCap = compact && compact.matches ? 1.35 : 1.8;
      pixelRatio = Math.min(window.devicePixelRatio || 1, ratioCap);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seedParticles();
    }

    function waveY(x, time, lane, strand = 0) {
      const center = height * (lane === 0 ? 0.31 : 0.69);
      const primaryWave = Math.sin(x * 0.0062 + time * 0.00042 + lane * 2.8) * height * 0.055;
      const secondaryWave = Math.sin(x * 0.0021 - time * 0.00019 + lane * 1.4) * height * 0.034;
      const drift = Math.sin(time * 0.00024 + lane * 1.9) * height * 0.018;
      const parallax = (scrollOffset % Math.max(height, 1)) * (lane === 0 ? -0.022 : 0.016);
      let y = center + primaryWave + secondaryWave + drift + strand * 16 + parallax;

      if (pointer.active && finePointer && finePointer.matches) {
        const pointerX = pointer.x * width;
        const pointerY = pointer.y * height;
        const distance = (x - pointerX) / Math.max(width * 0.2, 1);
        y += (pointerY - y) * Math.exp(-(distance * distance)) * 0.12;
      }

      return y;
    }

    function drawCore(time, colors) {
      const mobile = compact && compact.matches;
      const centerX = width * (mobile ? 0.82 : 0.76);
      const centerY = height * (mobile ? 0.19 : 0.24) + Math.sin(time * 0.00028) * 7 - scrollOffset * 0.012;
      const radius = Math.min(width, height) * (mobile ? 0.16 : 0.205);
      const glow = context.createRadialGradient(centerX, centerY, radius * 0.04, centerX, centerY, radius * 1.18);
      glow.addColorStop(0, rgba(colors.secondary, 0.09 * colors.alpha));
      glow.addColorStop(0.46, rgba(colors.primary, 0.06 * colors.alpha));
      glow.addColorStop(1, rgba(colors.primary, 0));
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.18, 0, Math.PI * 2);
      context.fill();

      for (let ring = 0; ring < 4; ring += 1) {
        const ringRadius = radius * (0.48 + ring * 0.17);
        const start = time * (0.00011 + ring * 0.000015) * (ring % 2 ? -1 : 1) + ring;
        context.save();
        context.translate(centerX, centerY);
        context.rotate(-0.18 + ring * 0.07);
        context.scale(1, 0.46 + ring * 0.035);
        context.setLineDash([ringRadius * 0.32, ringRadius * 0.12]);
        context.lineDashOffset = -time * (0.012 + ring * 0.003);
        context.strokeStyle = rgba(ring % 2 ? colors.secondary : colors.primary, (0.12 - ring * 0.015) * colors.alpha);
        context.lineWidth = ring === 0 ? 1.2 : 0.72;
        context.beginPath();
        context.arc(0, 0, ringRadius, start, start + Math.PI * 1.58);
        context.stroke();
        context.restore();
      }

      const orbitCount = mobile ? 10 : 18;
      for (let index = 0; index < orbitCount; index += 1) {
        const angle = time * (0.00013 + (index % 3) * 0.000018) + index * 2.399;
        const orbit = radius * (0.52 + (index % 5) * 0.075);
        const x = centerX + Math.cos(angle) * orbit;
        const y = centerY + Math.sin(angle) * orbit * 0.48;
        context.fillStyle = rgba(index % 4 === 0 ? colors.warm : colors.primary, (0.26 + (index % 3) * 0.08) * colors.alpha);
        context.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    }

    function drawStreams(time, colors) {
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, rgba(colors.primary, 0));
      gradient.addColorStop(0.18, rgba(colors.primary, 0.22 * colors.alpha));
      gradient.addColorStop(0.52, rgba(colors.secondary, 0.28 * colors.alpha));
      gradient.addColorStop(0.82, rgba(colors.primary, 0.2 * colors.alpha));
      gradient.addColorStop(1, rgba(colors.primary, 0));

      context.strokeStyle = gradient;
      context.lineCap = "round";

      for (let lane = 0; lane < 2; lane += 1) {
        for (let strand = -4; strand <= 4; strand += 1) {
          context.globalAlpha = 0.3 + (4 - Math.abs(strand)) * 0.07;
          context.lineWidth = strand === 0 ? 1.15 : 0.48;
          context.beginPath();
          for (let x = -24; x <= width + 24; x += 22) {
            const y = waveY(x, time + strand * 118, lane, strand);
            if (x === -24) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }

      context.globalAlpha = 1;
    }

    function drawParticles(time, colors) {
      const mobile = compact && compact.matches;
      context.font = `${mobile ? 6 : 7}px "SFMono-Regular", Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      particles.forEach((particle, index) => {
        const direction = particle.lane === 0 ? 1 : -1;
        const progress = (particle.phase + direction * time * 0.000018 * particle.speed + 4) % 1;
        const x = direction === 1 ? progress * (width + 100) - 50 : (1 - progress) * (width + 100) - 50;
        const y = waveY(x, time, particle.lane, particle.strand * 5);
        const color = index % 9 === 0 ? colors.warm : index % 4 === 0 ? colors.secondary : colors.primary;
        const pulse = 0.52 + Math.sin(time * 0.002 + index) * 0.22;

        context.save();
        context.translate(x, y);
        context.rotate(Math.sin(time * 0.0007 + index) * 0.28);
        if (particle.glyphMode && !mobile) {
          context.fillStyle = rgba(color, pulse * 0.62 * colors.alpha);
          context.fillText(particle.glyph, 0, 0);
        } else {
          context.strokeStyle = rgba(color, pulse * 0.84 * colors.alpha);
          context.lineWidth = 0.7;
          const size = particle.size + pulse;
          context.beginPath();
          context.moveTo(-size * 2.1, 0);
          context.lineTo(size * 2.1, 0);
          context.moveTo(0, -size * 2.1);
          context.lineTo(0, size * 2.1);
          context.stroke();
          context.fillStyle = rgba(color, pulse * colors.alpha);
          context.fillRect(-0.75, -0.75, 1.5, 1.5);
        }
        context.restore();
      });
    }

    function paint(timestamp = 0, singleFrame = false) {
      const minimumFrameTime = compact && compact.matches ? 32 : 20;
      if (!singleFrame && timestamp - lastPaint < minimumFrameTime) {
        frameId = window.requestAnimationFrame(paint);
        return;
      }

      lastPaint = timestamp;
      const colors = palette();
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = root.dataset.theme === "dark" ? "lighter" : "source-over";
      drawCore(timestamp, colors);
      drawStreams(timestamp, colors);
      drawParticles(timestamp, colors);
      context.globalCompositeOperation = "source-over";
      frameCount += 1;
      canvas.dataset.frame = String(frameCount);

      if (!singleFrame) frameId = window.requestAnimationFrame(paint);
    }

    function stop() {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function syncMotion() {
      stop();
      const motionIsReduced = reducedMotion && reducedMotion.matches;
      if (motionIsReduced) {
        root.dataset.flow = "static";
        paint(0, true);
      } else if (document.hidden) {
        root.dataset.flow = "paused";
      } else {
        root.dataset.flow = "active";
        frameId = window.requestAnimationFrame(paint);
      }
    }

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resize();
        syncMotion();
        resizeFrame = 0;
      });
    }, { passive: true });

    window.addEventListener("scroll", () => {
      scrollOffset = window.scrollY || 0;
    }, { passive: true });

    if (finePointer && finePointer.matches) {
      document.addEventListener("pointermove", (event) => {
        pointer.x = event.clientX / Math.max(width, 1);
        pointer.y = event.clientY / Math.max(height, 1);
        pointer.active = true;
        canvas.dataset.pointer = "active";
      }, { passive: true });
      document.addEventListener("pointerleave", () => {
        pointer.active = false;
        canvas.dataset.pointer = "idle";
      }, { passive: true });
    }

    document.addEventListener("visibilitychange", syncMotion);
    root.addEventListener("jeix:themechange", () => {
      if (reducedMotion && reducedMotion.matches) paint(0, true);
    });
    if (reducedMotion) reducedMotion.addEventListener("change", syncMotion);
    if (compact) compact.addEventListener("change", () => {
      resize();
      syncMotion();
    });

    resize();
    syncMotion();
  }

  if (media) {
    media.addEventListener("change", () => {
      if (root.dataset.themeChoice === "system") applyTheme("system");
    });
  }

  applyTheme(readPersisted(themeKey, root.dataset.themeChoice || "dark"));
  applyLocale(readPersisted(localeKey, root.dataset.locale || "en"));
  setupMotion();
  setupPointerLight();
  setupFlowField();
});
