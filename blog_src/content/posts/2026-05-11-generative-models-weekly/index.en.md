---
title: "Generative Models Weekly: May 11 - May 17, 2026"
date: "2026-05-11T12:00:00+08:00"
slug: "generative-models-weekly-2026-05-11"
translationKey: "blogger-weekly-generative-models-2026-05-11"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "sampling path · tokenizer-VAE · video distillation · 3D correspondence"
weekly_report: true
weekly_field: "Generative Models"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---

<section class="weekly-hero-memo">
  <div class="weekly-letter-topline">
    <span>Research Letter</span>
    <span>Generative Models · May 11 - May 17, 2026</span>
  </div>
  <h1 class="weekly-letter-title">Generative Models Weekly</h1>
  <div class="weekly-hero-label">Weekly Keywords</div>
  <p class="weekly-hero-thesis">sampling path · tokenizer-VAE · video distillation · 3D correspondence</p>
  <div class="weekly-keyword-grid"><div class="weekly-keyword-card">
              <span>01</span>
              <strong>sampling path</strong>
              <em>Path</em>
              <p>Flow / ODE trajectory sets step elasticity, stability, and inference cost.</p>
            </div>
<div class="weekly-keyword-card">
              <span>02</span>
              <strong>tokenizer-VAE</strong>
              <em>Representation</em>
              <p>The compression layer is becoming image-generation infrastructure.</p>
            </div>
<div class="weekly-keyword-card">
              <span>03</span>
              <strong>video distillation</strong>
              <em>Time</em>
              <p>Real-time video depends on latency, history distribution, and rollout granularity.</p>
            </div>
<div class="weekly-keyword-card">
              <span>04</span>
              <strong>3D correspondence</strong>
              <em>Geometry</em>
              <p>Image-to-3D and tracking both return to pixel, spatial, and motion consistency.</p>
            </div></div>
  <div class="weekly-hero-meta">
    <span>May 11 - May 17, 2026</span>
    <span>20 papers</span>
  </div>
</section>

<section class="weekly-section">
  <div class="weekly-section-head">
    <span>Landscape</span>
    <h2>Field Map</h2>
  </div>
  <div class="weekly-trend-grid"><article class="weekly-trend-card">
              <div class="weekly-trend-num">01</div>
              <div class="weekly-trend-copy">
                <p class="weekly-trend-axis">path</p>
                <h3>sampling path</h3>
                <p>Shared question: can the sampling trajectory move from a fixed step count to a path variable where quality, latency, and stability are discussed together?</p>
                <div class="weekly-trend-papers"><span>Related</span><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper1/">A01</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper3/">A03</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper7/">A07</a></div>
              </div>
            </article>
<article class="weekly-trend-card">
              <div class="weekly-trend-num">02</div>
              <div class="weekly-trend-copy">
                <p class="weekly-trend-axis">representation</p>
                <h3>tokenizer / VAE</h3>
                <p>Shared question: whether the compression layer preserves text, detail, and semantic hierarchy; losses here are amplified by the denoiser and editing stack.</p>
                <div class="weekly-trend-papers"><span>Related</span><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper10/">A10</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper15/">A15</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper17/">A17</a></div>
              </div>
            </article>
<article class="weekly-trend-card">
              <div class="weekly-trend-num">03</div>
              <div class="weekly-trend-copy">
                <p class="weekly-trend-axis">time</p>
                <h3>video rollout</h3>
                <p>Shared question: how video models preserve temporal structure under few-step, streaming, and multi-shot states instead of optimizing only offline clips.</p>
                <div class="weekly-trend-papers"><span>Related</span><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper4/">A04</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper6/">A06</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper12/">A12</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper13/">A13</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper14/">A14</a></div>
              </div>
            </article>
<article class="weekly-trend-card">
              <div class="weekly-trend-num">04</div>
              <div class="weekly-trend-copy">
                <p class="weekly-trend-axis">geometry</p>
                <h3>3D geometry / motion</h3>
                <p>Shared question: whether generated outputs can be aligned, tracked, and reused; the hard constraint is consistency across geometry, motion, and input condition.</p>
                <div class="weekly-trend-papers"><span>Related</span><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper5/">A05</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper9/">A09</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper18/">A18</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper20/">A20</a></div>
              </div>
            </article>
<article class="weekly-trend-card">
              <div class="weekly-trend-num">05</div>
              <div class="weekly-trend-copy">
                <p class="weekly-trend-axis">control</p>
                <h3>reward / evaluation</h3>
                <p>Shared question: how generation quality is decomposed into optimizable, reviewable signals; rewards and benchmarks are moving closer to the training entry point.</p>
                <div class="weekly-trend-papers"><span>Related</span><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper2/">A02</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper6/">A06</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper18/">A18</a> <a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper19/">A19</a></div>
              </div>
            </article></div>
