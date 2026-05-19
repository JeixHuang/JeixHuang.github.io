---
title: "A06：RAVEN: Real-time Autoregressive Video Extrapolation with Consistency-model GRPO"
date: "2026-05-11T12:00:00+08:00"
slug: "paper6"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper6/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper6"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: RAVEN 面向实时流式视频外推，处理 autoregressive rollout 中训练历史和推理历史的分布偏移。 方法: 用 consistency-model GRPO 优化长程 rollout，让模型在自己生成的历史上继续生成时更稳。 效果: 结果把 TF / SF 的取舍拆开：motion、semantic alignment、visual fidelity 很难同时最优。RAVEN 的价值在把 streaming video 的分布偏移显式拿出来优化。 Insight: 实时视频生成的关键问题正在变成 online distribution shift：模型必须学会和自己的输出共处。"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A06"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A06</span>
    <div>
      <h2>RAVEN: Real-time Autoregressive Video Extrapolation with Consistency-model GRPO</h2>
      <p>视频 / 时序生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">实时视频生成的关键问题正在变成 online distribution shift：模型必须学会和自己的输出共处。 它和 AnyFlow、Causal Forcing++ 组成同一条线：短视频 diffusion 的质量优势要转换成可交互、可持续的实时生成。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">RAVEN 把生成质量的瓶颈前移到表征层：RAVEN 面向实时流式视频外推，处理 autoregressive rollout 中训练历史和推理历史的分布偏移。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">这篇的分量取决于 latent 表征 / tokenizer 重建 / 语义-细节分配 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，离线 clip 上的几秒样例只能算入口。</p><p data-story-section="core_question">如果 latent 表征 / tokenizer 重建 / 语义-细节分配 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：用 consistency-model GRPO 优化长程 rollout，让模型在自己生成的历史上继续生成时更稳。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：latent 表征 / tokenizer 重建 / 语义-细节分配 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 latent 表征 / tokenizer 重建 / 语义-细节分配 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">RAVEN 的可迁移价值主要在中间环节：只要 latent 表征 / tokenizer 重建 / 语义-细节分配 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Figure 4 p.8；Table 1 p.7 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：结果把 TF / SF 的取舍拆开：motion、semantic alignment、visual fidelity 很难同时最优。RAVEN 的价值在把 streaming video 的分布偏移显式拿出来优化。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a06-p08-figure-1.png" alt="Figure 4: Qualitative ablation on Training-time Test. See supplementary for playable video clips" loading="lazy">
<figcaption><span>Figure 4 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a06-p07-table-2.png" alt="Table 1: Quantitative comparison results" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="experiment_story">把结果放回 latent 表征 / tokenizer 重建 / 语义-细节分配，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">实时视频生成的关键问题正在变成 online distribution shift：模型必须学会和自己的输出共处。 它和 AnyFlow、Causal Forcing++ 组成同一条线：短视频 diffusion 的质量优势要转换成可交互、可持续的实时生成。</p><p data-story-section="value_insight">这类工作把视频生成推向真实工具链：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 latent 表征 / tokenizer 重建 / 语义-细节分配 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：latent 表征 / tokenizer 重建 / 语义-细节分配 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.15190" rel="noopener">https://arxiv.org/abs/2605.15190</a></p>
</section>
