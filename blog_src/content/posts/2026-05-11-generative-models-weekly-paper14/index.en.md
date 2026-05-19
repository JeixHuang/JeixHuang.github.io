---
title: "A14: Warp-as-History: Generalizable Camera-Controlled Video Generation from One Training Video"
date: "2026-05-11T12:00:00+08:00"
slug: "paper14"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper14/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper14"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Uses history warping for camera-controlled video generation with less dependence on annotated camera videos. Method: Training-free or low-training camera control by using warped history as condition. Effect: One-shot finetuning raises subjective quality from 47.37 to 54.83 and average score from 63.26 to 65.64. The concrete result: warped history is a lightweight but useful camera-control interface. Insight: Video control does not only require heavier control branches; temporal conditioning design matters."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A14"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A14</span>
    <div>
      <h2>Warp-as-History: Generalizable Camera-Controlled Video Generation from One Training Video</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">相机控制的难点在时序几何；history 本身可以成为控制接口，减少对重控制分支的依赖。 叙事视频、广告、虚拟场景都需要可控镜头语言；这类方法把 camera control 变成更轻的训练问题。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Warp-as-History targets a hard constraint in generative modeling: Uses history warping for camera-controlled video generation with less dependence on annotated camera videos.</p><p data-story-section="context_setup">The useful lens is temporal state / history cache / rollout stability: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make temporal state / history cache / rollout stability a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Training-free or low-training camera control by using warped history as condition.</p><p data-story-section="mechanism_story">The concrete method clue is: The final model uses offline LoRA finetuning on one separate camera-annotated video to stabilize this behavior and improve quality, foreground dynamics, and disocclusion.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: One-shot finetuning raises subjective quality from 47.37 to 54.83 and average score from 63.26 to 65.64. The concrete result: warped history is a lightweight but useful camera-control interface.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a14-p07-figure-1.png" alt="Figure 4: Qualitative comparison with external camera-control methods on in-the-wild videos. Columns show the camera-induced warp, ground truth, ViewCrafter, Gen3C, Voyager, and ours under the same target camera setting" loading="lazy">
<figcaption><span>Figure 4 p.7</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a14-p08-figure-2.png" alt="Figure 5: Qualitative comparison with HyWorldPlay on 30-second trajectories sampled from World- Score images. Frames are shown at 0, 12, 24, and 30 seconds" loading="lazy">
<figcaption><span>Figure 5 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: One-shot finetuning mainly improves visual quality over the zero-shot interface: Subjective Quality increases from 47.37 to 54.83, a 15.7% relative gain, while the average score also improves from 63.26 to 65.64.</p><p data-story-section="value_insight">Video control does not only require heavier control branches; temporal conditioning design matters. Camera control is a key interface for narrative, advertising, and 3D scene reuse.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.15182" rel="noopener">https://arxiv.org/abs/2605.15182</a></p>
</section>
