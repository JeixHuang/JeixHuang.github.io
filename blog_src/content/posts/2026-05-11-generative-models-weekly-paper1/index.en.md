---
title: "A01: AnyFlow: Any-Step Video Diffusion Model with On-Policy Flow Map Distillation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper1"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper1/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper1"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Makes video diffusion useful across different sampling budgets, not only one few-step setting. Method: On-policy flow map distillation to correct trajectory mismatch in consistency distillation. Effect: The experiments target one video model remaining usable across sampling steps. The core result is..."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A01"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A01</span>
    <div>
      <h2>AnyFlow: Any-Step Video Diffusion Model with On-Policy Flow Map Distillation</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">AnyFlow 的核心价值是让同一个视频 diffusion 模型覆盖不同 step budget，而非只在某个固定采样步数上调到最优。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">AnyFlow targets a hard constraint in generative modeling: Makes video diffusion useful across different sampling budgets, not only one few-step setting.</p><p data-story-section="context_setup">The useful lens is temporal state / history cache / rollout stability: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make temporal state / history cache / rollout stability a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: On-policy flow map distillation to correct trajectory mismatch in consistency distillation.</p><p data-story-section="mechanism_story">The concrete method clue is: is a representative approach that connects instantaneous and average velocities, but it relies on Jacobian-vector products (JVPs), which are 3 AnyFlow: Any-Step Video Diffusion Model with On-Policy Flow Map Distillation Method Forward Training On-Policy Distillation Causal Bidirectional Any-Step APT.</p><figure class="weekly-inline-figure weekly-inline-figure--float">
<img src="figures/a01-p07-figure-2.png" alt="Figure 4 | Overview of the AnyFlow Pipeline. AnyFlow enables any-step video generation by jointly learning forward flow map training from synthetic data and on-policy distillation with flow map backward simulation under teacher guidance" loading="lazy">
<figcaption><span>Figure 4 p.7</span></figcaption>
</figure><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The experiments target one video model remaining usable across sampling steps. The core result is step elasticity: quality, latency, and cost become adjustable along the same flow map.</p><p data-story-section="experiment_story">The traceable result clue is: At the beginning of training, this formulation reduces to the pretrained timestep embedding in the boundary case𝑡=𝑟.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a01-p15-figure-1.png" alt="Figure 11 | Ablation Study of Timestep Conditioning . Compared with zero-init timestep conditioning, the proposed interpolated method achieves embedding norms more consistent with pretrained embeddings, preventing over-saturated visual results" loading="lazy">
<figcaption><span>Figure 11 p.15</span></figcaption>
</figure><p data-story-section="value_insight">Production video generation needs adjustable quality-latency tradeoffs, not a single benchmark point. It turns sampling steps into an operational knob tied to cost and interaction speed.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.13724" rel="noopener">https://arxiv.org/abs/2605.13724</a></p>
</section>
