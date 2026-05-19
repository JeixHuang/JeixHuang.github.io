---
title: "A14：Warp-as-History: Generalizable Camera-Controlled Video Generation from One Training Video"
date: "2026-05-11T12:00:00+08:00"
slug: "paper14"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper14/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper14"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: 用历史帧 warping 做相机控制，让单个训练视频也能提供可泛化的 camera-conditioned video generation 信号。 方法: 把 warped history 作为时序条件注入生成过程，降低对大规模 camera-annotated video 的依赖。 效果: one-shot finetuning 的主观质量从 47.37 到 54.83，平均分从 63.26 到 65.64。结论很具体：warped history 是一个轻量但有效的 camera control 接口。 Insight: 相机控制的难点在时序几何；history 本身可以成为控制接口，减少对重控制分支的依赖。 叙事视频、广告、虚拟场景都需要可控镜头语言；"
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A14"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A14</span>
    <div>
      <h2>Warp-as-History: Generalizable Camera-Controlled Video Generation from One Training Video</h2>
      <p>视频 / 时序生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">相机控制的难点在时序几何；history 本身可以成为控制接口，减少对重控制分支的依赖。 叙事视频、广告、虚拟场景都需要可控镜头语言；这类方法把 camera control 变成更轻的训练问题。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">Warp-as-History 把视频生成的压力放到时间轴上：用历史帧 warping 做相机控制，让单个训练视频也能提供可泛化的 camera-conditioned video generation 信号。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">这篇的分量取决于 时序状态 / history cache / rollout 稳定性 有没有成为模型设计的一部分。如果它只出现在输出解释里，方法价值会很薄；如果它进入训练目标、采样路径或中间表征，就会影响模型的可迁移性。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，离线 clip 上的几秒样例只能算入口。</p><p data-story-section="core_question">如果 时序状态 / history cache / rollout 稳定性 只停留在输出端修补，模型规模变大也未必解决问题；如果它进入训练目标、采样路径或中间表征，方法才可能迁移到更严格的条件下。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类错误往往不在单个样例里出现，而是在分辨率、时长、控制强度或输入复杂度增加后被放大。生成模型一旦进入工具链，这种放大会比单次视觉质量更要命。</p><p data-story-section="mechanism_story">方法上的转折是：把 warped history 作为时序条件注入生成过程，降低对大规模 camera-annotated video 的依赖。</p><p data-story-section="mechanism_story">更重要的是责任分配发生了变化：时序状态 / history cache / rollout 稳定性 从评测时才出现的现象，前移成模型需要学习或保持的内部结构。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此阅读重点要从模块名转向 时序状态 / history cache / rollout 稳定性 进入计算图的位置：训练目标、采样路径和中间表征看似都在“加约束”，实际改变的是完全不同的责任边界。</p><p data-story-section="training_or_inference_flow">从执行链路看，输入条件先被转成模型状态，约束再通过中间表征、采样路径或训练目标生效，最后才成为图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">Warp-as-History 的可迁移价值主要在中间环节：只要 时序状态 / history cache / rollout 稳定性 的处理方式不依赖某个固定样例，就有机会迁移到更大的模型、更多数据或更复杂的控制条件。</p><p data-story-section="training_or_inference_flow">Figure 4 p.7；Figure 5 p.8 对应的是文中最值得核对的机制或实验比较。</p><p data-story-section="experiment_story">实验给出的直接信号是：one-shot finetuning 的主观质量从 47.37 到 54.83，平均分从 63.26 到 65.64。结论很具体：warped history 是一个轻量但有效的 camera control 接口。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a14-p07-figure-1.png" alt="Figure 4: Qualitative comparison with external camera-control methods on in-the-wild videos. Columns show the camera-induced warp, ground truth, ViewCrafter, Gen3C, Voyager, and ours under the same target camera setting" loading="lazy">
<figcaption><span>Figure 4 p.7</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a14-p08-figure-2.png" alt="Figure 5: Qualitative comparison with HyWorldPlay on 30-second trajectories sampled from World- Score images. Frames are shown at 0, 12, 24, and 30 seconds" loading="lazy">
<figcaption><span>Figure 5 p.8</span></figcaption>
</figure><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="experiment_story">把结果放回 时序状态 / history cache / rollout 稳定性，需要看变量变化时质量、效率和稳定性是否同步变化。单个最优点不够，稳定的退化曲线更能说明方法质量。</p><p data-story-section="value_insight">相机控制的难点在时序几何；history 本身可以成为控制接口，减少对重控制分支的依赖。 叙事视频、广告、虚拟场景都需要可控镜头语言；这类方法把 camera control 变成更轻的训练问题。</p><p data-story-section="value_insight">这类工作把视频生成推向真实工具链：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">这也是它在本周目录里的位置：它把 时序状态 / history cache / rollout 稳定性 从附属现象变成可讨论的设计对象。</p><p data-story-section="what_to_watch">后面应继续看两件事：时序状态 / history cache / rollout 稳定性 在更大模型上是否仍然成立，以及控制条件变紧时是否出现清晰、可解释的退化。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.15182" rel="noopener">https://arxiv.org/abs/2605.15182</a></p>
</section>
