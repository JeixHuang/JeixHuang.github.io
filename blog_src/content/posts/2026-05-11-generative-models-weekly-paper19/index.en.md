---
title: "A19: WorldReasonBench: Human-Aligned Stress Testing of Video Generators as Future World-State Predictors"
date: "2026-05-11T12:00:00+08:00"
slug: "paper19"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper19/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper19"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Reframes video generation evaluation as world-state prediction stress testing. Method: Human-aligned benchmark testing whether models understand world evolution over time. Effect: The effect is the evaluation protocol: video QA, binary judging, and 4 FPS processing for world-state prediction. It does not prove one generator stronger; it makes future-state plausibility measurable. Insight: Video generation evaluation is shifting from visual appeal to world evolution reasoning."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A19"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A19</span>
    <div>
      <h2>WorldReasonBench: Human-Aligned Stress Testing of Video Generators as Future World-State Predictors</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">video generator 被称为 world simulator 时，评测必须测预测能力。漂亮视频和正确未来是两种能力。 它给视频模型拉出一条更硬的评价线：如果模型要服务 robotics、simulation 或 interactive planning，世界状态一致性必须可测。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">WorldReasonBench targets a hard constraint in generative modeling: Reframes video generation evaluation as world-state prediction stress testing.</p><p data-story-section="context_setup">The useful lens is temporal state / history cache / rollout stability: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make temporal state / history cache / rollout stability a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Human-aligned benchmark testing whether models understand world evolution over time.</p><p data-story-section="mechanism_story">The concrete method clue is: Before formal annotation, all annotators received a one-hour training session covering the benchmark objective, annotation interface, scoring dimensions, representative calibration examples, and common failure cases in image-to-video generation.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The effect is the evaluation protocol: video QA, binary judging, and 4 FPS processing for world-state prediction. It does not prove one generator stronger; it makes future-state plausibility measurable.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a19-p06-table-1.png" alt="Table 2: Main evaluation results across WorldReasonBench dimensions. Per-dimension Score PR and S ( v ) ( 0 – 100 ) computed for every generator on a shared evaluation set for fully controlled cross- model comparison. Bold / underline : best/second-best across all 11 models. Full subcategory results, 95% bootstrap CIs, and additional open-source coverage are" loading="lazy">
<figcaption><span>Table 2 p.6</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a19-p04-figure-2.png" alt="Figure 2: Benchmark construction pipeline. A : WorldReasonBench construction, including taxonomy-aware captioning, prompt generation, and QA generation. B : WorldRewardBench construc- tion, including video sampling, expert scoring, preference-pair construction, and human-alignment evaluation" loading="lazy">
<figcaption><span>Figure 2 p.4</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: All automatic evaluation uses Qwen3.5-27B [21]; the QA pipeline enables extended thinking for video question answering, disables it for binary judging, and processes videos at 4 FPS.</p><p data-story-section="value_insight">Video generation evaluation is shifting from visual appeal to world evolution reasoning. If video generators become world simulators, evaluation must test prediction and causal consistency.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.10434" rel="noopener">https://arxiv.org/abs/2605.10434</a></p>
</section>
