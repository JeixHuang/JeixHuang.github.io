---
title: "Late-May VLA / WAM / World Model Reading List Vol. 1"
date: 2026-05-24T09:00:00+08:00
slug: "late-may-vla-wam-world-model-reading-list-vol-1"
tags: ["vla", "wam", "world-model", "embodied-ai", "paper-reading"]
summary: "A compact reading directory for ten late-May papers around VLA, WAM, and embodied world models."
---

This is a compact reading directory for ten papers I would prioritize from the late-May VLA / WAM / World Model batch. The common thread is clear: the next step is less about making the action head larger, and more about adding memory, scene state, world rollout, and runtime verification around the policy.

## Reading List

1. **Pre-VLA** ([2605.22446](https://arxiv.org/abs/2605.22446))  
   *VLA / World Model / Runtime Verification*  
   *Pre-VLA: Preemptive Runtime Verification for Reliable Vision-Language-Action and World-Model Rollouts*  
   The useful shift is from asking whether a VLA can generate an action to asking whether the action can be checked before execution.

2. **SOMA** ([2605.22283](https://arxiv.org/abs/2605.22283))  
   *VLA / Spatial Memory / Manipulation*  
   *Spatial Memory for Out-of-Vision Manipulation in Vision-Language-Action*  
   The interesting piece is persistent spatial memory, especially for manipulation targets outside the current field of view.

3. **EvoScene-VLA** ([2605.21862](https://arxiv.org/abs/2605.21862))  
   *VLA / Scene Belief / Chunked Robot Control*  
   *EvoScene-VLA: Evolving Scene Beliefs Inside the Action Decoder for Chunked Robot Control*  
   Scene belief is moved into the action decoder, which matters because chunked control changes the scene it later needs to reason about.

4. **GaussianDream** ([2605.20752](https://arxiv.org/abs/2605.20752))  
   *World Model / 3D Gaussian / Robotic Manipulation*  
   *GaussianDream: A Feed-Forward 3D Gaussian World Model for Robotic Manipulation*  
   A clean 3D world-model plug-in direction, using 3D Gaussian structure for spatial and future-state supervision without paying heavy rollout cost at inference.

5. **VLA-REPLICA** ([2605.20774](https://arxiv.org/abs/2605.20774))  
   *VLA / Real-World Benchmark / Evaluation*  
   *VLA-REPLICA: A Low-Cost, Reproducible Benchmark for Real-World Evaluation of Vision-Language-Action Models*  
   Low-cost real-world evaluation is important because this field has more demos than reproducible hardware benchmarks.

6. **WorldArena 2.0** ([2605.17912](https://arxiv.org/abs/2605.17912))  
   *Embodied World Model / Benchmark / Interactive RL*  
   *WorldArena 2.0: Extending Embodied World Model Benchmarking on Modality, Functionality and Platform*  
   Embodied world-model evaluation is expanding beyond vision-only prediction toward modality coverage, platform diversity, and interactive RL utility.

7. **Demo-JEPA** ([2605.20811](https://arxiv.org/abs/2605.20811))  
   *World Model / JEPA / Cross-Embodiment Imitation*  
   *Demo-JEPA: Joint-Embedding Predictive Architecture for One-shot Cross-Embodiment Imitation*  
   Imitation is reframed as predicting the future latent state a demonstration is trying to reach, which is a better fit for cross-embodiment transfer.

8. **SWEET** ([2605.19319](https://arxiv.org/abs/2605.19319))  
   *World Model / Image Editing / Sparse Visual Planning*  
   *SWEET: Sparse World Modeling with Image Editing for Embodied Task Execution*  
   Sparse keyframe prediction via image editing may be more practical than full video rollout for many manipulation settings.

9. **PhyWorld** ([2605.19242](https://arxiv.org/abs/2605.19242))  
   *World Model / Video Generation / Physical AI*  
   *PhyWorld: Physics-Faithful World Model for Video Generation*  
   If video models are going to act as Physical AI simulators, the metric has to include physics-faithful continuation, not only visual plausibility.

10. **AVP** ([2605.22183](https://arxiv.org/abs/2605.22183))  
    *VLA / Visual Primitives / Action Expert*  
    *Action with Visual Primitives*  
    The clean takeaway is to externalize VLM spatial understanding as visual primitive tokens before handing control to a flow action expert.
