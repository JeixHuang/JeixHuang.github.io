---
title: "A17: Beyond the Last Layer: Multi-Layer Representation Fusion for Visual Tokenization"
date: "2026-05-11T12:00:00+08:00"
slug: "paper17"
url: "/en/2026/05/11/generative-models-weekly-2026-05-11/paper17/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper17"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "Problem: Fuses multi-layer representations instead of relying only on the last visual-encoder layer. Method: Multi-layer visual representation fusion to recover details lost in the last layer. Effect: The intermediate Phase 2 already reaches rFID 0.47 and PSNR 21.79. Multi-layer tokenization is not cosmetic..."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "Generative Models"
weekly_signal_id: "A17"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/en/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/en/2026/05/11/generative-models-weekly-2026-05-11/">Back to weekly overview</a>
  <div class="weekly-paper-page-kicker">Generative Models · May 11 - May 17, 2026</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A17</span>
    <div>
      <h2>Beyond the Last Layer: Multi-Layer Representation Fusion for Visual Tokenization</h2>
      <p>Image / visual synthesis</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">tokenizer/VAE 线里最值得看的是表征分层：最后层语义强，低层细节弱；生成任务需要二者共存。 这会影响 reconstruction、generation quality 和后续 diffusion transformer 的输入质量，是基础设施型改进。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Beyond the Last Layer targets a hard constraint in generative modeling: Fuses multi-layer representations instead of relying only on the last visual-encoder layer.</p><p data-story-section="context_setup">The useful lens is latent representation / tokenizer reconstruction / semantic-detail allocation: the paper should be read through the variable it changes inside the generation process, not only through final samples.</p><p data-story-section="core_question">The paper asks whether the model can make latent representation / tokenizer reconstruction / semantic-detail allocation a trainable and measurable part of the generation process.</p><p data-story-section="prior_gap">The common failure mode is a mismatch between training assumptions, inference state, and evaluation target; the output may look plausible while the system remains hard to reuse.</p><p data-story-section="mechanism_story">The method can be compressed as: Multi-layer visual representation fusion to recover details lost in the last layer.</p><p data-story-section="mechanism_story">The concrete method clue is: DRoRAE better preserves fine-grained textures, structural details, and color fidelity, particularly in regions with repetitive patterns, thin structures, and high-frequency content that the last-layer representation alone tends to lose.</p><p data-story-section="training_or_inference_flow">The reusable part is the middle of the pipeline: how conditions, latent states, or sampling paths are constrained before the final output is rendered.</p><p data-story-section="experiment_story">The reported effect is: The intermediate Phase 2 already reaches rFID 0.47 and PSNR 21.79. Multi-layer tokenization is not cosmetic; low-level detail and high-level semantics affect reconstruction and generation foundations.</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a17-p07-table-1.png" alt="Table 1: Image reconstruction and class-conditional generation on ImageNet-256 ( 256 × 256 ). Tok- enizer metrics are intrinsic to the encoder-decoder pair and independent of the generator. Generation metrics depend on both the tokenizer and the generator. † From original papers. ‡ Our method. DRo- RAE reports Phase 2 results (fusion only, decoder frozen); D" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a17-p07-table-2.png" alt="Table 1 presents a unified comparison of reconstruction and generation quality. Methods are organized by the nature of their latent space into three groups. The top group uses latent spaces learned from scratch, the middle group aligns to pretrained representations during training, and the bottom group derives latent spaces from pretrained encoder outputs. T" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">The traceable result clue is: The intermediate Phase 2 result (fusion only, decoder frozen) already achieves rFID 0.47 with PSNR 21.79.</p><p data-story-section="value_insight">Generation quality increasingly depends on tokenizer/autoencoder representation design. The tokenizer is the input interface for the generation stack; errors propagate downstream.</p><p data-story-section="what_to_watch">The next check is whether the mechanism remains stable across data, scale, resolution, and tighter control conditions.</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv</span><a href="https://arxiv.org/abs/2605.10780" rel="noopener">https://arxiv.org/abs/2605.10780</a></p>
</section>
