---
title: "A08：Orthrus: Memory-Efficient Parallel Token Generation via Dual-View Diffusion"
date: "2026-05-11T12:00:00+08:00"
slug: "paper8"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper8/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper8"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: 用 dual-view diffusion 做并行 token 生成，同时保住自回归模型的生成精度。 方法: 一条视角保留 autoregressive exactness，另一条视角引入 diffusion-style parallel decoding；重点是吞吐和质量的共同约束。 效果: 实验设置强调长上下文与 masked blocks 下的并行 token 生成。结果看 memory / throughput 维度，而非图像质量：dual-view diffusion 用来减轻自回归生成的部署成本。 Insight: diffusion 的价值正在外溢到 token generation。这里的关键词是生成过程并行化：把 diffusion 看成吞吐工具。 它对应部署侧最硬的瓶颈：自回归解码慢。"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A08"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A08</span>
    <div>
      <h2>Orthrus: Memory-Efficient Parallel Token Generation via Dual-View Diffusion</h2>
      <p>图像 / 视觉合成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">diffusion 的价值正在外溢到 token generation。这里的关键词是生成过程并行化：把 diffusion 看成吞吐工具。 它对应部署侧最硬的瓶颈：自回归解码慢。生成建模路线如果能改变 token 生成吞吐，会反过来影响多模态系统架构。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Orthrus 把生成质量的瓶颈前移到表征层：用 dual-view diffusion 做并行 token 生成，同时保住自回归模型的生成精度。</p><p data-story-section="context_setup">当前图像与多模态生成的瓶颈越来越多地前移到 tokenizer、VAE、latent 和解码接口。</p><p data-story-section="context_setup">这篇的分量取决于 latent 表征 / tokenizer 重建 / 语义-细节分配 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">表征层能否同时保留语义、文字、细节和吞吐，而不把问题留给后面的 denoiser 或 autoregressive decoder 补救。</p><p data-story-section="core_question">如果 latent 表征 / tokenizer 重建 / 语义-细节分配 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">只优化主干模型容易误判瓶颈。压缩层丢掉文字和局部结构，解码器再强也只能修补；token 生成接口太慢，系统吞吐会直接卡死。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：一条视角保留 autoregressive exactness，另一条视角引入 diffusion-style parallel decoding；重点是吞吐和质量的共同约束。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：latent 表征 / tokenizer 重建 / 语义-细节分配 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看信息在哪里被压缩、融合或并行化：多层特征、latent channel、large patch、dual-view decoding 都是在重新分配表征预算。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 latent 表征 / tokenizer 重建 / 语义-细节分配 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">Orthrus 的可迁移价值主要在中间环节：只要 latent 表征 / tokenizer 重建 / 语义-细节分配 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Table 2 p.8；Figure 4 p.9 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：实验设置强调长上下文与 masked blocks 下的并行 token 生成。结果看 memory / throughput 维度，而非图像质量：dual-view diffusion 用来减轻自回归生成的部署成本。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a08-p08-table-1.png" alt="Table 2 contrasts Orthrus with state-of-the-art diffusion paradigms on complex mathematical and structural reasoning benchmarks. The results demonstrate a clear performance gap: existing diffusion- based models, including Dream ( Ye et al. , 2025a ), Fast-dLLM-v2 ( Wu et al. , 2025 ), LLaDA-1.5 ( Zhu et al. , 2025 ), SDAR ( Cheng et al. ), Mercury Coder ( Kh" loading="lazy">
<figcaption><span>Table 2 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a08-p09-figure-2.png" alt="Figure 4: Average Acceptance Length Comparison. We evaluate Orthrus against state-of-the-art speculative decoding methods, EAGLE-3 and DFlash. The unified dual-view architecture of Orthrus achieves a significantly higher number of verified tokens per forward pass" loading="lazy">
<figcaption><span>Figure 4 p.9</span></figcaption>
</figure><p data-story-section="experiment_story">结果要把 reconstruction、generation quality、文字/版式能力和吞吐放在一起看。单个视觉指标不能覆盖表征层的全部后果。</p><p data-story-section="experiment_story">把结果放回 latent 表征 / tokenizer 重建 / 语义-细节分配，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">diffusion 的价值正在外溢到 token generation。这里的关键词是生成过程并行化：把 diffusion 看成吞吐工具。 它对应部署侧最硬的瓶颈：自回归解码慢。生成建模路线如果能改变 token 生成吞吐，会反过来影响多模态系统架构。</p><p data-story-section="value_insight">这类论文的意义是基础设施级的：表征层一旦改好，会抬高后续生成、编辑、排版和高分辨率输出的共同上限。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 latent 表征 / tokenizer 重建 / 语义-细节分配 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：latent 表征 / tokenizer 重建 / 语义-细节分配 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.12825" rel="noopener">https://arxiv.org/abs/2605.12825</a></p>
</section>
