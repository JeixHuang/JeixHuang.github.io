---
title: "A20: TrackCraft3R: Repurposing Video Diffusion Transformers for Dense 3D Tracking"
date: "2026-05-11T12:00:00+08:00"
slug: "paper20"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper20/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper20"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Repurposes video diffusion transformer priors for dense 3D tracking. Method: Uses motion priors learned by video generators for dynamic 3D scene understanding. Effect: Experiments use datasets with sparse ground-truth 3D trajectories and evaluate the first 84 frames. The result is that video-diffusion motion priors transfer to dense 3D tracking. Insight: Generative models are becoming prior libraries for perception, not only content generators."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A20"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A20</span>
    <div>
      <h2>TrackCraft3R: Repurposing Video Diffusion Transformers for Dense 3D Tracking</h2>
      <p>3D / spatial generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">生成模型正在成为感知任务的 prior library。视频 diffusion 学到的运动结构，可以反向服务 tracking。 这篇说明 video generation 的中间能力可能比最终样片更有价值：motion prior 能进入 3D understanding 工具链。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">TrackCraft3R targets a hard constraint in generative modeling: Repurposes video diffusion transformer priors for dense 3D tracking.</p><p data-story-section="context_setup">The useful lens is geometry constraints / correspondence / cross-view consistency: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make geometry constraints / correspondence / cross-view consistency a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Uses motion priors learned by video generators for dynamic 3D scene understanding.</p><p data-story-section="mechanism_story">The concrete method clue is: Training.All models are trained at a resolution of 480×832 on 12-frame clips using 8 H200 GPUs.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: Experiments use datasets with sparse ground-truth 3D trajectories and evaluate the first 84 frames. The result is that video-diffusion motion priors transfer to dense 3D tracking.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a20-p09-table-1.png" alt="Table 3: Ablation on model components" loading="lazy">
<figcaption><span>Table 3 p.9</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a20-p09-table-2.png" alt="Table 4: Ablation on input geometry" loading="lazy">
<figcaption><span>Table 4 p.9</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: Each dataset provides sparse ground-truth 3D trajectories, and we evaluate the first 84 frames.</p><p data-story-section="value_insight">Generative models are becoming prior libraries for perception, not only content generators. It shows video-generation internals may feed back into 3D tracking and dynamic understanding.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.12587" rel="noopener">https://arxiv.org/abs/2605.12587</a></p>
</section>
