---
title: "A17：Beyond the Last Layer: Multi-Layer Representation Fusion for Visual Tokenization"
date: "2026-05-11T12:00:00+08:00"
slug: "paper17"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper17/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper17"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: 视觉 tokenizer 取多层表征，而非只取最后一层，保留低层细节和高层语义的共同信息。 方法: 从 frozen vision encoder 的中间层和最后层同时取特征，再做 multi-layer representation fusion。 效果: 中间 Phase 2 已达到 rFID 0.47、PSNR 21.79。它说明 tokenizer 取多层特征不是装饰，低层细节和高层语义会直接影响重建和生成底座。 Insight: toke..."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A17"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A17</span>
    <div>
      <h2>Beyond the Last Layer: Multi-Layer Representation Fusion for Visual Tokenization</h2>
      <p>图像 / 视觉合成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">tokenizer/VAE 线里最值得看的是表征分层：最后层语义强，低层细节弱；生成任务需要二者共存。 这会影响 reconstruction、generation quality 和后续 diffusion transformer 的输入质量，是基础设施型改进。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Beyond the Last Layer 的切入点很具体：视觉 tokenizer 取多层表征，而非只取最后一层，保留低层细节和高层语义的共同信息。</p><p data-story-section="context_setup">当前图像与多模态生成的瓶颈越来越多地前移到 tokenizer、VAE、latent 和解码接口。</p><p data-story-section="context_setup">论文开头已经把问题形状讲清楚：Representation autoencoders that reuse frozen pretrained vision encoders as visual tokenizers have achieved strong reconstruction and generation quality. However, existing methods universally extract features from only the last encoder layer, discarding the rich hierarchical information distributed across intermediate。读这类工作，要看方法是否改变生成过程里的真实瓶颈，而不只看样例。</p><p data-story-section="core_question">表征层能否同时保留语义、文字、细节和吞吐，而不把问题留给后面的 denoiser 或 autoregressive decoder 补救。</p><p data-story-section="core_question">在本周关键词中，它对应 latent 表征 / tokenizer 重建 / 语义-细节分配。这里的关键词指向本文真正改动的位置：模型在哪里少走弯路、少丢信息，或者少依赖人工挑样例。</p><p data-story-section="prior_gap">只优化主干模型容易误判瓶颈。压缩层丢掉文字和局部结构，解码器再强也只能修补；token 生成接口太慢，系统吞吐会直接卡死。</p><p data-story-section="prior_gap">这类缺口经常隐藏在系统边界里：训练时条件干净，部署时条件会漂；论文里看的是局部指标，用户面对的是完整生成链路。好的方法必须把这个缝隙显式收进模型或评测。</p><p data-story-section="mechanism_story">方法可以先压成一句：从 frozen vision encoder 的中间层和最后层同时取特征，再做 multi-layer representation fusion。</p><p data-story-section="mechanism_story">方法段可核对的线索是：DRoRAE better preserves fine-grained textures, structural details, and color fidelity, particularly in regions with repetitive patterns, thin structures, and high-frequency content that the last-layer representation alone tends to lose。</p><p data-story-section="mechanism_story">机制判断要看信息在哪里被压缩、融合或并行化：多层特征、latent channel、large patch、dual-view decoding 都是在重新分配表征预算。</p><p data-story-section="mechanism_story">因此本文的机制重点是重新安排 latent 表征 / tokenizer 重建 / 语义-细节分配 的责任边界：哪些变量由模型内部学习，哪些变量由训练目标约束，哪些变量在推理时变成可调接口。</p><p data-story-section="training_or_inference_flow">按执行链路看，第一步是把输入条件变成模型可用的状态，第二步是在中间表征或采样路径上施加约束，第三步才是输出图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">Beyond the Last Layer 的可复用部分主要在第二步。只要这个中间约束成立，方法就有机会迁移到更大的模型、更多数据或更复杂的控制条件；如果它只在最后输出端修补，扩展性会弱很多。</p><p data-story-section="training_or_inference_flow">机制图和结果表要贴着正文读：它们固定比较对象、指标和消融变量，能帮助判断方法是否真的改到了计算路径或评价协议。</p><p data-story-section="experiment_story">结果部分的硬信号是：中间 Phase 2 已达到 rFID 0.47、PSNR 21.79。它说明 tokenizer 取多层特征不是装饰，低层细节和高层语义会直接影响重建和生成底座。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a17-p07-table-1.png" alt="Table 1: Image reconstruction and class-conditional generation on ImageNet-256 ( 256 × 256 ). Tok- enizer metrics are intrinsic to the encoder-decoder pair and independent of the generator. Generation metrics depend on both the tokenizer and the generator. † From original papers. ‡ Our method. DRo- RAE reports Phase 2 results (fusion only, decoder frozen); D" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a17-p07-table-2.png" alt="Table 1 presents a unified comparison of reconstruction and generation quality. Methods are organized by the nature of their latent space into three groups. The top group uses latent spaces learned from scratch, the middle group aligns to pretrained representations during training, and the bottom group derives latent spaces from pretrained encoder outputs. T" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">结果部分给出的细节是：The intermediate Phase 2 result (fusion only, decoder frozen) already achieves rFID 0.47 with PSNR 21.79。</p><p data-story-section="experiment_story">图表给出的定位是：p.7 的 Table 1：Image reconstruction and class-conditional generation on ImageNet-256 ( 256 × 256 ). Tok- enizer metrics are intrinsic to the encoder-decoder pair and independent of the generator；p.7 的 Table 1：presents a unified comparison of reconstruction and generation quality. Methods are organized by the nature of their latent space into three groups. The top group uses latent spaces。这里重点看比较对象、指标和消融变量，避免把单个样例误读成完整证据。</p><p data-story-section="experiment_story">结果要把 reconstruction、generation quality、文字/版式能力和吞吐放在一起看。单个视觉指标不能覆盖表征层的全部后果。</p><p data-story-section="value_insight">tokenizer/VAE 线里最值得看的是表征分层：最后层语义强，低层细节弱；生成任务需要二者共存。 这会影响 reconstruction、generation quality 和后续 diffusion transformer 的输入质量，是基础设施型改进。</p><p data-story-section="value_insight">这类论文的意义是基础设施级的：表征层一旦改好，会抬高后续生成、编辑、排版和高分辨率输出的共同上限。</p><p data-story-section="value_insight">Beyond the Last Layer 进入周报的原因很直接：它在 latent 表征 / tokenizer 重建 / 语义-细节分配 上给了可复用的设计信号。后续同类工作如果无法解释这一层变量，单靠更大模型或更漂亮样例说服力会下降。</p><p data-story-section="what_to_watch">后续观察重点是跨数据、跨分辨率、跨条件的稳定性。真正有价值的生成方法，不只在作者设定下有效，还要在约束变紧时保持可解释的退化曲线。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.10780" rel="noopener">https://arxiv.org/abs/2605.10780</a></p>
</section>
