---
title: "A12：SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer"
date: "2026-05-11T12:00:00+08:00"
slug: "paper12"
url: "/2026/05/11/generative-models-weekly-2026-05-11/paper12/"
translationKey: "blogger-weekly-generative-models-2026-05-11-paper12"
tags: ["generative-models", "multimodal-generation", "diffusion", "weekly"]
summary: "问题: SANA-WM 用 2.6B 开源世界模型做分钟级 720p 视频生成，重点放在效率、长时长和相机控制。 方法: Hybrid Linear Diffusion Transformer 结合 frame-wise Gated DeltaNet 和 softmax attenti... 效果: 论文报告分钟级生成可降到单 GPU 推理：bidirectional / chunk-causal 版本能放进一张 H100，distilled 版本在 RT..."
weekly_report: true
weekly_paper_detail: true
hide_from_lists: true
weekly_field: "生成模型"
weekly_signal_id: "A12"
week_start: "2026-05-11"
week_end: "2026-05-17"
full_read_url: "/blog/2026/05/11/generative-models-weekly-2026-05-11/"
---


<section class="weekly-paper-page">
  <a class="weekly-back-link" href="/blog/2026/05/11/generative-models-weekly-2026-05-11/">返回周报总览</a>
  <div class="weekly-paper-page-kicker">生成模型 · 2026.5.11 - 5.17</div>
  <div class="weekly-paper-page-title">
    <span class="weekly-detail-id">A12</span>
    <div>
      <h2>SANA-WM: Efficient Minute-Scale World Modeling with Hybrid Linear Diffusion Transformer</h2>
      <p>视频 / 时序生成</p>
    </div>
  </div>
  <section class="weekly-deep-read weekly-story-v2 weekly-story-essay">
        <p class="weekly-story-punchline">视频 world model 的竞争坐标变清楚了：duration、openness、efficiency、camera control。大模型样片之外，开源可复现很关键。 分钟级生成把时间一致性问题放大，也把成本问题放大；这类模型决定 world model 能否进入研究和产品原型。</p>
        <div class="weekly-story-essay-body">
        <p data-story-section="context_setup">SANA-WM 的切入点很具体：SANA-WM 用 2.6B 开源世界模型做分钟级 720p 视频生成，重点放在效率、长时长和相机控制。</p><p data-story-section="context_setup">视频模型的难点已经从单帧质量转到时间轴：采样预算、历史状态、控制信号和长程一致性必须同时成立。</p><p data-story-section="context_setup">论文开头已经把问题形状讲清楚：We introduce SANA-WM, an efficient 2.6B-parameter open-source world model natively trained for one-minute generation, synthesizing high-fidelity, 720p, minute-scale videos with precise camera control. SANA-WM achieves visual quality comparable to large-scale industrial baselines such as LingBot-World and HY-WorldPlay。读这类工作，要看方法是否改变生成过程里的真实瓶颈，而不只看样例。</p><p data-story-section="core_question">模型能否在延迟受限、状态持续变化的条件下继续生成，而非只在离线 clip 上给出好看的几秒样例。</p><p data-story-section="core_question">在本周关键词中，它对应 时序状态 / history cache / rollout 稳定性。这里的关键词指向本文真正改动的位置：模型在哪里少走弯路、少丢信息，或者少依赖人工挑样例。</p><p data-story-section="prior_gap">旧路线常把训练片段和部署 rollout 分开看。训练时看到的是干净上下文，推理时面对的是自己刚生成的历史；误差、运动状态和控制条件会沿时间轴累积。</p><p data-story-section="prior_gap">这类缺口经常隐藏在系统边界里：训练时条件干净，部署时条件会漂；论文里看的是局部指标，用户面对的是完整生成链路。好的方法必须把这个缝隙显式收进模型或评测。</p><p data-story-section="mechanism_story">方法可以先压成一句：Hybrid Linear Diffusion Transformer 结合 frame-wise Gated DeltaNet 和 softmax attention，服务长时长世界建模。</p><p data-story-section="mechanism_story">方法段可核对的线索是：GDN + softmax LTX2 / 720p 0.7834 0.9226 0.8530 5.68 433.2 2.31 GDN key scaling.We evaluate training stability under identical conditions: 81-frame sequences and an all-GDN [ 11] architecture initialized from a shared LTX2-V AE [10] cumulative-linear checkpoint。</p><p data-story-section="mechanism_story">机制判断要看状态如何传递：teacher 信号、history cache、timestep 或 camera condition 在哪一步进入模型，决定了它是一次性样例生成还是可连续调用的系统。</p><p data-story-section="mechanism_story">因此本文的机制重点是重新安排 时序状态 / history cache / rollout 稳定性 的责任边界：哪些变量由模型内部学习，哪些变量由训练目标约束，哪些变量在推理时变成可调接口。</p><p data-story-section="training_or_inference_flow">按执行链路看，第一步是把输入条件变成模型可用的状态，第二步是在中间表征或采样路径上施加约束，第三步才是输出图像、视频或三维结果。</p><p data-story-section="training_or_inference_flow">SANA-WM 的可复用部分主要在第二步。只要这个中间约束成立，方法就有机会迁移到更大的模型、更多数据或更复杂的控制条件；如果它只在最后输出端修补，扩展性会弱很多。</p><p data-story-section="training_or_inference_flow">机制图和结果表要贴着正文读：它们固定比较对象、指标和消融变量，能帮助判断方法是否真的改到了计算路径或评价协议。</p><p data-story-section="experiment_story">结果部分的硬信号是：论文报告分钟级生成可降到单 GPU 推理：bidirectional / chunk-causal 版本能放进一张 H100，distilled 版本在 RTX 5090 + NVFP4 下 34 秒生成 1 分钟视频。效果是长视频 world model 的成本门槛下降。</p><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a12-p08-table-1.png" alt="Table 2 | Quantitative comparison on our 1-min benchmark. Bold Res marks 720p. Pose Acc. reports R in degrees, plus T/CMC; VBench reports eight dimensions plus Overall. Mem/Tput are peak GB and videos/hour on 8 H100s. Green highlights mark top-three entries" loading="lazy">
