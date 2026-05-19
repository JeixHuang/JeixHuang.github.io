---
title: "A04：Causal Forcing++: Scalable Few-Step Autoregressive Diffusion Distillation for Real-Time Interactive Video Generation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper4"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper4/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper4"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: Causal Forcing++ 把自回归 diffusion distillation 推到 frame-wise、1-2 step 的实时交互视频设置。 方法: 在 bidirectional teacher 到 AR student 的蒸馏链路上压低采样步数和响应粒度，目标是 streaming controllable rollout。 效果: 消融显示 causal CD 在 1/2/4 step 设置下匹配或优于 causal ODE initialization，并把 Stage 2 成本降约 4x。结果指向实时视频需要的少步 rollout。 Insight: 实时视频生成的评价坐标是 latency、control granularity、rollout stability。"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A04"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A04</span>
    <div>
      <h2>Causal Forcing++: Scalable Few-Step Autoregressive Diffusion Distillation for Real-Time Interactive Video Generation</h2>
      <p>视频 / 时序生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">实时视频生成的评价坐标是 latency、control granularity、rollout stability。离线 clip 质量只是入口。 它直接决定视频模型能否成为交互工具：用户改动作、镜头或场景时，系统必须在可接受延迟内继续生成。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Causal Forcing++ 把视频生成的压力放到时间轴上：Causal Forcing++ 把自回归 diffusion distillation 推到 frame-wise、1-2 step 的实时交互视频设置。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">这篇的分量取决于 时序状态 / history cache / rollout 稳定性 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，离线 clip 上的几秒样例只能算入口。</p><p data-story-section="core_question">如果 时序状态 / history cache / rollout 稳定性 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：在 bidirectional teacher 到 AR student 的蒸馏链路上压低采样步数和响应粒度，目标是 streaming controllable rollout。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：时序状态 / history cache / rollout 稳定性 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 时序状态 / history cache / rollout 稳定性 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">Causal Forcing++ 的可迁移价值主要在中间环节：只要 时序状态 / history cache / rollout 稳定性 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Table 1 p.10；Figure 1 p.3 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：消融显示 causal CD 在 1/2/4 step 设置下匹配或优于 causal ODE initialization，并把 Stage 2 成本降约 4x。结果指向实时视频需要的少步 rollout。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a04-p10-table-1.png" alt="Table 1: Comparisons with existing methods. Our method reduces latency by half and improves throughput, while achieving generation quality comparable to or even better than previous SOTA methods. Dynamic., Vi- sion. and Instruct. denote Dynamic Degree, VisionReward and Instruction Following, respectively. Through- put and latency are measured in FPS and seco" loading="lazy">
<figcaption><span>Table 1 p.10</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a04-p03-figure-2.png" alt="Figure 1: Overall framework of our Causal Forcing++ and the comparison with existing methods. (a) Causal Forcing (CF) ﬁxes Self Forcing (SF)’s frame-level injectivity ﬂaw but remains costly; our Causal Forcing++ (CF++) is theoretically sound, efﬁcient, and scalable. (b) Our CF++ reduces training cost by 4 × , requires no extra data curation, and achieves 50%" loading="lazy">
<figcaption><span>Figure 1 p.3</span></figcaption>
</figure><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="experiment_story">把结果放回 时序状态 / history cache / rollout 稳定性，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">实时视频生成的评价坐标是 latency、control granularity、rollout stability。离线 clip 质量只是入口。 它直接决定视频模型能否成为交互工具：用户改动作、镜头或场景时，系统必须在可接受延迟内继续生成。</p><p data-story-section="value_insight">这类工作把视频生成推向真实工具链：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 时序状态 / history cache / rollout 稳定性 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：时序状态 / history cache / rollout 稳定性 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.15141" rel="noopener">https://arxiv.org/abs/2605.15141</a></p>
</section>
