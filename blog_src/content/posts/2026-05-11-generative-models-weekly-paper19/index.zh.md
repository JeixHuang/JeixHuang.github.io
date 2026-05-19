---
title: "A19：WorldReasonBench: Human-Aligned Stress Testing of Video Generators as Future World-State Predictors"
date: "2026-05-11T12:00:00+08:00"
slug: "paper19"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper19/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper19"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: WorldReasonBench 把视频生成评测改写成 world-state prediction：给定初始状态和动作，检查未来视频是否符合世界演化。 方法: human-aligned stress test 直接评估因果、物理、事件推进和状态变化，而非只看画面质量。 效果: 效果是评测协议本身：用 video QA、binary judging、4 FPS 处理来测 world-state prediction。它不证明某个 generator 更强，价值在把“未来是否合理”变成可测对象。 Insight: video generator 被称为 world simulator 时，评测必须测预测能力。漂亮视频和正确未来是两种能力。"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A19"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A19</span>
    <div>
      <h2>WorldReasonBench: Human-Aligned Stress Testing of Video Generators as Future World-State Predictors</h2>
      <p>视频 / 时序生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">video generator 被称为 world simulator 时，评测必须测预测能力。漂亮视频和正确未来是两种能力。 它给视频模型拉出一条更硬的评价线：如果模型要服务 robotics、simulation 或 interactive planning，世界状态一致性必须可测。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">WorldReasonBench 把视频生成的压力放到时间轴上：WorldReasonBench 把视频生成评测改写成 world-state prediction：给定初始状态和动作，检查未来视频是否符合世界演化。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">这篇的分量取决于 时序状态 / history cache / rollout 稳定性 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，离线 clip 上的几秒样例只能算入口。</p><p data-story-section="core_question">如果 时序状态 / history cache / rollout 稳定性 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：human-aligned stress test 直接评估因果、物理、事件推进和状态变化，而非只看画面质量。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：时序状态 / history cache / rollout 稳定性 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 时序状态 / history cache / rollout 稳定性 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">WorldReasonBench 的可迁移价值主要在中间环节：只要 时序状态 / history cache / rollout 稳定性 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Table 2 p.6；Figure 2 p.4 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：效果是评测协议本身：用 video QA、binary judging、4 FPS 处理来测 world-state prediction。它不证明某个 generator 更强，价值在把“未来是否合理”变成可测对象。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a19-p06-table-1.png" alt="Table 2: Main evaluation results across WorldReasonBench dimensions. Per-dimension Score PR and S ( v ) ( 0 – 100 ) computed for every generator on a shared evaluation set for fully controlled cross- model comparison. Bold / underline : best/second-best across all 11 models. Full subcategory results, 95% bootstrap CIs, and additional open-source coverage are" loading="lazy">
<figcaption><span>Table 2 p.6</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a19-p04-figure-2.png" alt="Figure 2: Benchmark construction pipeline. A : WorldReasonBench construction, including taxonomy-aware captioning, prompt generation, and QA generation. B : WorldRewardBench construc- tion, including video sampling, expert scoring, preference-pair construction, and human-alignment evaluation" loading="lazy">
<figcaption><span>Figure 2 p.4</span></figcaption>
</figure><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="experiment_story">把结果放回 时序状态 / history cache / rollout 稳定性，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">video generator 被称为 world simulator 时，评测必须测预测能力。漂亮视频和正确未来是两种能力。 它给视频模型拉出一条更硬的评价线：如果模型要服务 robotics、simulation 或 interactive planning，世界状态一致性必须可测。</p><p data-story-section="value_insight">这类工作把视频生成推向真实工具链：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 时序状态 / history cache / rollout 稳定性 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：时序状态 / history cache / rollout 稳定性 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.10434" rel="noopener">https://arxiv.org/abs/2605.10434</a></p>
</section>
