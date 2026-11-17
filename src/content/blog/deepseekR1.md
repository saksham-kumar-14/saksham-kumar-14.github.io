---
title: 'How Deepseek R1 works.'
date: 2026-11-15
description: 'Details on Deepseek R1 working under the hood'
tags: ['Deepseek', 'GRPO', 'Chain of thought']
---

*[Original paper link](https://arxiv.org/pdf/2501.12948)*

## Introduction
LLMs scaled to a sufficient size can exhibit reasoning abilities. However, achieving these capabilites in training demands a lot of computation. Another results we have is that LLMs can be effectively augmented using **Chain of thought (COT)**, this involves carefully designed few shot prompts or prompts such as *"think step by step"*, enables models to product intermediate reasoning steps, there by solving complex tasks. But ....... Despited their effectiveness, these techniques have their limitations which is dependence on human. Furthermore, by constraining LLMs to replicate human thought process, we are constraining them by human-provided exemplars, thereby preventing them from exploration of non-human *superior* reasoning pathways. 

To tackle this, Deepseek uses **GRPO**

## Reinforcement Learning for LLMs: REINFORCE

### Setup

In simple reinforcement learning, our setup looks something like:

```
        ┌──────────────────┐
   ┌───>│   Agent (LLM)    │──────┐     State (S_t)  {input so far}
   │    └──────────────────┘      │     Action (A_t) {next token}
Reward (r_t)                      │
   │    ┌──────────────────┐      │
   └────│   Env (tokens)   │<─────┘
        └──────────────────┘
```

**Policy:** $\pi_\theta(a_t \mid s_t)$ → {probability of next token}

So, in this setup, our LLM learns from the reward function and performs accordingly so that reward is maximized.

### Objective

$$\max_{\theta} J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[R(\tau)\right]$$

- $J(\theta)$ → objective function
- $\tau$ → trajectory
- $\pi_\theta$ → policy
- $R(\tau)$ → cumulative rewards

**Policy is used to produce a probability distructions over all actions/tokens

### Deriving the Policy Gradient

$$J(\theta) = \mathbb{E}[R(\tau)]$$

$$\nabla_\theta J(\theta) = \nabla_\theta \, \mathbb{E}[R(\tau)]$$

$$\nabla_\theta J(\theta) = \nabla_\theta \int \pi_\theta \cdot R(\tau) \, d\tau$$

$$\Rightarrow \nabla_\theta J(\theta) = \int \nabla_\theta \pi_\theta \, R(\tau) \, d\tau$$

Using the log-derivative trick:

$$\nabla_\theta \log \pi_\theta = \frac{\nabla_\theta \pi_\theta}{\pi_\theta} \;\Rightarrow\; \nabla_\theta \pi_\theta = \pi_\theta \, \nabla_\theta \log \pi_\theta$$

$$\Rightarrow \nabla_\theta J(\theta) = \int \pi_\theta \, \nabla_\theta \log \pi_\theta \, R(\tau) \, d\tau$$

$$\Rightarrow \nabla_\theta J(\theta) = \mathbb{E}\left[(\nabla_\theta \log \pi_\theta) \, R(\tau)\right]$$

Here $\nabla_\theta J(\theta)$ is the **gradient**.

Update the parameter as:

$$\theta \leftarrow \theta + \alpha \cdot \nabla_\theta J(\theta)$$

This is the standard **REINFORCE algorithm**.

### General Case vs. LLMs

In general case it is:

$$\mathbb{E}_{\tau \sim \pi_\theta}[\cdot]$$

(where $\pi_\theta$ is the policy and $\tau$ is the trajectory)

In case of LLMs, it converts as:

$$\mathbb{E}_{x \sim D}\left[\mathbb{E}_{y \sim \pi_\theta(\cdot \mid x)}[\cdot]\right]$$

- $x$ → prompt
- $D$ → set of prompts
- $y$ → response
- $\pi_\theta(\cdot \mid x)$ → response distribution given by LLM

### Vanilla Monte-Carlo REINFORCE Algorithm

1. Given a prompt, sample a response $y \sim \pi_\theta(\cdot \mid x)$ ← **Expensive step**
2. Evaluate completed response: $R = R(x, y)$
3. Compute log probability gradient: $g = R \, \nabla_\theta \log \pi_\theta(y \mid x)$
4. Update parameter as: $\theta \leftarrow \theta + \alpha \cdot g$

### Challenges with this approach

1. Gradients are noisy.
2. No explicit token-level credit. A correct answer doesn't mean that all tokens were equally good.
3. No constraints on policy updation. The final answer can deviate a lot!


## Proximal Policy Optimization (PPO)

*[Original paper link](https://arxiv.org/pdf/1707.06347)*

GRPO is the RL framework for Deepseek. It was originally proposed to simplify the training process and reduce the resource consumption of **PPO**

### The proposed solution

The proposed solution for the challenges mentioned above is **PPO**.

$$\text{PPO}: \; J(\theta) = \underbrace{\text{Maximize advantages}}_{} \;+\; \underbrace{\text{Don't deviate too much from before}}_{\text{Proximal part}}$$

For a probability distribution given by the policy, we don't have a target distribution to compare it. PPO finds a so-called "scaling factor" for these distributions denoted by $A_t$.

$$a_t \sim \pi_\theta(s_t) \quad \{\text{sample action from probability}\}$$

$$P(a_t) = \pi_\theta(a_t \mid s_t)$$

We want to scale up this probability by $A_t$.

Update: $\nabla_\theta \, \pi_\theta(a_t \mid s_t) \cdot A_t$

$$\text{Loss} = \pi_\theta(a_t \mid s_t) \cdot A_t$$

$$\text{Total loss} = \sum_{t=0}^{T} \pi_\theta(a_t \mid s_t) \cdot A_t$$

Mathematically convenient to add a `log`:

$$\text{Total loss} = \sum_{t=0}^{T} \log \pi_\theta(a_t \mid s_t) \cdot A_t$$

### Advantage $A_t$ and the Value function

PPO defines $A_t$ as **"How much better than the average was the action we took?"**

→ To answer this, we introduce a **Value function $V_\phi$**.
$V_\phi$ is another model used by the agent, separate from the LLM, with its own weights $\phi$.

```
Agent:  (S_0) --A_0,a_0--> (S_1) --A_1,a_1--> ... --A_{T-1},a_{T-1}--> (S_{T-1}) --A_T,a_T--> (S_T)      Env
         V_φ(S_0)          V_φ(S_1)                                      V_φ(S_{T-1})            V_φ(S_T)
```

$V_\phi$ → tells how good the response so far is regardless of what we predict next.

$$V(S_t) = \mathbb{E}_{\tau \sim \pi}\left[r_t + r_{t+1} + \dots + r_T \mid S_t\right] \quad \{\text{Expectation of future rewards}\}$$

Computing this is impossible as it would result in a ridiculously large tree. So, instead of calculating, our model uses agent $V_\phi$ to estimate it.

We can also add a discount factor:

$$V(S_t) = \mathbb{E}_{\tau \sim \pi}\left[r_t + \gamma r_{t+1} + \dots + \gamma^{T-t} r_T \mid S_t\right], \qquad \gamma \in [0, 1]$$

$$V(S_t) = \mathbb{E}_{\tau \sim \pi}\left[G_t \mid S_t\right] \quad (G_t = \text{total discounted return})$$

### Training the Value function

To train our model $V_\phi$ to converge to the ideal value $G_t$, we use gradient descent:

$$L_t^{VF} = \left(V_\phi(S_t) - G_t\right)^2 \quad \text{(the loss function)}$$

Now, to compute the quality of action that we took, let's denote the quality of action $= Q(s_t, a_t)$.

$$A_t = Q(s_t, a_t) - V(S_t)$$

$$Q(s_t, a_t) = r_t + \gamma r_{t+1} + \dots + \gamma^{T-t} r_T$$

Defining $Q$ this way is the **Monte-Carlo approach**.

This has downsides →
1. We need to wait for the complete action to unfold.
2. This value will be trivial when we don't have intermediate rewards.

Instead we can do,

$$Q(s_t, a_t) = r_t + \gamma\left[r_{t+1} + \gamma r_{t+2} + \dots + \gamma^{T-2} r_T\right]$$

$$\hat{Q}(s_t, a_t) = r_t + \gamma V_\phi(s_{t+1}) \quad \leftarrow \text{this is bootstrapping}$$

So,

$$\hat{A}_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)$$

### In practice

In practice, things are let's say different!

In theory, we define expectation over a very large sample size. But in practice, our sample size is not that large. Also sometimes we deal with noisy environments, rewards also comes from humans so we can't expect them to be correct. This problem is **Variance** → can be fixed by giving less importance to rewards but that leads to a very conservative model that can't discover the optimal solution. This over correction is called **bias**. And all this is called the **Bias-Variance tradeoff**.

$$Q(s_t, a_t) = r_t + \gamma r_{t+1} + \dots + \gamma^{T-1} r_T \quad \text{(high variance, low bias)}$$

$$\hat{Q}(s_t, a_t) = r_t + \gamma V_\phi(s_{t+1}) \quad \text{(low variance, high bias)}$$

Between these two ends of spectra, we can have:

$$\hat{Q}_2(s_t, a_t) = r_t + \gamma r_{t+1} + \gamma^2 V_\phi(s_{t+2})$$

$$\hat{Q}_3(s_t, a_t) = r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \gamma^3 V_\phi(s_{t+3})$$

$$\vdots$$

The corresponding advantage estimates will be:

$$\hat{A}_1 = r_t + \gamma V_\phi(s_{t+1}) - V(s_t) = \delta_t$$

$$\hat{A}_2 = r_t + \gamma r_{t+1} + \gamma^2 V_\phi(s_{t+2}) - V(s_t) = \delta_{t+1}$$

$$\vdots$$

$$\hat{A}_T = r_t + \gamma r_{t+1} + \dots + \gamma^{T-1} r_T - V(s_T)$$

### Generalized Advantage Estimation (GAE)

$\hat{A}_t$ = exponentially weighted average ($\hat{A}_1 \dots \hat{A}_T$) with weight $\lambda$.

$$\hat{A}_t = \sum_{k=0}^{T-t} (\gamma\lambda)^k \, \delta_{t+k} \quad \text{(General advantage estimation)}$$

### Summarising

Initialize policy $\theta_0$ and value function $\phi_0$

for $n = 0, 1, 2, \dots$
- collect set of trajectories $\{\tau_i\}$ by executing policy $\pi_{\theta_n}$ within the environment
  - compute discounted returns ($G_t$)
  - compute $A_t$ based on $V_{\phi_n}$
  - update the policy based on $\nabla_\theta L^{PG}$
  - update value function based on $\nabla_\phi L^{VF}$

### Importance Sampling

In supervised learning, it's std. to have multiple epochs. PPO revisits the sets of trajectories multiple times. But this creates a problem: sampling the response is using policy parameters from $n$th model update ($\pi_{\theta_n}$) but we are computing loss using new parameters $\theta_{n+\text{epoch}}$. This can break the training process as we are backpropagating the wrong gradient.

There's a maths trick called **Importance Sampling**. It allows us to estimate expectations under one distribution $p(x)$ from another distribution $q(x)$.

$$\mathbb{E}_{x \sim p}[g(x)] = \mathbb{E}_{x \sim q}\left[g(x) \cdot \underbrace{\frac{p(x)}{q(x)}}_{\text{Surrogate loss}}\right]$$

- $\theta_{old}$: Sampled trajectories from $\pi_{old}$
- $\theta_{new}$: Computed loss using $\pi_{\theta_{new}}$

$$L^{PG} = \sum_t \left[\frac{\pi_{\theta_{new}}(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)} \, A_t\right] = \sum_t \left[r(\theta) \cdot A_t\right]$$

### Finally: Clipping in PPO

$\dfrac{\pi_{\theta_{new}}(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)}$ reflects how much the model changes between two updates.

PPO clips this between $1-\epsilon$ and $1+\epsilon$, where $\epsilon \leftarrow$ hyperparameter.

$$L^{CLIP} = \sum_t \left[\min\left(r_t(\theta), \; \text{clip}\left(1-\epsilon, \; r_t(\theta), \; 1+\epsilon\right)\right)\right] \cdot A_t$$

We can also penalise the difference in policy distribution by substrating the KL divergence between both the policies 

$$\mathcal{L}_{\text{PPO}}(\theta) = \mathbb{E}_{s,a \sim \pi_\theta}\left[\min\left(r_t(\theta)\hat{A}_t, \; \text{clip}\left(r_t(\theta), 1-\epsilon, 1+\epsilon\right)\hat{A}_t\right)\right] - \beta D_{\text{KL}}\left(\pi_{\text{ref}} \,\|\, \pi_\theta\right)$$

$$\text{KL}(P \,\|\, Q) = \int \log\left(\frac{p(x)}{q(x)}\right) p(x) \, dx = \mathbb{E}_{x \sim p}\left[\log\left(\frac{p(x)}{q(x)}\right)\right]$$

I found [this](https://www.youtube.com/watch?v=8jtAzxUwDj0) very helpful video for understanding PPO

## Group Relative Policy Optimization (GRPO)

GRPO *eliminates* the need of having a value function!
