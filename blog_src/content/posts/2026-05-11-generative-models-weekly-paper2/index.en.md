---
title: "A02: AlphaGRPO: Unlocking Self-Reflective Multimodal Generation in UMMs via Decompositional Verifiable Reward"
date: "2026-05-11T12:00:00+08:00"
slug: "paper2"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper2/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper2"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Applies GRPO to AR-Diffusion multimodal generation with verifiable rewards. Method: Decompositional verifiable rewards plus GRPO for post-training complex generation. Effect: The effect is not one headline score; the useful signal is progressive self-reflective refinement under complex constraints. Insight: Multimodal generation is entering RL/post-training, moving from image output to reasoning-aware output. It breaks generation quality into rewardable subgoals,"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A02"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A02</span>
    <div>
      <h2>AlphaGRPO: Unlocking Self-Reflective Multimodal Generation in UMMs via Decompositional Verifiable Reward</h2>
      <p>Image / visual synthesis</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">这篇的信号是：多模态生成开始吸收 LLM post-training 的方法论，质量控制从 prompt engineering 进入 reward design。 复杂图像生成常死在隐含意图、组合约束和自我修正；这类 reward 设计会影响下一代统一多模态模型的训练接口。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">AlphaGRPO targets a hard constraint in generative modeling: Applies GRPO to AR-Diffusion multimodal generation with verifiable rewards.</p><p data-story-section="context_setup">The useful lens is reward signal / benchmark protocol / evaluation loop: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make reward signal / benchmark protocol / evaluation loop a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Decompositional verifiable rewards plus GRPO for post-training complex generation.</p><p data-story-section="mechanism_story">The concrete method clue is: .</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The effect is not one headline score; the useful signal is progressive self-reflective refinement under complex constraints. Read it as evidence that reward decomposition can enter multimodal generation post-training.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a02-p06-table-1.png" alt="Table 1 demonstrates AlphaGRPO’s consistent improve- ments across benchmarks. We highlight three observations: (1) Training on low resolution boosts high-resolution performance. Despite optimization at 512 × 512 , Alpha- GRPO outperforms the Bagel baseline and generalizes effec- tively to higher resolutions. AlphaGRPO 1024px excels on TIIF-Bench and GenEval" loading="lazy">
<figcaption><span>Table 1 p.6</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a02-p02-figure-2.png" alt="Figure 1. Qualitative and quantitative comparisons of AlphaGRPO. In Text-to-Image (top), our AlphaGRPO(trained on self-reflective refinement (SRR)) exhibits superior initial composition compared to Bagel, while applying Inference-time Self-Reflective Refinement (Inf. SRR) further rectifies fine-grained attribute mismatches (e.g., the “metallic” correct to “f" loading="lazy">
<figcaption><span>Figure 1 p.2</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: Efficacy of Self-Reflective Refinement.Figure 8 visualizes the progressive improvement brought by our Inference-time Self-Reflective Refinement (Inf.</p><p data-story-section="value_insight">Multimodal generation is entering RL/post-training, moving from image output to reasoning-aware output. It breaks generation quality into rewardable subgoals, which may change how complex prompts are optimized.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.12495" rel="noopener">https://arxiv.org/abs/2605.12495</a></p>
</section>
