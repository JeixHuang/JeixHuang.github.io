---
title: "A18：PhyMotion: Structured 3D Motion Reward for Physics-Grounded Human Video Generation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper18"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper18/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper18"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: PhyMotion 为 human video generation 设计 3D motion reward，用身体状态、接触和动力学约束补足 2D 感知评分。 方法: 把结构化 3D body state 引入视频后训练奖励，评分重点落在动作物理性和人体运动可信度。 效果: 论文报告它明显优于 perceptual、preference-based、physics-aware reward baselines；这些 baseline 通... I..."
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
        <p data-story-section="context_setup">PhyMotion 的切入点很具体：PhyMotion 为 human video generation 设计 3D motion reward，用身体状态、接触和动力学约束补足 2D 感知评分。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">论文开头已经把问题形状讲清楚：Generating realistic human motion is a central yet unsolved challenge in video generation. Whilereinforcementlearning(RL)-basedpost-traininghasdrivenrecent gains in general video quality, extending it to human motion remains bottlenecked byarewardsignalthatcannotreliablyscoremotionrealism. Existingvideorewards primaril。读这类工作，要看方法是否改变生成过程里的真实瓶颈，而不只看样例。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，而非只在离线 clip 上给出好看的几秒样例。</p><p data-story-section="core_question">在本周关键词中，它对应 几何约束 / correspondence / 跨视角一致性。这里的关键词指向本文真正改动的位置：模型在哪里少走弯路、少丢信息，或者少依赖人工挑样例。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类缺口经常隐藏在系统边界里：训练时条件干净，部署时条件会漂；论文里看的是局部指标，用户面对的是完整生成链路。好的方法必须把这个缝隙显式收进模型或评测。</p><p data-story-section="mechanism_story">方法可以先压成一句：把结构化 3D body state 引入视频后训练奖励，评分重点落在动作物理性和人体运动可信度。</p><p data-story-section="mechanism_story">方法段可核对的线索是：The same trend also holds for FastWan 1.3B: after post-training withPhyMotion, the model improves motion smoothness, aesthetic quality, temporal flickering, VideoAlign, VideoPhy, and allPhyMotion scores, including a+7.0% gain in overall feasibility。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此本文的机制重点是重新安排 几何约束 / correspondence / 跨视角一致性 的责任边界：哪些变量由模型内部学习，哪些变量由训练目标约束，哪些变量在推理时变成可调接口。</p><p data-story-section="training_or_inference_flow">按执行链路看，第一步是把输入条件变成模型可用的状态，第二步是在中间表征或采样路径上施加约束，第三步才是输出图像、视频或三维结果。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a18-p07-figure-2.png" alt="Figure 3: Agreement with human judgments for motion quality. Our metrics achieve the highest agreement compared with perceptual (VBench / VBench2) and learned (VideoAlign, VideoPhy) video metrics across three human-evaluation questions: body structure, balance, and motion naturalness" loading="lazy">
<figcaption><span>Figure 3 p.7</span></figcaption>
</figure><p data-story-section="training_or_inference_flow">PhyMotion 的可复用部分主要在第二步。只要这个中间约束成立，方法就有机会迁移到更大的模型、更多数据或更复杂的控制条件；如果它只在最后输出端修补，扩展性会弱很多。</p><p data-story-section="training_or_inference_flow">机制图和结果表要贴着正文读：它们固定比较对象、指标和消融变量，能帮助判断方法是否真的改到了计算路径或评价协议。</p><p data-story-section="experiment_story">结果部分的硬信号是：论文报告它明显优于 perceptual、preference-based、physics-aware reward baselines；这些 baseline 通常只有 50-66% agreement，Spearman 相关也弱。效果重点是 3D motion reward 更接近人体运动判断。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a18-p07-table-1.png" alt="Table 1: Correlation with human judgments for motion quality. We report Spearman’s rank correlation ( ρ ) between automatic metric scores and human judgments across three questions. Best results are in bold , and second-best results are underlined" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">结果部分给出的细节是：This substantially outperforms existing perceptual, preference-based, and physics-awarerewardbaselines, whichtypicallyachieve 50–66%agreementandonlyweakSpearman correlations (ρ= 0 –0.25)。</p><p data-story-section="experiment_story">图表给出的定位是：p.7 的 Table 1：Correlation with human judgments for motion quality. We report Spearman’s rank correlation ( ρ ) between automatic metric scores and human judgments across three questions. Best res；p.7 的 Figure 3：Agreement with human judgments for motion quality. Our metrics achieve the highest agreement compared with perceptual (VBench / VBench2) and learned (VideoAlign, VideoPhy) video me。这里重点看比较对象、指标和消融变量，避免把单个样例误读成完整证据。</p><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="value_insight">视频生成的人体问题需要物理奖励。画面清晰和姿态漂亮不足以保证运动连续、接触合理、重心可信。 人类动作是视频模型最容易露馅的区域，也是广告、短剧、虚拟人最常见需求；reward 设计会决定后训练上限。</p><p data-story-section="value_insight">这类工作把视频生成推向 production system：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">PhyMotion 进入周报的原因很直接：它在 几何约束 / correspondence / 跨视角一致性 上给了可复用的设计信号。后续同类工作如果无法解释这一层变量，单靠更大模型或更漂亮样例说服力会下降。</p><p data-story-section="what_to_watch">后续观察重点是跨数据、跨分辨率、跨条件的稳定性。真正有价值的生成方法，不只在作者设定下有效，还要在约束变紧时保持可解释的退化曲线。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.14269" rel="noopener">https://arxiv.org/abs/2605.14269</a></p>
</section>
