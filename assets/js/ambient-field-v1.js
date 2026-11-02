(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var saveData = Boolean(navigator.connection && navigator.connection.saveData);
  var motionKey = "jeix-motion-choice";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function rgba(color, alpha) {
    return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")";
  }

  function pathSeed() {
    var path = window.location.pathname || "/";
    var hash = 2166136261;
    for (var index = 0; index < path.length; index += 1) {
      hash ^= path.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) || 1;
  }

  function addMediaListener(query, callback) {
    if (!query) return;
    if (typeof query.addEventListener === "function") query.addEventListener("change", callback);
    else if (typeof query.addListener === "function") query.addListener(callback);
  }

  function storedMotionChoice() {
    var choice = "active";
    try {
      choice = localStorage.getItem(motionKey) || "active";
    } catch (error) {}
    return choice === "paused" ? "paused" : "active";
  }

  function setupMotionControl() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-motion-toggle]"));
    var choice = storedMotionChoice();

    function apply(nextChoice, persist) {
      choice = nextChoice === "paused" ? "paused" : "active";
      root.dataset.userMotion = choice;
      buttons.forEach(function (button) {
        var paused = choice === "paused";
        var icon = button.querySelector("[data-motion-icon]");
        button.setAttribute("aria-pressed", paused ? "true" : "false");
        button.setAttribute("aria-label", paused ? "Resume ambient motion" : "Pause ambient motion");
        button.title = paused ? "Resume motion" : "Pause motion";
        if (icon) icon.textContent = paused ? "▶" : "Ⅱ";
      });
      if (persist) {
        try {
          localStorage.setItem(motionKey, choice);
        } catch (error) {}
      }
      root.dispatchEvent(new CustomEvent("jeix:motionchange", { detail: { choice: choice } }));
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        apply(choice === "paused" ? "active" : "paused", true);
      });
    });

    apply(choice, false);
    return function () {
      return choice === "paused";
    };
  }

  function readingPalette() {
    return root.dataset.theme === "dark"
      ? {
          primary: [94, 234, 212],
          blue: [125, 211, 252],
          violet: [139, 122, 246],
          highlight: [226, 248, 255],
          warm: [253, 164, 175],
          energy: 1,
        }
      : {
          primary: [14, 109, 102],
          blue: [0, 93, 168],
          violet: [99, 76, 152],
          highlight: [24, 76, 83],
          warm: [152, 40, 51],
          energy: 0.62,
        };
  }

  function setupHomeField(canvas, isUserPaused) {
    const context = canvas.getContext("2d");
    if (!context) return;

    // Engrave one closed line around the twisted band at each offset.
    // Cache the 3D paths; only the camera changes between frames.
    const small = canvas.closest(".brand") !== null;
    const lineCount = small ? 12 : 46;
    const points = small ? 64 : 160;
    const tau = 2 * Math.PI;
    const rings = Array.from({ length: lineCount }, (_, i) => {
      const offset = ((i / (lineCount - 1)) - 0.5) * 0.77;
      return Array.from({ length: points }, (_, j) => {
        const u = j * tau / points;
        const tilt = 2 * u - 0.55;
        const r = 0.86 + 0.08 * Math.sin(3 * u) + offset * Math.cos(tilt);
        const z = 0.27 * Math.sin(2 * u + 0.4) + offset * Math.sin(tilt);
        return [r * Math.cos(u), r * Math.sin(u), z];
      });
    });

    let phase = 0, last = 0, frame = 0, count = 0;
    let width = 0, height = 0, inView = true;
    let ink, accent;

    function palette() {
      const style = getComputedStyle(canvas);
      ink = style.getPropertyValue("--text-soft").trim();
      accent = style.getPropertyValue("--accent").trim();
    }

    function draw() {
      if (!width || !height) return;
      const yaw = -0.27 + phase;
      const pitch = 0.78 + 0.17 * Math.sin(phase * 1.3);
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const scale = Math.min(width * 0.365, height * 0.43);
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(-0.20);
      context.lineJoin = "round";
      rings.forEach((ring, i) => {
        const depth = (Math.cos(i * tau / lineCount) + 1) / 2;
        const indexLine = i === 0 || i === lineCount - 1;
        context.strokeStyle = indexLine ? accent : ink;
        context.globalAlpha = indexLine ? 0.94 : 0.34 + depth * 0.45;
        context.lineWidth = small ? 0.55 : indexLine ? 1.25 : 0.77;
        context.beginPath();
        ring.forEach(([x, y, z], j) => {
          const px = scale * (x * cy - y * sy);
          const py = scale * ((x * sy + y * cy) * cp - z * sp);
          if (j === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        });
        context.closePath();
        context.stroke();
      });
      context.restore();
      canvas.dataset.frame = String(++count);
    }

    function tick(now) {
      const elapsed = now - last;
      if (elapsed >= 1000 / 30) {
        phase += Math.min(elapsed, 64) * 0.00016;
        draw();
        last = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      const still = isUserPaused() || reduceMotion?.matches || saveData;
      canvas.dataset.state = still ? "static" : document.hidden || !inView ? "paused" : "active";
      if (canvas.dataset.state === "active") {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }

    canvas.dataset.render = "engraved-ring";
    palette();
    resize();
    sync();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      }).observe(canvas);
    }
    document.addEventListener("visibilitychange", sync);
    root.addEventListener("jeix:themechange", () => { palette(); draw(); });
    root.addEventListener("jeix:motionchange", sync);
    addMediaListener(reduceMotion, sync);
  }

  function pointOnManifold(u, strand, fold) {
    var ribbon = strand * 0.026;
    var radius = 0.79 + 0.14 * Math.cos(5 * u + fold * 0.72);
    return {
      x: radius * Math.cos(2 * u) + ribbon * Math.cos(3 * u + fold),
      y: 0.64 * Math.sin(3 * u + fold * 0.09) + ribbon * Math.sin(2 * u),
      z: 0.58 * Math.sin(5 * u + fold) + ribbon * 0.46 * Math.cos(u),
      u: u,
    };
  }

  function rotateAndProject(point, options) {
    var cosY = Math.cos(options.rotateY);
    var sinY = Math.sin(options.rotateY);
    var xY = point.x * cosY + point.z * sinY;
    var zY = -point.x * sinY + point.z * cosY;
    var cosX = Math.cos(options.rotateX);
    var sinX = Math.sin(options.rotateX);
    var yX = point.y * cosX - zY * sinX;
    var zX = point.y * sinX + zY * cosX;
    var perspective = 1.02 + zX * 0.16;
    return {
      x: options.centerX + xY * options.radius * perspective * options.expand,
      y: options.centerY + yX * options.radius * perspective,
      z: zX,
      u: point.u,
    };
  }

  function setupReadingField(canvas, isUserPaused) {
    var context = canvas.getContext("2d", { alpha: true });
    var content = document.querySelector(".post-content");
    var toc = document.querySelector(".post-toc");
    if (!context || !content) return;

    var compact = window.matchMedia ? window.matchMedia("(max-width: 980px)") : null;
    var seed = pathSeed();
    var width = 1;
    var height = 1;
    var pixelRatio = 1;
    var frameId = 0;
    var frameCount = 0;
    var lastPaint = 0;
    var progress = 0;
    var quietLeft = 0;
    var quietRight = 0;
    var tocRect = null;
    var readingFocus = false;

    canvas.dataset.render = "quiet-core";

    function measureReadingPlane() {
      var contentRect = content.getBoundingClientRect();
      var moat = compact && compact.matches ? 0 : 36;
      quietLeft = Math.max(0, contentRect.left - moat);
      quietRight = Math.min(width, contentRect.right + moat);
      if (toc) {
        var measuredToc = toc.getBoundingClientRect();
        tocRect = { x: measuredToc.left, y: measuredToc.top, width: measuredToc.width, height: measuredToc.height };
      } else {
        tocRect = null;
      }
      canvas.dataset.quietLeft = quietLeft.toFixed(1);
      canvas.dataset.quietRight = quietRight.toFixed(1);
    }

    function updateProgress() {
      var doc = document.documentElement;
      var available = Math.max(doc.scrollHeight - window.innerHeight, 1);
      progress = clamp((window.scrollY || 0) / available, 0, 1);
      canvas.dataset.progress = progress.toFixed(3);
    }

    function resize() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      var mobile = Boolean(compact && compact.matches);
      var pixelBudget = mobile ? 590000 : 1490000;
      var ratioFromBudget = Math.sqrt(pixelBudget / Math.max(width * height, 1));
      pixelRatio = clamp(Math.min(window.devicePixelRatio || 1, ratioFromBudget, mobile ? 1.15 : 1.35), 0.72, mobile ? 1.15 : 1.35);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      canvas.dataset.dpr = pixelRatio.toFixed(2);
      canvas.dataset.backingPixels = String(canvas.width * canvas.height);
      canvas.dataset.mode = mobile ? "edge" : "gutter";
      canvas.dataset.primitives = String(mobile ? 11 : 26);
      measureReadingPlane();
      updateProgress();
    }

    function edgePoint(u, strand, phase, side) {
      var point = pointOnManifold(u, strand, phase);
      var options = {
        centerX: side > 0 ? width * 1.045 : -width * 0.11,
        centerY: side > 0 ? height * 0.3 : height * 0.76,
        radius: Math.min(width, height) * (side > 0 ? 0.34 : 0.27),
        rotateX: side > 0 ? -0.3 : 0.22,
        rotateY: (side > 0 ? 0.34 : -0.55) + phase * 0.16,
        expand: 1,
      };
      return rotateAndProject(point, options);
    }

    function drawEdgeFields(time, colors, energy) {
      var mobile = Boolean(compact && compact.matches);
      var strands = mobile ? 3 : 5;
      var samples = mobile ? 48 : 72;
      var phase = time * Math.PI * 2 / 44000 + (seed % 997) / 997 * Math.PI;
      var segments = [];

      [1, -1].forEach(function (side) {
        for (var strandIndex = 0; strandIndex < strands; strandIndex += 1) {
          var strand = strandIndex - (strands - 1) / 2;
          var previous = null;
          for (var sample = 0; sample <= samples; sample += 1) {
            var u = sample / samples * Math.PI * 2 + (side < 0 ? 0.5 : 0);
            var current = edgePoint(u, strand, phase + side * 0.7, side);
            if (previous) {
              segments.push({
                first: previous,
                second: current,
                depth: (previous.z + current.z) * 0.5,
                side: side,
                strand: strandIndex,
              });
            }
            previous = current;
          }
        }
      });

      context.save();
      context.globalCompositeOperation = root.dataset.theme === "dark" ? "lighter" : "source-over";
      context.lineCap = "round";
      segments.sort(function (a, b) { return a.depth - b.depth; });
      segments.forEach(function (segment) {
        var depth = clamp((segment.depth + 0.85) / 1.7, 0, 1);
        var color = segment.strand % 3 === 0 ? colors.violet : segment.strand % 2 === 0 ? colors.blue : colors.primary;
        var alpha = (0.024 + depth * (mobile ? 0.075 : 0.13)) * colors.energy * energy;
        context.strokeStyle = rgba(color, alpha);
        context.lineWidth = 0.5 + depth * 0.72;
        context.beginPath();
        context.moveTo(segment.first.x, segment.first.y);
        context.lineTo(segment.second.x, segment.second.y);
        context.stroke();
      });

      if (!mobile) {
        context.setLineDash([2, 13]);
        context.lineDashOffset = -time * 0.0024;
        context.strokeStyle = rgba(colors.primary, 0.07 * colors.energy * energy);
        context.beginPath();
        context.ellipse(width * 1.045, height * 0.3, Math.min(width, height) * 0.38, Math.min(width, height) * 0.16, -0.18, 1.65, 4.82);
        context.stroke();
        context.setLineDash([]);
      }

      var nodeCount = mobile ? 8 : 18;
      for (var nodeIndex = 0; nodeIndex < nodeCount; nodeIndex += 1) {
        var side = nodeIndex % 4 === 0 ? -1 : 1;
        var u = ((nodeIndex / nodeCount + time * 0.0000018) % 1) * Math.PI * 2;
        var node = edgePoint(u, (nodeIndex % strands) - (strands - 1) / 2, phase, side);
        var nodeColor = nodeIndex % 7 === 0 ? colors.warm : colors.primary;
        context.fillStyle = rgba(nodeColor, (0.14 + (nodeIndex % 3) * 0.045) * colors.energy * energy);
        context.beginPath();
        context.arc(node.x, node.y, mobile ? 0.85 : 1.05, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    function cutReadingAperture() {
      var feather = compact && compact.matches ? 10 : 112;
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 1)";
      context.fillRect(quietLeft, 0, Math.max(0, quietRight - quietLeft), height);

      if (quietLeft > 0) {
        var leftFade = context.createLinearGradient(Math.max(0, quietLeft - feather), 0, quietLeft, 0);
        leftFade.addColorStop(0, "rgba(0, 0, 0, 0)");
        leftFade.addColorStop(1, "rgba(0, 0, 0, 1)");
        context.fillStyle = leftFade;
        context.fillRect(Math.max(0, quietLeft - feather), 0, feather, height);
      }

      if (quietRight < width) {
        var rightFade = context.createLinearGradient(quietRight, 0, Math.min(width, quietRight + feather), 0);
        rightFade.addColorStop(0, "rgba(0, 0, 0, 1)");
        rightFade.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = rightFade;
        context.fillRect(quietRight, 0, feather, height);
      }

      if (tocRect && !(compact && compact.matches)) {
        context.filter = "blur(18px)";
        context.fillStyle = "rgba(0, 0, 0, 0.9)";
        context.fillRect(tocRect.x - 8, Math.max(-20, tocRect.y - 18), tocRect.width + 16, tocRect.height + 36);
      }
      context.filter = "none";
      context.restore();
    }

    function drawProgressFilament(colors, energy) {
      var mobile = Boolean(compact && compact.matches);
      var x = mobile ? 9 : Math.max(8, quietLeft + 19);
      var top = mobile ? 112 : 92;
      var bottom = Math.max(top + 60, height - 64);
      var activeY = top + (bottom - top) * progress;
      context.save();
      context.lineCap = "round";
      context.strokeStyle = rgba(colors.primary, (mobile ? 0.075 : 0.11) * colors.energy * energy);
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, bottom);
      context.stroke();
      var gradient = context.createLinearGradient(0, top, 0, activeY);
      gradient.addColorStop(0, rgba(colors.blue, 0.14 * colors.energy * energy));
      gradient.addColorStop(1, rgba(colors.primary, 0.48 * colors.energy * energy));
      context.strokeStyle = gradient;
      context.lineWidth = mobile ? 1.1 : 1.35;
      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, activeY);
      context.stroke();
      context.shadowBlur = 10;
      context.shadowColor = rgba(colors.primary, 0.5 * energy);
      context.fillStyle = rgba(colors.highlight, 0.78 * colors.energy * energy);
      context.beginPath();
      context.arc(x, activeY, mobile ? 1.7 : 2.1, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    function paint(timestamp, singleFrame) {
      timestamp = timestamp || 0;
      var mobile = Boolean(compact && compact.matches);
      var minimumFrameTime = mobile ? 66 : 54;
      if (!singleFrame && timestamp - lastPaint < minimumFrameTime) {
        frameId = window.requestAnimationFrame(paint);
        return;
      }
      var paintStart = performance.now();
      lastPaint = timestamp;
      context.clearRect(0, 0, width, height);
      var colors = readingPalette();
      var energy = readingFocus ? 0.35 : 1;
      drawEdgeFields(timestamp, colors, energy);
      cutReadingAperture();
      drawProgressFilament(colors, energy);
      frameCount += 1;
      if (frameCount === 1 || frameCount % 3 === 0) canvas.dataset.frame = String(frameCount);
      if (frameCount === 1 || frameCount % 9 === 0) canvas.dataset.paintMs = (performance.now() - paintStart).toFixed(2);
      canvas.dataset.palette = root.dataset.theme || "dark";
      if (!singleFrame) frameId = window.requestAnimationFrame(paint);
    }

    function stop() {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function isStatic() {
      return Boolean((reduceMotion && reduceMotion.matches) || saveData || isUserPaused());
    }

    function sync() {
      stop();
      if (isStatic()) {
        canvas.dataset.state = "static";
        paint(performance.now(), true);
      } else if (document.hidden) {
        canvas.dataset.state = "paused";
      } else {
        canvas.dataset.state = "active";
        frameId = window.requestAnimationFrame(paint);
      }
    }

    var resizeFrame = 0;
    window.addEventListener("resize", function () {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(function () {
        resize();
        sync();
        resizeFrame = 0;
      });
    }, { passive: true });

    var readingScrollFrame = 0;
    window.addEventListener("scroll", function () {
      if (readingScrollFrame) return;
      readingScrollFrame = window.requestAnimationFrame(function () {
        updateProgress();
        measureReadingPlane();
        if (isStatic()) paint(performance.now(), true);
        readingScrollFrame = 0;
      });
    }, { passive: true });
    document.addEventListener("visibilitychange", sync);
    root.addEventListener("jeix:themechange", function () {
      if (isStatic()) paint(performance.now(), true);
    });
    root.addEventListener("jeix:motionchange", sync);
    addMediaListener(reduceMotion, sync);
    addMediaListener(compact, function () {
      resize();
      sync();
    });

    document.addEventListener("selectionchange", function () {
      var selection = window.getSelection ? window.getSelection() : null;
      var nextFocus = Boolean(selection && !selection.isCollapsed && content.contains(selection.anchorNode));
      if (nextFocus !== readingFocus) readingFocus = nextFocus;
    });
    content.addEventListener("focusin", function () { readingFocus = true; });
    content.addEventListener("focusout", function () { readingFocus = false; });

    var themeObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-theme" && isStatic()) paint(performance.now(), true);
      });
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    resize();
    sync();
  }

  function ready() {
    var isUserPaused = setupMotionControl();
    var homeCanvas = document.querySelector("#flow-field");
    var readingCanvas = document.querySelector("#reading-field");
    if (homeCanvas) setupHomeField(homeCanvas, isUserPaused);
    if (readingCanvas) setupReadingField(readingCanvas, isUserPaused);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})();
