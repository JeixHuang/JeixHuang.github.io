---
title: "A13: CausalCine: Real-Time Autoregressive Generation for Multi-Shot Video Narratives"
date: "2026-05-11T12:00:00+08:00"
slug: "paper13"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper13/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper13"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Targets real-time autoregressive generation for multi-shot video narratives. Method: Explicitly handles event progression, viewpoint changes, and shot boundaries. Effect: The system builds on a 14B video generator and runs streaming KV caching on 8 NVIDIA H200 GPUs at 16 FPS. The effect is a real-time autoregressive interface for multi-shot narrative. Insight: Long video generation is about shot and narrative structure, not duration alone. This is closer to real film and advertising production."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A13"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A13</span>
    <div>
      <h2>CausalCine: Real-Time Autoregressive Generation for Multi-Shot Video Narratives</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">长视频的核心约束是剪辑语法：镜头要换，语义要走，节奏要持续。单纯 rollout 会带来运动停滞和语义漂移。 这篇和 RAVEN / Causal Forcing++ 放在一起看，能看到实时视频生成正在拆成三件事：低延迟、长程记忆、叙事状态。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">CausalCine targets a hard constraint in generative modeling: Targets real-time autoregressive generation for multi-shot video narratives.</p><p data-story-section="context_setup">The useful lens is geometry constraints / correspondence / cross-view consistency: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make geometry constraints / correspondence / cross-view consistency a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Explicitly handles event progression, viewpoint changes, and shot boundaries.</p><p data-story-section="mechanism_story">The concrete method clue is: 3.3); and (iii) distill the resulting full-step causal model into a four-step generator for interactive synthesis (Sec.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The system builds on a 14B video generator and runs streaming KV caching on 8 NVIDIA H200 GPUs at 16 FPS. The effect is a real-time autoregressive interface for multi-shot narrative.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a13-p08-table-1.png" alt="Table 1: Comparison with autoregressive video generation baselines. Best values per column are in bold and second best are underlined. Our method achieves the best overall performance" loading="lazy">
<figcaption><span>Table 1 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a13-p08-table-2.png" alt="Table 3: Ablation studies on causal tuning and memory design" loading="lazy">
<figcaption><span>Table 3 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: We build CausalCine on a 14B-parameter video generator and run it with streaming KV caching on 8 NVIDIA H200 GPUs at 16 FPS.</p><p data-story-section="value_insight">Long video generation is about shot and narrative structure, not duration alone. This is closer to real film and advertising production.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.12496" rel="noopener">https://arxiv.org/abs/2605.12496</a></p>
</section>
