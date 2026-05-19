---
title: "A11：PresentAgent-2: Towards Generalist Multimodal Presentation Agents"
date: "2026-05-11T12:00:00+08:00"
slug: "paper11"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper11/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper11"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: 把 presentation generation 扩展成端到端视频内容生产：研究、素材组织、多模态媒体和交互交付在一个流程里完成。 方法: agentic pipeline 先聚焦 topic，再做 source research、媒体检索、内容规划和 presentation video assembly。 效果: benchmark 表明它覆盖 presentation、discussion、interaction、text/image/GIF/video 等多模块。结果重点是内容生产链路覆盖，而非单模型指标。 Insight: 这篇更像系统信号：生成模型的价值从单个 media output 进入复合内容生产链路。"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A11"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A11</span>
    <div>
      <h2>PresentAgent-2: Towards Generalist Multimodal Presentation Agents</h2>
      <p>视频 / 时序生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">这篇更像系统信号：生成模型的价值从单个 media output 进入复合内容生产链路。 它提示生成模型的落地形态会越来越像 production stack：模型能力、检索、规划、编辑和交付界面必须一起设计。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">PresentAgent-2 把视频生成的压力放到时间轴上：把 presentation generation 扩展成端到端视频内容生产：研究、素材组织、多模态媒体和交互交付在一个流程里完成。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">这篇的分量取决于 时序状态 / history cache / rollout 稳定性 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，离线 clip 上的几秒样例只能算入口。</p><p data-story-section="core_question">如果 时序状态 / history cache / rollout 稳定性 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：agentic pipeline 先聚焦 topic，再做 source research、媒体检索、内容规划和 presentation video assembly。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：时序状态 / history cache / rollout 稳定性 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 时序状态 / history cache / rollout 稳定性 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">PresentAgent-2 的可迁移价值主要在中间环节：只要 时序状态 / history cache / rollout 稳定性 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Table 4 p.8；Table 3 p.8 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：benchmark 表明它覆盖 presentation、discussion、interaction、text/image/GIF/video 等多模块。结果重点是内容生产链路覆盖，而非单模型指标。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a11-p08-table-1.png" alt="Table 4: Benchmark evaluation results of Human Reference and PresentAgent-2 with different models. Quiz is averaged on a 0–5 scale, and subjective scores are on a 1–5 scale. Metric abbreviations follow Table 2" loading="lazy">
<figcaption><span>Table 4 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a11-p08-table-2.png" alt="Table 3: Capability comparison between PresentAgent-2 and representative related systems. ✓ indicates explicit support, △ indicates partial or indirect support, and × indicates that the ca- pability is not supported or not the target of the method" loading="lazy">
<figcaption><span>Table 3 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="experiment_story">把结果放回 时序状态 / history cache / rollout 稳定性，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">这篇更像系统信号：生成模型的价值从单个 media output 进入复合内容生产链路。 它提示生成模型的落地形态会越来越像 production stack：模型能力、检索、规划、编辑和交付界面必须一起设计。</p><p data-story-section="value_insight">这类工作把视频生成推向真实工具链：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 时序状态 / history cache / rollout 稳定性 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：时序状态 / history cache / rollout 稳定性 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.11363" rel="noopener">https://arxiv.org/abs/2605.11363</a></p>
</section>