</section>

<section class="weekly-section">
  <div class="weekly-section-head">
    <span>Top 20 Directory</span>
    <h2>Top 20 Directory</h2>
  </div>
  <div class="weekly-directory"><div class="weekly-directory-head" aria-hidden="true">
          <span>ID</span>
          <span>Paper / TLDR</span>
          <span>Method</span>
          <span>Detail</span>
        </div>
<div class="weekly-directory-row" id="a01">
              <span class="weekly-directory-id">A01</span>
              <span class="weekly-directory-main">
                <strong>AnyFlow: Any-Step Video Diffusion Model with On-Policy Flow Map Distillation</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Makes video diffusion useful across different sampling budgets, not only one few-step setting.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>On-policy flow map distillation to correct trajectory mismatch in consistency distillation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The experiments target one video model remaining usable across sampling steps. The core result is step elasticity: quality, latency, and cost become adjustable along the same flow map.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Production video generation needs adjustable quality-latency tradeoffs, not a single benchmark point. It turns sampling steps into an operational knob tied to cost and interaction speed.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">flow map distillation</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper1/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a02">
              <span class="weekly-directory-id">A02</span>
              <span class="weekly-directory-main">
                <strong>AlphaGRPO: Unlocking Self-Reflective Multimodal Generation in UMMs via Decompositional Verifiable Reward</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Applies GRPO to AR-Diffusion multimodal generation with verifiable rewards.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Decompositional verifiable rewards plus GRPO for post-training complex generation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The effect is not one headline score; the useful signal is progressive self-reflective refinement under complex constraints.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Multimodal generation is entering RL/post-training, moving from image output to reasoning-aware output. It breaks generation quality into rewardable subgoals, which may change how complex prompts are optimized.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">verifiable reward</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper2/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a03">
              <span class="weekly-directory-id">A03</span>
              <span class="weekly-directory-main">
                <strong>Asymmetric Flow Models</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Uses low-rank noise prediction to reduce the burden of high-dimensional flow generation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Asymmetric velocity parameterization: low-rank noise prediction, full-dimensional data prediction.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Results center on FID / IS and clamping sensitivity: AsymFlow is more stable than JiT, suggesting low-rank noise prediction can reduce high-dimensional velocity burden without dropping full-dimensional data…</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Flow-model progress is shifting from larger networks toward better geometry of the generation path. This directly affects sampling stability, efficiency, and scalability in high-dimensional generation.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">low-rank flow</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper3/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a04">
              <span class="weekly-directory-id">A04</span>
              <span class="weekly-directory-main">
                <strong>Causal Forcing++: Scalable Few-Step Autoregressive Diffusion Distillation for Real-Time Interactive Video Generation</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Pushes autoregressive diffusion distillation toward lower-latency interactive video generation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Few-step AR diffusion distillation to reduce response granularity and sampling latency.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Ablations show causal CD matches or outperforms causal ODE initialization across 1/2/4-step settings while reducing Stage 2 cost by about 4x. The result points to few-step rollout for real-time video.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Interactive video generation is judged by latency and controllable rollout, not offline clip scores. It affects whether video models become real-time tools rather than offline renderers.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Few-step AR diffusion distillation to…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper4/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a05">
              <span class="weekly-directory-id">A05</span>
              <span class="weekly-directory-main">
                <strong>Pixal3D: Pixel-Aligned 3D Generation from Images</strong>
                <em>3D / spatial generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Treats pixel-level alignment as the core issue in image-to-3D generation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Improves image-to-3D geometry and appearance through 2D-3D correspondence.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Evaluation covers quantitative and qualitative single-view 3D generation against representative methods. The important effect is better traceability from input pixels to the generated 3D asset.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>The bottleneck is not just looking 3D, but faithfully preserving the input image. This decides whether image-to-3D can support product, character, and asset pipelines.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">2D-3D correspondence</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper5/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a06">
              <span class="weekly-directory-id">A06</span>
              <span class="weekly-directory-main">
                <strong>RAVEN: Real-time Autoregressive Video Extrapolation with Consistency-model GRPO</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Combines real-time autoregressive video extrapolation with consistency-model GRPO.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Uses GRPO to reduce the gap between training histories and inference histories.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Results separate the TF / SF trade-off: motion, semantic alignment, and visual fidelity do not peak together. RAVEN is valuable because it makes streaming-video distribution shift explicit.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Streaming video generation is becoming a distribution-shift and online reward-optimization problem. This matters for moving video models from offline clips to real-time interaction.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Uses GRPO to reduce the gap between…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper6/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a07">
              <span class="weekly-directory-id">A07</span>
              <span class="weekly-directory-main">
                <strong>ELF: Embedded Language Flows</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Moves diffusion/flow modeling from visual continuous spaces into language embeddings.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Language flow modeling in continuous embedding space rather than only over discrete tokens.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The experiments probe the generative perplexity / entropy trade-off under CFG scales: stronger guidance lowers PPL while tightening diversity.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Flow-style generation is crossing modality boundaries; it is no longer only an image-generation tool. If it holds, language, image,</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">embedding-space flow</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper7/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a08">
              <span class="weekly-directory-id">A08</span>
              <span class="weekly-directory-main">
                <strong>Orthrus: Memory-Efficient Parallel Token Generation via Dual-View Diffusion</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Uses a dual-view diffusion framework to speed token generation while preserving autoregressive fidelity.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>A dual architecture combining autoregressive exactness with diffusion-style parallel generation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The experiments stress parallel token generation under long context and masked blocks. The result is about memory / throughput,</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Diffusion is spilling beyond visual generation into inference throughput and token-generation efficiency. It targets the deployment bottleneck of slow autoregressive decoding.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">A dual architecture combining…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper8/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a09">
              <span class="weekly-directory-id">A09</span>
              <span class="weekly-directory-main">
                <strong>Sat3DGen: Comprehensive Street-Level 3D Scene Generation from Single Satellite Image</strong>
                <em>3D / spatial generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Generates street-level 3D scenes from a single satellite image.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Satellite-to-street 3D scene generation over geometry, texture, and semantic diversity.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Evaluation spans realism, semantic structure, and perceptual similarity. The effect should be judged by geometry and semantic coverage from satellite input to street-level 3D scene.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>3D generation is expanding from object assets to large scenes conditioned on geography. This can matter for maps, simulation, games, and urban digital twins.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Satellite-to-street 3D scene generation…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper9/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a10">
              <span class="weekly-directory-id">A10</span>
              <span class="weekly-directory-main">
                <strong>L2P: Unlocking Latent Potential for Pixel Generation</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Transfers latent-diffusion knowledge into pixel diffusion to avoid training pixel models from scratch.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Latent-to-Pixel transfer using pretrained LDMs to build pixel-space models.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>With the VAE removed and minimal training overhead, L2P reports 86.00 on DPG-Bench. The point is that pixel diffusion can inherit latent-model capability instead of being trained from scratch.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>The return of pixel diffusion depends on inheriting latent-model capability, not brute-force training. It affects how image generation trades off quality, cost, and controllability.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Latent-to-Pixel transfer using pretrained…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper10/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a11">
              <span class="weekly-directory-id">A11</span>
              <span class="weekly-directory-main">
                <strong>PresentAgent-2: Towards Generalist Multimodal Presentation Agents</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Moves presentation generation from static slides to research-grounded multimedia presentation videos.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Agentic pipeline for topic framing, research, media assembly, and video delivery.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The benchmark shows coverage across presentation, discussion, interaction, and text/image/GIF/video modules. The result is content-pipeline coverage, not a single model metric.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Generative models are entering compound content systems beyond single images or clips. It points to end-to-end content production as a major value path.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Agentic pipeline for topic framing</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper11/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a12">
              <span class="weekly-directory-id">A12</span>
              <span class="weekly-directory-main">
                <strong>SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Introduces a 2.6B open-source world model for minute-scale 720p video with camera control.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Hybrid linear diffusion transformer for long-duration, efficient world modeling.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The paper reports minute-scale generation in a single-GPU setting: bidirectional / chunk-causal variants fit in one H100, and the distilled variant generates one minute in 34s on an RTX 5090 with NVFP4.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Video world models are being judged by duration, openness, efficiency, and camera control. It moves long-video generation toward deployable world-model infrastructure.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">hybrid linear DiT</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper12/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a13">
              <span class="weekly-directory-id">A13</span>
              <span class="weekly-directory-main">
                <strong>CausalCine: Real-Time Autoregressive Generation for Multi-Shot Video Narratives</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Targets real-time autoregressive generation for multi-shot video narratives.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Explicitly handles event progression, viewpoint changes, and shot boundaries.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The system builds on a 14B video generator and runs streaming KV caching on 8 NVIDIA H200 GPUs at 16 FPS. The effect is a real-time autoregressive interface for multi-shot narrative.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Long video generation is about shot and narrative structure, not duration alone. This is closer to real film and advertising production.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Explicitly handles event progression</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper13/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a14">
              <span class="weekly-directory-id">A14</span>
              <span class="weekly-directory-main">
                <strong>Warp-as-History: Generalizable Camera-Controlled Video Generation from One Training Video</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Uses history warping for camera-controlled video generation with less dependence on annotated camera videos.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Training-free or low-training camera control by using warped history as condition.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>One-shot finetuning raises subjective quality from 47.37 to 54.83 and average score from 63.26 to 65.64. The concrete result: warped history is a lightweight but useful camera-control interface.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Video control does not only require heavier control branches; temporal conditioning design matters. Camera control is a key interface for narrative, advertising, and 3D scene reuse.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">warped history control</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper14/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a15">
              <span class="weekly-directory-id">A15</span>
              <span class="weekly-directory-main">
                <strong>Qwen-Image-VAE-2.0 Technical Report</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Upgrades the VAE compression layer for reconstruction quality and diffusability.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>High-compression VAE with Global Skip Connections and expanded latent channels.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Table 2 reports state-of-the-art reconstruction fidelity within the corresponding compression tiers. The read is direct: VAE quality caps text, detail, and high-resolution generation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>The ceiling is not only the denoiser; the latent codec is core infrastructure. VAE quality affects text rendering, detail fidelity, and high-resolution stability.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">VAE skip connections</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper15/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a16">
              <span class="weekly-directory-id">A16</span>
              <span class="weekly-directory-main">
                <strong>Qwen-Image-2.0 Technical Report</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Unifies high-fidelity generation, precise editing, long text rendering, and multilingual typography.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Omni-capable image foundation model for generation, editing, text, and deployment.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The benchmark reports Qwen-Image-2.0 at #9 globally and #1 among Chinese models. The larger effect is capability composition: generation, editing, long-text rendering,</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>The new bar for image models is controllable production capability beyond aesthetic samples. Text, typography, and editing decide whether the model fits real design pipelines.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Omni-capable image foundation model for…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper16/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a17">
              <span class="weekly-directory-id">A17</span>
              <span class="weekly-directory-main">
                <strong>Beyond the Last Layer: Multi-Layer Representation Fusion for Visual Tokenization</strong>
                <em>Image / visual synthesis</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Fuses multi-layer representations instead of relying only on the last visual-encoder layer.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Multi-layer visual representation fusion to recover details lost in the last layer.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The intermediate Phase 2 already reaches rFID 0.47 and PSNR 21.79. Multi-layer tokenization is not cosmetic; low-level detail and high-level semantics affect reconstruction and generation foundations.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Generation quality increasingly depends on tokenizer/autoencoder representation design. The tokenizer is the input interface for the generation stack; errors propagate downstream.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Multi-layer visual representation fusion…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper17/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a18">
              <span class="weekly-directory-id">A18</span>
              <span class="weekly-directory-main">
                <strong>PhyMotion: Structured 3D Motion Reward for Physics-Grounded Human Video Generation</strong>
                <em>3D / spatial generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Designs a 3D motion reward for human video generation beyond 2D perceptual rewards.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Structured 3D motion reward constraining post-training with body-state signals.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The paper reports clear gains over perceptual, preference-based, and physics-aware reward baselines, which typically reach only 50-66% agreement with weak Spearman correlation.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Video realism needs physical motion evaluation, not only visual perception. Human motion is a common failure point and a frequent commercial-generation need.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Structured 3D motion reward constraining…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper18/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a19">
              <span class="weekly-directory-id">A19</span>
              <span class="weekly-directory-main">
                <strong>WorldReasonBench: Human-Aligned Stress Testing of Video Generators as Future World-State Predictors</strong>
                <em>Video / temporal generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Reframes video generation evaluation as world-state prediction stress testing.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Human-aligned benchmark testing whether models understand world evolution over time.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>The effect is the evaluation protocol: video QA, binary judging, and 4 FPS processing for world-state prediction. It does not prove one generator stronger; it makes future-state plausibility measurable.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Video generation evaluation is shifting from visual appeal to world evolution reasoning. If video generators become world simulators, evaluation must test prediction and causal consistency.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">Human-aligned benchmark testing whether…</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper19/">Read</a></span>
            </div>
<div class="weekly-directory-row" id="a20">
              <span class="weekly-directory-id">A20</span>
              <span class="weekly-directory-main">
                <strong>TrackCraft3R: Repurposing Video Diffusion Transformers for Dense 3D Tracking</strong>
                <em>3D / spatial generation</em>
                <span class="weekly-directory-tldr"><span class="weekly-directory-tldr-line">
              <b>Problem</b>
              <em>Repurposes video diffusion transformer priors for dense 3D tracking.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Method</b>
              <em>Uses motion priors learned by video generators for dynamic 3D scene understanding.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Effect</b>
              <em>Experiments use datasets with sparse ground-truth 3D trajectories and evaluate the first 84 frames. The result is that video-diffusion motion priors transfer to dense 3D tracking.</em>
            </span><span class="weekly-directory-tldr-line">
              <b>Insight</b>
              <em>Generative models are becoming prior libraries for perception, not only content generators. It shows video-generation internals may feed back into 3D tracking and dynamic understanding.</em>
            </span></span>
              </span>
              <span class="weekly-directory-method">motion prior transfer</span>
              <span class="weekly-directory-detail"><a href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/paper20/">Read</a></span>
            </div></div>
</section>
