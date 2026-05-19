---
title: "A11: PresentAgent-2: Towards Generalist Multimodal Presentation Agents"
date: "2026-05-11T12:00:00+08:00"
slug: "paper11"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper11/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper11"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Moves presentation generation from static slides to research-grounded multimedia presentation videos. Method: Agentic pipeline for topic framing, research, media assembly, and video delivery. Effect: The benchmark shows coverage across presentation, discussion, interaction, and text/image/GIF/video modules. The result is content-pipeline coverage, not a single model metric. Insight: Generative models are entering compound content systems beyond single images or clips."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A11"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A11</span>
    <div>
      <h2>PresentAgent-2: Towards Generalist Multimodal Presentation Agents</h2>
      <p>Video / temporal generation</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">这篇更像系统信号：生成模型的价值从单个 media output 进入复合内容生产链路。 它提示生成模型的落地形态会越来越像 production stack：模型能力、检索、规划、编辑和交付界面必须一起设计。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">PresentAgent-2 targets a hard constraint in generative modeling: Moves presentation generation from static slides to research-grounded multimedia presentation videos.</p><p data-story-section="context_setup">The useful lens is temporal state / history cache / rollout stability: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make temporal state / history cache / rollout stability a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Agentic pipeline for topic framing, research, media assembly, and video delivery.</p><p data-story-section="mechanism_story">The concrete method clue is: To relax this requirement, we introduce PresentAgent-2, a multimodal agent that generates presentation videos from user queries.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The benchmark shows coverage across presentation, discussion, interaction, and text/image/GIF/video modules. The result is content-pipeline coverage, not a single model metric.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a11-p08-table-1.png" alt="Table 4: Benchmark evaluation results of Human Reference and PresentAgent-2 with different models. Quiz is averaged on a 0–5 scale, and subjective scores are on a 1–5 scale. Metric abbreviations follow Table 2" loading="lazy">
<figcaption><span>Table 4 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a11-p08-table-2.png" alt="Table 3: Capability comparison between PresentAgent-2 and representative related systems. ✓ indicates explicit support, △ indicates partial or indirect support, and × indicates that the ca- pability is not supported or not the target of the method" loading="lazy">
<figcaption><span>Table 3 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: Method Presentation Discussion Interaction Text Image GIF Video Paper2Video [3]✓× ×✓ ✓× △ Paper2Poster [1]△ × ×✓ ✓× × VideoDirectorGPT [38]× × × △ × × × VideoStudio [39]× × × △ × × × LVD [40]× × × △ × × × PresentAgent [2]✓× ×✓△ × × PresentAgent-2✓ ✓ ✓ ✓ ✓ ✓ ✓ Table 4: Benchmark evaluation results of.</p><p data-story-section="value_insight">Generative models are entering compound content systems beyond single images or clips. It points to end-to-end content production as a major value path.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.11363" rel="noopener">https://arxiv.org/abs/2605.11363</a></p>
</section>
