---
title: "A03: Asymmetric Flow Models"
date: "2026-05-11T12:00:00+08:00"
slug: "paper3"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper3/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper3"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Uses low-rank noise prediction to reduce the burden of high-dimensional flow generation. Method: Asymmetric velocity parameterization: low-rank noise prediction, full-dimensional data prediction. Effect: Results center on FID / IS and clamping sensitivity: AsymFlow is more stable than JiT, suggesting low-rank noise prediction can reduce high-dimensional velocity burden without dropping full-dimensional data… Insight: Flow-model progress is shifting from larger networks toward better geometry of the…"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A03"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A03</span>
    <div>
      <h2>Asymmetric Flow Models</h2>
      <p>Image / visual synthesis</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">AsymFlow 把 flow model 的问题从“预测完整高维速度场”改写成“只在有效子空间里预测关键噪声方向”。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Asymmetric Flow Models targets a hard constraint in generative modeling: Uses low-rank noise prediction to reduce the burden of high-dimensional flow generation.</p><p data-story-section="context_setup">The useful lens is latent representation / tokenizer reconstruction / semantic-detail allocation: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make latent representation / tokenizer reconstruction / semantic-detail allocation a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Asymmetric velocity parameterization: low-rank noise prediction, full-dimensional data prediction.</p><p data-story-section="mechanism_story">The concrete method clue is: With the same architecture and recipe, AsymFlow (r= 8) consistently improves over JiT and reaches comparable FID roughly 40% faster.</p><figure class="weekly-inline-figure weekly-inline-figure--float">
<img src="figures/a03-p08-figure-1.png" alt="Figure 7: Qualitative comparison of T2I diffusion models. AsymFLUX.2 klein produces more realistic images with richer visual styles than prior models. More results are shown in Fig. 9 and 10" loading="lazy">
<figcaption><span>Figure 7 p.8</span></figcaption>
</figure><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: Results center on FID / IS and clamping sensitivity: AsymFlow is more stable than JiT, suggesting low-rank noise prediction can reduce high-dimensional velocity burden without dropping full-dimensional data prediction.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a03-p08-table-2.png" alt="Table 3: Comparison with baselines and ablation studies . All models are finetuned on the LAION- Aesthetics dataset [56] for 10K iterations, and evaluated on the COCO-10K dataset [38]" loading="lazy">
<figcaption><span>Table 3 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: The results confirm this: with the optimal σmin = 0.04 for both methods, AsymFlow improves over JiT in both FID and IS by a clear margin; disabling clamping degrades JiT by 1.37 FID, but AsymFlow by only 0.52.</p><p data-story-section="value_insight">Flow-model progress is shifting from larger networks toward better geometry of the generation path. This directly affects sampling stability, efficiency, and scalability in high-dimensional generation.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.12964" rel="noopener">https://arxiv.org/abs/2605.12964</a></p>
</section>
