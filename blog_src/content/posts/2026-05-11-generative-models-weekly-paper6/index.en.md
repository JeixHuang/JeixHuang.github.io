---
title: "A06: RAVEN: Real-time Autoregressive Video Extrapolation with Consistency-model GRPO"
date: "2026-05-11T12:00:00+08:00"
slug: "paper6"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper6/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper6"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Combines real-time autoregressive video extrapolation with consistency-model GRPO. Method: Uses GRPO to reduce the gap between training histories and inference histories. Effect: Results separate the TF / SF trade-off: motion, semantic alignment, and visual fidelity do not peak together. RAVEN is valuable because it makes streaming-video distribution shift explicit. Insight: Streaming video generation is becoming a distribution-shift and online reward-optimization problem."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A06"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A06</span>
    <div>
      <h2>RAVEN: Real-time Autoregressive Video Extrapolation with Consistency-model GRPO</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">实时视频生成的关键问题正在变成 online distribution shift：模型必须学会和自己的输出共处。 它和 AnyFlow、Causal Forcing++ 组成同一条线：短视频 diffusion 的质量优势要转换成可交互、可持续的实时生成。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">RAVEN targets a hard constraint in generative modeling: Combines real-time autoregressive video extrapolation with consistency-model GRPO.</p><p data-story-section="context_setup">The useful lens is latent representation / tokenizer reconstruction / semantic-detail allocation: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make latent representation / tokenizer reconstruction / semantic-detail allocation a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Uses GRPO to reduce the gap between training histories and inference histories.</p><p data-story-section="mechanism_story">The concrete method clue is: .</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: Results separate the TF / SF trade-off: motion, semantic alignment, and visual fidelity do not peak together. RAVEN is valuable because it makes streaming-video distribution shift explicit.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a06-p08-figure-1.png" alt="Figure 4: Qualitative ablation on Training-time Test. See supplementary for playable video clips" loading="lazy">
<figcaption><span>Figure 4 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a06-p07-table-2.png" alt="Table 1: Quantitative comparison results" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: TF achieves the strongest motion at the cost of the other two dimensions, while SF leads on semantic alignment but yields the weakest motion, reflecting how a detached cache withholds gradient from the history.</p><p data-story-section="value_insight">Streaming video generation is becoming a distribution-shift and online reward-optimization problem. This matters for moving video models from offline clips to real-time interaction.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.15190" rel="noopener">https://arxiv.org/abs/2605.15190</a></p>
</section>
