---
title: "A08: Orthrus: Memory-Efficient Parallel Token Generation via Dual-View Diffusion"
date: "2026-05-11T12:00:00+08:00"
slug: "paper8"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper8/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper8"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Uses a dual-view diffusion framework to speed token generation while preserving autoregressive fidelity. Method: A dual architecture combining autoregressive exactness with diffusion-style parallel generation. Effect: The experiments stress parallel token generation under long context and masked bloc..."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A08"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A08</span>
    <div>
      <h2>Orthrus: Memory-Efficient Parallel Token Generation via Dual-View Diffusion</h2>
      <p>Image / visual synthesis</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">diffusion 的价值正在外溢到 token generation。这里的关键词是生成过程并行化：把 diffusion 看成吞吐工具。 它对应部署侧最硬的瓶颈：自回归解码慢。生成建模路线如果能改变 token 生成吞吐，会反过来影响多模态系统架构。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Orthrus targets a hard constraint in generative modeling: Uses a dual-view diffusion framework to speed token generation while preserving autoregressive fidelity.</p><p data-story-section="context_setup">The useful lens is latent representation / tokenizer reconstruction / semantic-detail allocation: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make latent representation / tokenizer reconstruction / semantic-detail allocation a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: A dual architecture combining autoregressive exactness with diffusion-style parallel generation.</p><p data-story-section="mechanism_story">The concrete method clue is: Standard speculative frameworks rely on training a distinct drafter model to rapidly project candidate tokens, which the larger base model subsequently verifies.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The experiments stress parallel token generation under long context and masked blocks. The result is about memory / throughput, not visual quality: dual-view diffusion reduces deployment cost in autoregressive generation.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a08-p08-table-1.png" alt="Table 2 contrasts Orthrus with state-of-the-art diffusion paradigms on complex mathematical and structural reasoning benchmarks. The results demonstrate a clear performance gap: existing diffusion- based models, including Dream ( Ye et al. , 2025a ), Fast-dLLM-v2 ( Wu et al. , 2025 ), LLaDA-1.5 ( Zhu et al. , 2025 ), SDAR ( Cheng et al. ), Mercury Coder ( Kh" loading="lazy">
<figcaption><span>Table 2 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a08-p09-figure-2.png" alt="Figure 4: Average Acceptance Length Comparison. We evaluate Orthrus against state-of-the-art speculative decoding methods, EAGLE-3 and DFlash. The unified dual-view architecture of Orthrus achieves a significantly higher number of verified tokens per forward pass" loading="lazy">
<figcaption><span>Figure 4 p.9</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: For each training instance, we construct a clean text context with a maximum length of 2048 tokens and generate a corresponding corrupted sequence containing 256 masked blocks placed at random anchor positions.</p><p data-story-section="value_insight">Diffusion is spilling beyond visual generation into inference throughput and token-generation efficiency. It targets the deployment bottleneck of slow autoregressive decoding.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.12825" rel="noopener">https://arxiv.org/abs/2605.12825</a></p>
</section>