<figcaption><span>Table 2 p.8</span></figcaption>
</figure><figure class="weekly-inline-figure weekly-inline-figure--wide">
<img src="figures/a12-p07-table-2.png" alt="Table 1 | Training data overview after filtering" loading="lazy">
<figcaption><span>Table 1 p.7</span></figcaption>
</figure><p data-story-section="experiment_story">结果部分给出的细节是：Most importantly for accessibility, it reduces minute-scale generation to a single-GPU inference setting: the bidirectional and chunk-causal variants fit within one H100, and our distilled variant brings 1-minute video generation to 34s on a single RTX 5090 with NVFP4 quantization。</p><p data-story-section="experiment_story">图表给出的定位是：p.8 的 Table 2：Quantitative comparison on our 1-min benchmark. Bold Res marks 720p. Pose Acc. reports R in degrees, plus T/CMC; VBench reports eight dimensions plus Overall. Mem/Tput are peak GB；p.7 的 Table 1：Training data overview after filtering。这里重点看比较对象、指标和消融变量，避免把单个样例误读成完整证据。</p><p data-story-section="experiment_story">结果要优先看延迟、吞吐、长程稳定和控制一致性，再看单张样例。视频系统的价值在连续可用，不在挑一帧最漂亮。</p><p data-story-section="value_insight">视频 world model 的竞争坐标变清楚了：duration、openness、efficiency、camera control。大模型样片之外，开源可复现很关键。 分钟级生成把时间一致性问题放大，也把成本问题放大；这类模型决定 world model 能否进入研究和产品原型。</p><p data-story-section="value_insight">这类工作把视频生成推向 production system：同一模型要能预览、交互、延展和最终渲染，质量曲线必须和成本曲线一起读。</p><p data-story-section="value_insight">SANA-WM 进入周报的原因很直接：它在 时序状态 / history cache / rollout 稳定性 上给了可复用的设计信号。后续同类工作如果无法解释这一层变量，单靠更大模型或更漂亮样例说服力会下降。</p><p data-story-section="what_to_watch">后续观察重点是跨数据、跨分辨率、跨条件的稳定性。真正有价值的生成方法，不只在作者设定下有效，还要在约束变紧时保持可解释的退化曲线。</p>
        </div>
        </section>
  
  <p class="weekly-arxiv-link"><span>arXiv 链接</span><a href="https://arxiv.org/abs/2605.15178" rel="noopener">https://arxiv.org/abs/2605.15178</a></p>
</section>
