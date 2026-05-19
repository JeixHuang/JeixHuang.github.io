---
title: "A04: Causal Forcing++: Scalable Few-Step Autoregressive Diffusion Distillation for Real-Time Interactive Video Generation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper4"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper4/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper4"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Pushes autoregressive diffusion distillation toward lower-latency interactive video generation. Method: Few-step AR diffusion distillation to reduce response granularity and sampling latency. Effect: Ablations show causal CD matches or outperforms causal ODE initialization across 1/2/4-step settings while reducing Stage 2 cost by about 4x. The result points to few-step rollout for real-time video. Insight: Interactive video generation is judged by latency and controllable rollout, not offline clip scores."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A04"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A04</span>
    <div>
      <h2>Causal Forcing++: Scalable Few-Step Autoregressive Diffusion Distillation for Real-Time Interactive Video Generation</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">实时视频生成的评价坐标是 latency、control granularity、rollout stability。离线 clip 质量只是入口。 它直接决定视频模型能否成为交互工具：用户改动作、镜头或场景时，系统必须在可接受延迟内继续生成。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Causal Forcing++ targets a hard constraint in generative modeling: Pushes autoregressive diffusion distillation toward lower-latency interactive video generation.</p><p data-story-section="context_setup">The useful lens is temporal state / history cache / rollout stability: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make temporal state / history cache / rollout stability a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Few-step AR diffusion distillation to reduce response granularity and sampling latency.</p><p data-story-section="mechanism_story">The concrete method clue is: .</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: Ablations show causal CD matches or outperforms causal ODE initialization across 1/2/4-step settings while reducing Stage 2 cost by about 4x. The result points to few-step rollout for real-time video.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a04-p10-table-1.png" alt="Table 1: Comparisons with existing methods. Our method reduces latency by half and improves throughput, while achieving generation quality comparable to or even better than previous SOTA methods. Dynamic., Vi- sion. and Instruct. denote Dynamic Degree, VisionReward and Instruction Following, respectively. Through- put and latency are measured in FPS and seco" loading="lazy">
<figcaption><span>Table 1 p.10</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a04-p03-figure-2.png" alt="Figure 1: Overall framework of our Causal Forcing++ and the comparison with existing methods. (a) Causal Forcing (CF) ﬁxes Self Forcing (SF)’s frame-level injectivity ﬂaw but remains costly; our Causal Forcing++ (CF++) is theoretically sound, efﬁcient, and scalable. (b) Our CF++ reduces training cost by 4 × , requires no extra data curation, and achieves 50%" loading="lazy">
<figcaption><span>Figure 1 p.3</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: Ablation studies further show that causal CD consistently matches or outperforms causal ODE initialization across 1-step, 2-step, and 4step settings, while reducing the Stage 2 cost by about 4× and requiring no auxiliary trajectory storage.</p><p data-story-section="value_insight">Interactive video generation is judged by latency and controllable rollout, not offline clip scores. It affects whether video models become real-time tools rather than offline renderers.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.15141" rel="noopener">https://arxiv.org/abs/2605.15141</a></p>
</section>
