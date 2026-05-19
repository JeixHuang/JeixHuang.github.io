---
title: "A04：Causal Forcing++: Scalable Few-Step Autoregressive Diffusion Distillation for Real-Time Interactive Video Generation"
date: "2026-05-11T12:00:00+08:00"
slug: "paper4"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper4/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper4"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: Causal Forcing++ 把自回归 diffusion distillation 推到 frame-wise、1-2 step 的实时交互视频设置。 方法: 在 bidirectional teacher 到 AR student 的蒸馏链路上压低采样步数和响应粒度，目标是 streaming controllable... 效果: 消融显示 causal CD 在 1/2/4 step 设置下匹配或优于 causal ODE initia..."
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
        <p data-story-section="context_setup">Causal Forcing++ 的切入点很具体：Causal Forcing++ 把自回归 diffusion distillation 推到 frame-wise、1-2 step 的实时交互视频设置。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">论文开头已经把问题形状讲清楚：Real-time interactive video generation requires low-latency, streaming, and controllable rollout. Existing autoregressive (AR) diffusion distillation methods have achieved strong results in the chunk-wise 4-step regime by distilling bidirectional base models into few-step AR students, but they remain limited by coarse。读这类工作，要看方法是否改变生成过程里的真实瓶颈，而不只看样例。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，而非只在离线 clip 上给出好看的几秒样例。</p><p data-story-section="core_question">在本周关键词中，它对应 时序状态 / history cache / rollout 稳定性。这里的关键词指向本文真正改动的位置：模型在哪里少走弯路、少丢信息，或者少依赖人工挑样例。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类缺口经常隐藏在系统边界里：训练时条件干净，部署时条件会漂；论文里看的是局部指标，用户面对的是完整生成链路。好的方法必须把这个缝隙显式收进模型或评测。</p><p data-story-section="mechanism_story">方法可以先压成一句：在 bidirectional teacher 到 AR student 的蒸馏链路上压低采样步数和响应粒度，目标是 streaming controllable rollout。</p><p data-story-section="mechanism_story">从可见方法描述看，关键在于 时序状态 / history cache / rollout 稳定性 的训练或推理位置被重新安排。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此本文的机制重点是重新安排 时序状态 / history cache / rollout 稳定性 的责任边界：哪些变量由模型内部学习，哪些变量由训练目标约束，哪些变量在推理时变成可调接口。</p><p data-story-section="training_or_inference_flow">按执行链路看，第一步是把输入条件变成模型可用的状态，第二步是在中间表征或采样路径上施加约束，第三步才是输出图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">Causal Forcing++ 的可复用部分主要在第二步。只要这个中间约束成立，方法就有机会迁移到更大的模型、更多数据或更复杂的控制条件；如果它只在最后输出端修补，扩展性会弱很多。</p><p data-story-section="training_or_inference_flow">机制图和结果表要贴着正文读：它们固定比较对象、指标和消融变量，能帮助判断方法是否真的改到了计算路径或评价协议。</p><p data-story-section="experiment_story">结果部分的硬信号是：消融显示 causal CD 在 1/2/4 step 设置下匹配或优于 causal ODE initialization，并把 Stage 2 成本降约 4x。结果指向实时视频需要的少步 rollout。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a04-p10-table-1.png" alt="Table 1: Comparisons with existing methods. Our method reduces latency by half and improves throughput, while achieving generation quality comparable to or even better than previous SOTA methods. Dynamic., Vi- sion. and Instruct. denote Dynamic Degree, VisionReward and Instruction Following, respectively. Through- put and latency are measured in FPS and seco" loading="lazy">
<figcaption><span>Table 1 p.10</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a04-p03-figure-2.png" alt="Figure 1: Overall framework of our Causal Forcing++ and the comparison with existing methods. (a) Causal Forcing (CF) ﬁxes Self Forcing (SF)’s frame-level injectivity ﬂaw but remains costly; our Causal Forcing++ (CF++) is theoretically sound, efﬁcient, and scalable. (b) Our CF++ reduces training cost by 4 × , requires no extra data curation, and achieves 50%" loading="lazy">
<figcaption><span>Figure 1 p.3</span></figcaption>
</figure><p data-story-section="experiment_story">结果部分给出的细节是：Ablation studies further show that causal CD consistently matches or outperforms causal ODE initialization across 1-step, 2-step, and 4step settings, while reducing the Stage 2 cost by about 4× and requiring no auxiliary trajectory storage。</p><p data-story-section="experiment_story">图表给出的定位是：p.10 的 Table 1：Comparisons with existing methods. Our method reduces latency by half and improves throughput, while achieving generation quality comparable to or even better than previous SOTA met；p.3 的 Figure 1：Overall framework of our Causal Forcing++ and the comparison with existing methods. (a) Causal Forcing (CF) ﬁxes Self Forcing (SF)’s frame-level injectivity ﬂaw but remains costly。这里重点看比较对象、指标和消融变量，避免把单个样例误读成完整证据。</p><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="value_insight">实时视频生成的评价坐标是 latency、control granularity、rollout stability。离线 clip 质量只是入口。 它直接决定视频模型能否成为交互工具：用户改动作、镜头或场景时，系统必须在可接受延迟内继续生成。</p><p data-story-section="value_insight">这类工作把视频生成推向 production system：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">Causal Forcing++ 进入周报的原因很直接：它在 时序状态 / history cache / rollout 稳定性 上给了可复用的设计信号。后续同类工作如果无法解释这一层变量，单靠更大模型或更漂亮样例说服力会下降。</p><p data-story-section="what_to_watch">后续观察重点是跨数据、跨分辨率、跨条件的稳定性。真正有价值的生成方法，不只在作者设定下有效，还要在约束变紧时保持可解释的退化曲线。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.15141" rel="noopener">https://arxiv.org/abs/2605.15141</a></p>
</section>
