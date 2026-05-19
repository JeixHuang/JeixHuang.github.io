---
title: "A07：ELF: Embedded Language Flows"
date: "2026-05-11T12:00:00+08:00"
slug: "paper7"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper7/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper7"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: 把 diffusion / flow 的连续建模搬到语言嵌入空间，目标是减少纯离散 token 扩散的接口损耗。 方法: 在 embedding space 里建模 language flow，再把连续状态映射回 token；关键技术点是连续轨迹和离散输出之间的桥接。 效果: 实验主要看 generative perplexity / entropy 随 CFG scale 的取舍：guidance 越强，PPL 会降，但多样性同步收紧。可读结论是 ELF 在语言嵌入空间里确实形成了可调 sampling trade-off。 Insight: 这篇值得放在最前面，因为它把 flow 当成生成建模的通用数学对象，而非图像专属技巧。 如果这条线跑通，"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A07"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A07</span>
    <div>
      <h2>ELF: Embedded Language Flows</h2>
      <p>图像 / 视觉合成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">这篇值得放在最前面，因为它把 flow 当成生成建模的通用数学对象，而非图像专属技巧。 如果这条线跑通，language / image / video 的 sampling path 可以在同一层比较，多模态模型会少一个概念断层。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">ELF 把生成质量的瓶颈前移到表征层：把 diffusion / flow 的连续建模搬到语言嵌入空间，目标是减少纯离散 token 扩散的接口损耗。</p><p data-story-section="context_setup">当前图像与多模态生成的瓶颈越来越多地前移到 tokenizer、VAE、latent 和解码接口。</p><p data-story-section="context_setup">这篇的分量取决于 latent 表征 / tokenizer 重建 / 语义-细节分配 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">表征层能否同时保留语义、文字、细节和吞吐，而不把问题留给后面的 denoiser 或 autoregressive decoder 补救。</p><p data-story-section="core_question">如果 latent 表征 / tokenizer 重建 / 语义-细节分配 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">只优化主干模型容易误判瓶颈。压缩层丢掉文字和局部结构，解码器再强也只能修补；token 生成接口太慢，系统吞吐会直接卡死。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：在 embedding space 里建模 language flow，再把连续状态映射回 token；关键技术点是连续轨迹和离散输出之间的桥接。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：latent 表征 / tokenizer 重建 / 语义-细节分配 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看信息在哪里被压缩、融合或并行化：多层特征、latent channel、large patch、dual-view decoding 都是在重新分配表征预算。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 latent 表征 / tokenizer 重建 / 语义-细节分配 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">ELF 的可迁移价值主要在中间环节：只要 latent 表征 / tokenizer 重建 / 语义-细节分配 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Figure 1 p.1；Figure 7 p.8 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：实验主要看 generative perplexity / entropy 随 CFG scale 的取舍：guidance 越强，PPL 会降，但多样性同步收紧。可读结论是 ELF 在语言嵌入空间里确实形成了可调 sampling trade-off。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a07-p01-figure-1.png" alt="Figure 1: ELF achieves lower generative per- plexity with fewer sampling steps than prior DLMs, without using distillation. ELF achieves this while using 10 × fewer training tokens. (Model size: 105M for ELF and 170M for others; dataset: OWT. Detailed comparison in Fig. 7 .)" loading="lazy">
<figcaption><span>Figure 1 p.1</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a07-p08-figure-2.png" alt="Figure 7: System-level comparison. ELF-B outperforms both discrete and continuous DLMs trained under similar settings (a), rivals distilled variants of other baselines that require additional rounds of training (b), and uses substantially fewer training tokens (c)" loading="lazy">
<figcaption><span>Figure 7 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">结果要把 reconstruction、generation quality、文字/版式能力和吞吐放在一起看。单个视觉指标不能覆盖表征层的全部后果。</p><p data-story-section="experiment_story">把结果放回 latent 表征 / tokenizer 重建 / 语义-细节分配，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">这篇值得放在最前面，因为它把 flow 当成生成建模的通用数学对象，而非图像专属技巧。 如果这条线跑通，language / image / video 的 sampling path 可以在同一层比较，多模态模型会少一个概念断层。</p><p data-story-section="value_insight">这类论文的意义是基础设施级的：表征层一旦改好，会抬高后续生成、编辑、排版和高分辨率输出的共同上限。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 latent 表征 / tokenizer 重建 / 语义-细节分配 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：latent 表征 / tokenizer 重建 / 语义-细节分配 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.10938" rel="noopener">https://arxiv.org/abs/2605.10938</a></p>
</section>
