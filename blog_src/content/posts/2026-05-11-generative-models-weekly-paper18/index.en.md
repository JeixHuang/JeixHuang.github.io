---
title: "A18: PhyMotion: Structured 3D Motion Reward for Physics-Grounded Human Video Generation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper18"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper18/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper18"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Designs a 3D motion reward for human video generation beyond 2D perceptual rewards. Method: Structured 3D motion reward constraining post-training with body-state signals. Effect: The paper reports clear gains over perceptual, preference-based, and physics-aware reward baselines, which typically rea..."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A18"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A18</span>
    <div>
      <h2>PhyMotion: Structured 3D Motion Reward for Physics-Grounded Human Video Generation</h2>
      <p>3D / spatial generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">视频生成的人体问题需要物理奖励。画面清晰和姿态漂亮不足以保证运动连续、接触合理、重心可信。 人类动作是视频模型最容易露馅的区域，也是广告、短剧、虚拟人最常见需求；reward 设计会决定后训练上限。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">PhyMotion targets a hard constraint in generative modeling: Designs a 3D motion reward for human video generation beyond 2D perceptual rewards.</p><p data-story-section="context_setup">The useful lens is geometry constraints / correspondence / cross-view consistency: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make geometry constraints / correspondence / cross-view consistency a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Structured 3D motion reward constraining post-training with body-state signals.</p><p data-story-section="mechanism_story">The concrete method clue is: The same trend also holds for FastWan 1.3B: after post-training withPhyMotion, the model improves motion smoothness, aesthetic quality, temporal flickering, VideoAlign, VideoPhy, and allPhyMotion scores, including a+7.0% gain in overall feasibility.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a18-p07-figure-2.png" alt="Figure 3: Agreement with human judgments for motion quality. Our metrics achieve the highest agreement compared with perceptual (VBench / VBench2) and learned (VideoAlign, VideoPhy) video metrics across three human-evaluation questions: body structure, balance, and motion naturalness" loading="lazy">
<figcaption><span>Figure 3 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">The reported effect is: The paper reports clear gains over perceptual, preference-based, and physics-aware reward baselines, which typically reach only 50-66% agreement with weak Spearman correlation. The effect is a reward closer to human-motion judgment.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a18-p07-table-1.png" alt="Table 1: Correlation with human judgments for motion quality. We report Spearman’s rank correlation ( ρ ) between automatic metric scores and human judgments across three questions. Best results are in bold , and second-best results are underlined" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: This substantially outperforms existing perceptual, preference-based, and physics-awarerewardbaselines, whichtypicallyachieve 50–66%agreementandonlyweakSpearman correlations (ρ= 0 –0.25).</p><p data-story-section="value_insight">Video realism needs physical motion evaluation, not only visual perception. Human motion is a common failure point and a frequent commercial-generation need.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.14269" rel="noopener">https://arxiv.org/abs/2605.14269</a></p>
</section>
