---
title: "A12: SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer"
date: "2026-05-11T12:00:00+08:00"
slug: "paper12"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper12/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper12"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Introduces a 2.6B open-source world model for minute-scale 720p video with camera control. Method: Hybrid linear diffusion transformer for long-duration, efficient world modeling. Effect: The paper reports minute-scale generation in a single-GPU setting: bidirectional / chunk-causal variants fit in one H100, and the distilled variant generates one minute in 34s on an RTX 5090 with NVFP4. Insight: Video world models are being judged by duration, openness, efficiency, and camera control."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A12"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A12</span>
    <div>
      <h2>SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">视频 world model 的竞争坐标变清楚了：duration、openness、efficiency、camera control。大模型样片之外，开源可复现很关键。 分钟级生成把时间一致性问题放大，也把成本问题放大；这类模型决定 world model 能否进入研究和产品原型。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">SANA-WM targets a hard constraint in generative modeling: Introduces a 2.6B open-source world model for minute-scale 720p video with camera control.</p><p data-story-section="context_setup">The useful lens is temporal state / history cache / rollout stability: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make temporal state / history cache / rollout stability a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Hybrid linear diffusion transformer for long-duration, efficient world modeling.</p><p data-story-section="mechanism_story">The concrete method clue is: GDN + softmax LTX2 / 720p 0.7834 0.9226 0.8530 5.68 433.2 2.31 GDN key scaling.We evaluate training stability under identical conditions: 81-frame sequences and an all-GDN [ 11] architecture initialized from a shared LTX2-V AE [10] cumulative-linear checkpoint.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The paper reports minute-scale generation in a single-GPU setting: bidirectional / chunk-causal variants fit in one H100, and the distilled variant generates one minute in 34s on an RTX 5090 with NVFP4. The effect is a lower cost floor for long-video world models.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a12-p08-table-1.png" alt="Table 2 | Quantitative comparison on our 1-min benchmark. Bold Res marks 720p. Pose Acc. reports R in degrees, plus T/CMC; VBench reports eight dimensions plus Overall. Mem/Tput are peak GB and videos/hour on 8 H100s. Green highlights mark top-three entries" loading="lazy">
<figcaption><span>Table 2 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a12-p07-table-2.png" alt="Table 1 | Training data overview after filtering" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: Most importantly for accessibility, it reduces minute-scale generation to a single-GPU inference setting: the bidirectional and chunk-causal variants fit within one H100, and our distilled variant brings 1-minute video generation to 34s on a single RTX 5090 with NVFP4 quantization.</p><p data-story-section="value_insight">Video world models are being judged by duration, openness, efficiency, and camera control. It moves long-video generation toward deployable world-model infrastructure.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.15178" rel="noopener">https://arxiv.org/abs/2605.15178</a></p>
</section>
