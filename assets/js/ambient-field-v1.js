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

  function pseudoRandom(seed) {
    var value = Math.sin(seed * 917.371 + 41.73) * 43758.5453;
    return value - Math.floor(value);
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

  function homePalette() {
    return root.dataset.theme === "dark"
      ? {
          primary: [120, 232, 219],
          blue: [111, 134, 255],
          violet: [154, 98, 255],
          highlight: [233, 252, 255],
          warm: [242, 182, 109],
          energy: 1,
        }
      : {
          primary: [7, 122, 113],
          blue: [52, 73, 171],
          violet: [101, 70, 153],
          highlight: [16, 72, 78],
          warm: [154, 91, 25],
          energy: 0.72,
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

  function setupHomeField(canvas, isUserPaused) {
    var context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    var compact = window.matchMedia ? window.matchMedia("(max-width: 720px)") : null;
    var finePointer = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;
    var width = 1;
    var height = 1;
    var pixelRatio = 1;
    var frameId = 0;
    var frameCount = 0;
    var lastPaint = 0;
    var scrollOffset = window.scrollY || 0;
    var protectors = [];
    var stars = [];
    var pointer = { targetX: 0, targetY: 0, x: 0, y: 0, active: false };

    canvas.dataset.render = "latent-loom";

    function seedStars() {
      var count = compact && compact.matches ? 18 : 38;
      stars = Array.from({ length: count }, function (_, index) {
        return {
          x: pseudoRandom(index + 9),
          y: pseudoRandom(index + 71),
          size: 0.45 + pseudoRandom(index + 117) * 1.05,
          phase: pseudoRandom(index + 193) * Math.PI * 2,
        };
      });
    }

    function measureProtectors() {
      var nodes = Array.prototype.slice.call(document.querySelectorAll(".avatar-frame, .identity-copy, .profile-links, .intro-copy, .work-entry"));
      protectors = nodes.map(function (node) {
        var rect = node.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          strength: node.classList.contains("work-entry") ? 0.82 : 0.74,
        };
      });
    }

    function resize() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      var mobile = Boolean(compact && compact.matches);
      var pixelBudget = mobile ? 1000000 : 3000000;
      var ratioFromBudget = Math.sqrt(pixelBudget / Math.max(width * height, 1));
      pixelRatio = clamp(Math.min(window.devicePixelRatio || 1, ratioFromBudget, mobile ? 1.25 : 1.6), 0.8, mobile ? 1.25 : 1.6);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      canvas.dataset.dpr = pixelRatio.toFixed(2);
      canvas.dataset.backingPixels = String(canvas.width * canvas.height);
      canvas.dataset.primitives = String(mobile ? 26 : 51);
      seedStars();
      measureProtectors();
    }

    function drawStarfield(time, colors, energy) {
      stars.forEach(function (star, index) {
        var pulse = 0.48 + Math.sin(time * 0.00044 + star.phase) * 0.24;
        var drift = ((time * 0.0018 * (0.4 + (index % 5) * 0.1)) % (height + 40)) - 20;
        var y = (star.y * height + drift) % (height + 40) - 20;
        var color = index % 7 === 0 ? colors.violet : colors.primary;
        context.fillStyle = rgba(color, pulse * 0.16 * colors.energy * energy);
        context.beginPath();
        context.arc(star.x * width, y, star.size, 0, Math.PI * 2);
        context.fill();
      });
    }

    function drawHalo(centerX, centerY, radius, colors, energy) {
      var glow = context.createRadialGradient(centerX, centerY, radius * 0.05, centerX, centerY, radius * 1.42);
      glow.addColorStop(0, rgba(colors.highlight, 0.085 * colors.energy * energy));
      glow.addColorStop(0.3, rgba(colors.violet, 0.075 * colors.energy * energy));
      glow.addColorStop(0.62, rgba(colors.primary, 0.045 * colors.energy * energy));
      glow.addColorStop(1, rgba(colors.primary, 0));
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.42, 0, Math.PI * 2);
      context.fill();
    }

    function drawTelemetry(centerX, centerY, radius, time, colors, energy) {
      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.16);
      context.setLineDash([3, 12]);
      context.lineDashOffset = -time * 0.006;
      [0.9, 1.12].forEach(function (scale, index) {
        context.strokeStyle = rgba(index ? colors.blue : colors.primary, (index ? 0.075 : 0.11) * colors.energy * energy);
        context.lineWidth = index ? 0.7 : 0.9;
        context.beginPath();
        context.ellipse(0, 0, radius * scale, radius * scale * 0.42, 0, -0.7 + index, 3.7 + index);
        context.stroke();
      });
      context.restore();
    }

    function drawManifold(time, colors, energy) {
      var mobile = Boolean(compact && compact.matches);
      var strandCount = mobile ? 6 : 10;
      var samples = mobile ? 72 : 108;
      var scrollProgress = clamp(scrollOffset / Math.max(height * 0.92, 1), 0, 1);
      var fieldEnergy = energy * (1 - scrollProgress * 0.58);
      var centerX = width * (mobile ? 0.76 : 0.755);
      var centerY = height * (mobile ? 0.235 : 0.295) - Math.min(scrollOffset, height * 1.8) * 0.017;
      var radius = Math.min(width, height) * (mobile ? 0.31 : 0.36);
      var fold = Math.sin(time * Math.PI * 2 / 12600) * 0.82;
      var rotateY = time * Math.PI * 2 / 30000 + 0.18 + pointer.x * 0.12;
      var rotateX = -0.24 + Math.sin(time * Math.PI * 2 / 17400) * 0.08 + pointer.y * 0.1;
      var options = {
        centerX: centerX,
        centerY: centerY,
        radius: radius,
        rotateX: rotateX,
        rotateY: rotateY,
        expand: 1 + scrollProgress * 0.13,
      };
      var segments = [];
      var strands = [];
      var signalPhase = (time % 8200) / 8200;

      drawHalo(centerX, centerY, radius, colors, fieldEnergy);
      drawTelemetry(centerX, centerY, radius, time, colors, fieldEnergy);

      for (var strandIndex = 0; strandIndex < strandCount; strandIndex += 1) {
        var strand = strandIndex - (strandCount - 1) / 2;
        var points = [];
        for (var sample = 0; sample <= samples; sample += 1) {
          var u = sample / samples * Math.PI * 2;
          points.push(rotateAndProject(pointOnManifold(u, strand, fold), options));
        }
        strands.push(points);
        for (var segmentIndex = 1; segmentIndex < points.length; segmentIndex += 1) {
          var first = points[segmentIndex - 1];
          var second = points[segmentIndex];
          var normalizedU = second.u / (Math.PI * 2);
          var signalDistance = Math.abs(normalizedU - signalPhase);
          signalDistance = Math.min(signalDistance, 1 - signalDistance);
          segments.push({
            first: first,
            second: second,
            depth: (first.z + second.z) * 0.5,
            strand: strandIndex,
            signal: Math.exp(-(signalDistance * signalDistance) / 0.0018),
          });
        }
      }

      context.save();
      context.globalCompositeOperation = root.dataset.theme === "dark" ? "lighter" : "source-over";
      context.lineCap = "round";

      for (var rung = 9; rung < samples; rung += 14) {
        context.strokeStyle = rgba(colors.violet, 0.055 * colors.energy * fieldEnergy);
        context.lineWidth = 0.55;
        context.beginPath();
        strands.forEach(function (strandPoints, index) {
          var point = strandPoints[rung];
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.stroke();
      }

      segments.sort(function (a, b) { return a.depth - b.depth; });
      segments.forEach(function (segment) {
        var depth = clamp((segment.depth + 0.85) / 1.7, 0, 1);
        var strandDistance = Math.abs(segment.strand - (strandCount - 1) / 2);
        var color = segment.strand % 3 === 0 ? colors.violet : segment.strand % 2 === 0 ? colors.blue : colors.primary;
        var alpha = (0.026 + depth * 0.15 + Math.max(0, 2.8 - strandDistance) * 0.014 + segment.signal * 0.2) * colors.energy * fieldEnergy;
        context.strokeStyle = rgba(color, alpha);
        context.lineWidth = 0.42 + depth * 0.92 + segment.signal * 0.74;
        context.beginPath();
        context.moveTo(segment.first.x, segment.first.y);
        context.lineTo(segment.second.x, segment.second.y);
        context.stroke();
      });

      var centerStrand = strands[Math.floor(strands.length / 2)];
      [0, 0.42].forEach(function (offset, packetIndex) {
        var packetProgress = (signalPhase + offset) % 1;
        var pointIndex = Math.floor(packetProgress * samples);
        var packet = centerStrand[pointIndex];
        var packetColor = packetIndex === 0 ? colors.highlight : colors.warm;
        context.shadowBlur = packetIndex === 0 ? 18 : 12;
        context.shadowColor = rgba(packetColor, 0.72 * fieldEnergy);
        context.fillStyle = rgba(packetColor, (packetIndex === 0 ? 0.88 : 0.66) * colors.energy * fieldEnergy);
        context.beginPath();
        context.arc(packet.x, packet.y, packetIndex === 0 ? 2.5 : 1.8, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;

      for (var nodeIndex = 7; nodeIndex < samples; nodeIndex += 17) {
        var node = centerStrand[nodeIndex];
        var nodeDepth = clamp((node.z + 0.8) / 1.6, 0, 1);
        context.fillStyle = rgba(nodeIndex % 3 ? colors.primary : colors.warm, (0.18 + nodeDepth * 0.32) * colors.energy * fieldEnergy);
        context.beginPath();
        context.arc(node.x, node.y, 0.8 + nodeDepth * 0.9, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }

    function eraseProtectedContent() {
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.filter = "blur(28px)";
      protectors.forEach(function (rect) {
        if (rect.y > height + 100 || rect.y + rect.height < -100) return;
        context.fillStyle = "rgba(0, 0, 0, " + rect.strength + ")";
        context.fillRect(rect.x - 8, rect.y - 8, rect.width + 16, rect.height + 16);
      });
      context.filter = "none";
      context.restore();
    }

    function paint(timestamp, singleFrame) {
      timestamp = timestamp || 0;
      var mobile = Boolean(compact && compact.matches);
      var minimumFrameTime = mobile ? 42 : 32;
      if (!singleFrame && timestamp - lastPaint < minimumFrameTime) {
        frameId = window.requestAnimationFrame(paint);
        return;
      }

      var paintStart = performance.now();
      lastPaint = timestamp;
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      context.clearRect(0, 0, width, height);
      var colors = homePalette();
      var energy = 1;
      drawStarfield(timestamp, colors, energy);
      drawManifold(timestamp, colors, energy);
      eraseProtectedContent();
      frameCount += 1;
      if (frameCount === 1 || frameCount % 4 === 0) canvas.dataset.frame = String(frameCount);
      if (frameCount === 1 || frameCount % 12 === 0) canvas.dataset.paintMs = (performance.now() - paintStart).toFixed(2);
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

    var measureFrame = 0;
    window.addEventListener("scroll", function () {
      scrollOffset = window.scrollY || 0;
      if (measureFrame) return;
      measureFrame = window.requestAnimationFrame(function () {
        measureProtectors();
        measureFrame = 0;
      });
    }, { passive: true });

    if (finePointer && finePointer.matches) {
      document.addEventListener("pointermove", function (event) {
        pointer.targetX = clamp((event.clientX / Math.max(width, 1) - 0.5) * 2, -1, 1);
        pointer.targetY = clamp((event.clientY / Math.max(height, 1) - 0.5) * 2, -1, 1);
        if (!pointer.active) {
          pointer.active = true;
          canvas.dataset.pointer = "active";
        }
      }, { passive: true });
      document.addEventListener("pointerleave", function () {
        pointer.targetX = 0;
        pointer.targetY = 0;
        pointer.active = false;
        canvas.dataset.pointer = "idle";
      }, { passive: true });
    }

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

    resize();
    sync();
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
