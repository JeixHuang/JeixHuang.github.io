---
title: "A18：PhyMotion: Structured 3D Motion Reward for Physics-Grounded Human Video Generation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper18"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper18/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper18"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: PhyMotion 为 human video generation 设计 3D motion reward，用身体状态、接触和动力学约束补足 2D 感知评分。 方法: 把结构化 3D body state 引入视频后训练奖励，评分重点落在动作物理性和人体运动可信度。 效果: 论文报告它明显优于 perceptual、preference-based、physics-aware reward baselines；这些 baseline 通常只有 50-66% agreement，Spearman 相关也弱。效果重点是 3D motion reward 更接近人体运动判断。 Insight: 视频生成的人体问题需要物理奖励。画面清晰和姿态漂亮不足以保证运动连续、接触合理、重心可信。"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A18"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A18</span>
    <div>
      <h2>PhyMotion: Structured 3D Motion Reward for Physics-Grounded Human Video Generation</h2>
      <p>3D / 空间生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">视频生成的人体问题需要物理奖励。画面清晰和姿态漂亮不足以保证运动连续、接触合理、重心可信。 人类动作是视频模型最容易露馅的区域，也是广告、短剧、虚拟人最常见需求；reward 设计会决定后训练上限。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">PhyMotion 的核心变量是空间对应关系：PhyMotion 为 human video generation 设计 3D motion reward，用身体状态、接触和动力学约束补足 2D 感知评分。</p><p data-story-section="context_setup">3D 生成首先要看几何、语义和输入条件之间的对应关系。外观相似只是入口，空间结构可追踪才决定结果能否进入资产链路。</p><p data-story-section="context_setup">这篇的分量取决于 几何约束 / correspondence / 跨视角一致性 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">模型能否把二维条件、运动先验或物理约束稳定落到三维结构上，让结果可以被编辑、导航或复用。</p><p data-story-section="core_question">如果 几何约束 / correspondence / 跨视角一致性 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">只用视觉相似度会掩盖几何错误。形状、接触、遮挡、轨迹和语义区域一旦错位，样例看起来完整，资产或下游感知仍然不可用。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：把结构化 3D body state 引入视频后训练奖励，评分重点落在动作物理性和人体运动可信度。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：几何约束 / correspondence / 跨视角一致性 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看对应关系：像素到表面、卫星图到街景、视频运动到 3D trajectory，约束进入模型的位置决定了空间结构是否可信。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 几何约束 / correspondence / 跨视角一致性 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a18-p07-figure-2.png" alt="Figure 3: Agreement with human judgments for motion quality. Our metrics achieve the highest agreement compared with perceptual (VBench / VBench2) and learned (VideoAlign, VideoPhy) video metrics across three human-evaluation questions: body structure, balance, and motion naturalness" loading="lazy">
<figcaption><span>Figure 3 p.7</span></figcaption>
</figure><p data-story-section="training_or_inference_flow">PhyMotion 的可迁移价值主要在中间环节：只要 几何约束 / correspondence / 跨视角一致性 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Table 1 p.7；Figure 3 p.7 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：论文报告它明显优于 perceptual、preference-based、physics-aware reward baselines；这些 baseline 通常只有 50-66% agreement，Spearman 相关也弱。效果重点是 3D motion reward 更接近人体运动判断。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a18-p07-table-1.png" alt="Table 1: Correlation with human judgments for motion quality. We report Spearman’s rank correlation ( ρ ) between automatic metric scores and human judgments across three questions. Best results are in bold , and second-best results are underlined" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">结果要同时看几何指标、语义覆盖、物理一致性和定性样例；单一视觉分数不足以说明三维结果可用。</p><p data-story-section="experiment_story">把结果放回 几何约束 / correspondence / 跨视角一致性，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">视频生成的人体问题需要物理奖励。画面清晰和姿态漂亮不足以保证运动连续、接触合理、重心可信。 人类动作是视频模型最容易露馅的区域，也是广告、短剧、虚拟人最常见需求；reward 设计会决定后训练上限。</p><p data-story-section="value_insight">这条线的价值在资产生产和空间理解。生成模型如果能输出可追踪几何，就不只是造图，而是在提供可复用的世界表示。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 几何约束 / correspondence / 跨视角一致性 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：几何约束 / correspondence / 跨视角一致性 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.14269" rel="noopener">https://arxiv.org/abs/2605.14269</a></p>
</section>
