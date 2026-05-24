---
title: "Late-May VLA / WAM / World Model Reading List Vol. 1"
date: 2026-05-24T09:00:00+08:00
slug: "late-may-vla-wam-world-model-reading-list-vol-1"
tags: ["vla", "wam", "world-model", "embodied-ai", "paper-reading"]
summary: "A compact reading directory for ten late-May papers around VLA, WAM, and embodied world models."
---

This is a compact reading directory for ten papers I would prioritize from the late-May VLA / WAM / World Model batch. The common thread is clear: the next step is less about making the action head larger, and more about adding memory, scene state, world rollout, and runtime verification around the policy.

![Late-May VLA / WAM / World Model Reading List Vol. 1](/blog/assets/vla-wam-worldmodel-reading-list-20260524/paper_directory_table.en.tight.png)

## Directory

| Figure | Paper Name | Area | Title | arxiv |
| --- | --- | --- | --- | --- |
| Fig. 1 | Pre-VLA | VLA / World Model / Runtime Verification | Pre-VLA: Preemptive Runtime Verification for Reliable Vision-Language-Action and World-Model Rollouts | [2605.22446](https://arxiv.org/abs/2605.22446) |
| Fig. 2 | SOMA | VLA / Spatial Memory / Manipulation | Spatial Memory for Out-of-Vision Manipulation in Vision-Language-Action | [2605.22283](https://arxiv.org/abs/2605.22283) |
| Fig. 3 | EvoScene-VLA | VLA / Scene Belief / Chunked Robot Control | EvoScene-VLA: Evolving Scene Beliefs Inside the Action Decoder for Chunked Robot Control | [2605.21862](https://arxiv.org/abs/2605.21862) |
| Fig. 4 | GaussianDream | World Model / 3D Gaussian / Robotic Manipulation | GaussianDream: A Feed-Forward 3D Gaussian World Model for Robotic Manipulation | [2605.20752](https://arxiv.org/abs/2605.20752) |
| Fig. 5 | VLA-REPLICA | VLA / Real-World Benchmark / Evaluation | VLA-REPLICA: A Low-Cost, Reproducible Benchmark for Real-World Evaluation of Vision-Language-Action Models | [2605.20774](https://arxiv.org/abs/2605.20774) |
| Fig. 6 | WorldArena 2.0 | Embodied World Model / Benchmark / Interactive RL | WorldArena 2.0: Extending Embodied World Model Benchmarking on Modality, Functionality and Platform | [2605.17912](https://arxiv.org/abs/2605.17912) |
| Fig. 7 | Demo-JEPA | World Model / JEPA / Cross-Embodiment Imitation | Demo-JEPA: Joint-Embedding Predictive Architecture for One-shot Cross-Embodiment Imitation | [2605.20811](https://arxiv.org/abs/2605.20811) |
| Fig. 8 | SWEET | World Model / Image Editing / Sparse Visual Planning | SWEET: Sparse World Modeling with Image Editing for Embodied Task Execution | [2605.19319](https://arxiv.org/abs/2605.19319) |
| Fig. 9 | PhyWorld | World Model / Video Generation / Physical AI | PhyWorld: Physics-Faithful World Model for Video Generation | [2605.19242](https://arxiv.org/abs/2605.19242) |
| Fig. 10 | AVP | VLA / Visual Primitives / Action Expert | Action with Visual Primitives | [2605.22183](https://arxiv.org/abs/2605.22183) |

## One-Line Read

Fig. 1, `Pre-VLA`: the useful shift is from asking whether a VLA can generate an action to asking whether the action can be checked before execution.

Fig. 2, `SOMA`: the interesting piece is persistent spatial memory, especially for manipulation targets outside the current field of view.

Fig. 3, `EvoScene-VLA`: scene belief is moved into the action decoder, which matters because chunked control changes the scene it later needs to reason about.

Fig. 4, `GaussianDream`: a clean 3D world-model plug-in direction, using 3D Gaussian structure for spatial and future-state supervision without paying heavy rollout cost at inference.

Fig. 5, `VLA-REPLICA`: low-cost real-world evaluation is important because this field has more demos than reproducible hardware benchmarks.

Fig. 6, `WorldArena 2.0`: embodied world-model evaluation is expanding beyond vision-only prediction toward modality coverage, platform diversity, and interactive RL utility.

Fig. 7, `Demo-JEPA`: imitation is reframed as predicting the future latent state a demonstration is trying to reach, which is a better fit for cross-embodiment transfer.

Fig. 8, `SWEET`: sparse keyframe prediction via image editing may be more practical than full video rollout for many manipulation settings.

Fig. 9, `PhyWorld`: if video models are going to act as Physical AI simulators, the metric has to include physics-faithful continuation, not only visual plausibility.

Fig. 10, `AVP`: the clean takeaway is to externalize VLM spatial understanding as visual primitive tokens before handing control to a flow action expert.

The standalone table export is kept here for sharing and inspection: [open the HTML table](/blog/assets/vla-wam-worldmodel-reading-list-20260524/paper_directory_table.en.html).
