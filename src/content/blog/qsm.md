---
title: 'Quantum Sensing & Metrology'
date: 2026-02-13
description: 'Notes from Sensing workflow to Quantum/Classical Correlation'
tags: ['Quantum Fundamentals', 'Sensing']
---

# Optical Sensing Principles

This section bridges the gap between classical electromagnetism and the general workflow of sensing.

### 1. The Sensing Workflow



1. **State Preparation:** Initializing the probe (e.g., a laser beam).
2. **Parameter Encoding:** The physical parameter $\theta$ interacts with the probe, modifying its state (e.g., phase shift).

   $$
   E(t, \theta) \approx E(t) + \theta \frac{\partial E(t, \theta)}{\partial \theta}
   $$

3. **Detection:** Measuring the probe.
4. **Estimation:** Using the data to estimate $\theta$ (the result $X$).

### 2. Classical Wave Optics

* **Maxwell's Equations:** Govern the propagation of electromagnetic waves.

  $$
  \nabla^2 E - \frac{1}{c^2}\frac{\partial^2 E}{\partial t^2} = 0
  $$

* **Plane Wave Solution:**

  $$
  \vec{E}(t, \vec{r}) = \vec{E}_0 e^{i(\vec{k}\cdot\vec{r} - \omega t)}
  $$

* **Intensity:** $I = |\mathcal{E}_0|^2$ (Proportional to the square of the complex amplitude).
* **Polarization:** Describes the orientation of the oscillating electric field.
    * $|H\rangle$: Horizontally polarized.
    * $|V\rangle$: Vertically polarized.

### 3. Interaction with Material (Non-Linear Optics)

When light interacts with a material, it induces a **dipole moment**.

* **Polarization Density ($\vec{P}$):**

  $$
  \vec{P} = \epsilon_0 (\chi^{(1)}\vec{E} + \chi^{(2)}\vec{E}^2 + \chi^{(3)}\vec{E}^3 + \dots)
  $$

    * $\chi^{(1)}$: Linear susceptibility (Refraction, Absorption).
    * $\chi^{(2)}$: Second-order non-linearity. Responsible for **Second Harmonic Generation (SHG)**, where two photons of frequency $\omega$ combine to form one photon of $2\omega$.

---

# Photodetection and Noise

Detecting light involves converting photons into electron-hole pairs. This process is inherently statistical.



### 1. Key Detector Metrics

* **Responsivity ($R$):** Output electrical current per unit optical power ($A/W$).

  $$
  R = \frac{e \lambda \eta}{hc}
  $$

    * $\eta$: Quantum Efficiency (fraction of photons converted to electrons).
    * $\lambda$: Wavelength.
* **Sensitivity:** The smallest change in the parameter $\theta$ that can be detected.
* **SNR (Signal-to-Noise Ratio):**

  $$
  SNR = \frac{\text{Signal Power}}{\text{Noise Power}}
  $$

### 2. Noise Mechanisms

* **Shot Noise:** Arises from the discrete nature of photons (Poissonian statistics) and charge carriers.

  $$
  i_{shot} = \sqrt{2 e I_{avg} \Delta f}
  $$

    * $e$: Electron charge ($1.6 \times 10^{-19}$ C)
    * $\Delta f$: Bandwidth
* **Thermal (Johnson) Noise:** Caused by thermal agitation of electrons in a resistor.

  $$
  V_{thermal} = \sqrt{4 k_B T R \Delta f}
  $$

    * $k_B$: Boltzmann constant.
    * $T$: Temperature (Kelvin).
* **Flicker Noise ($1/f$):** Dominates at low frequencies, often due to material defects.

### 3. Calculation Example (from notes)

**Scenario:** A Silicon Avalanche Photodiode (APD) with Gain $M=100$.

* **Given:**
    * Responsivity $R = 0.6$ A/W (at 850 nm)
    * Incident Power $P = 5 \mu W$
    * Bandwidth $\Delta f = 1$ MHz

* **Primary Photocurrent:**

  $$
  I_{primary} = P \times R = 5 \mu W \times 0.6 A/W = 3 \mu A
  $$

* **Amplified Current (Gain $M=100$):**

  $$
  I_{gain} = 3 \mu A \times 100 = 300 \mu A
  $$

* **Shot Noise Calculation (using amplified current):**

  $$
  i_{shot} = \sqrt{2 \cdot (1.6 \times 10^{-19}) \cdot (300 \times 10^{-6}) \cdot (10^6)}
  $$

  $$
  i_{shot} \approx 9.8 \times 10^{-9} A = 9.8 nA
  $$

### 4. Important Detectors

* **PIN Photodiode:** Standard detector, no internal gain.
* **APD (Avalanche Photodiode):** Uses high reverse bias to create gain (impact ionization). Good for low light but adds excess noise.
* **SPAD (Single Photon Avalanche Diode):** Operated above breakdown voltage (Geiger mode) to detect single photons.
* **SNSPD (Superconducting Nanowire Single Photon Detector):** Extremely sensitive, operates at cryogenic temps (0.5K - 4K), very low noise (dark counts).

---

# Estimation Theory & Limits

This section deals with "how well" we can measure something, bounded by statistics.

### 1. Statistics of Detection

* **Poisson Distribution:** Describes photon counting (random arrival of photons).

  $$
  P(n|\lambda) = \frac{e^{-\lambda}\lambda^n}{n!}
  $$

    * Variance = Mean ($\sigma^2 = \mu$).

### 2. Fisher Information ($I(\theta)$)

Fisher Information quantifies how much "information" a random variable $X$ carries about an unknown parameter $\theta$.



* It measures the **sensitivity** of the probability distribution $p(x|\theta)$ to changes in $\theta$.

  $$
  I(\theta) = E \left[ \left( \frac{\partial \ln p(x|\theta)}{\partial \theta} \right)^2 \right] = -E \left[ \frac{\partial^2 \ln p(x|\theta)}{\partial \theta^2} \right]
  $$

* **Interpretation:** High Fisher Information $\rightarrow$ Sharp peak in distribution $\rightarrow$ High sensitivity (Lower uncertainty).

### 3. Cramer-Rao Bound (CRB)

The fundamental limit on the precision of any measurement. The variance of an unbiased estimator $\hat{\theta}$ is bounded by the inverse of the Fisher Information.

$$
\text{Var}(\hat{\theta}) \geq \frac{1}{I(\theta)}
$$

* This implies that **Noise** (Variance) and **Information** are inversely related.

### 4. Shannon Entropy

A measure of randomness or uncertainty in a variable $X$.

$$
H(X) = - \sum p(x) \log_2 p(x)
$$

* For a Gaussian distribution with variance $\sigma^2$:

  $$
  H(x) = \frac{1}{2} \log(2\pi e \sigma^2)
  $$

* **Connection:** Fisher information for a Gaussian parameter $\mu$ is $1/\sigma^2$.

---

# Quantum Fundamentals & Operators

This section expands on the mathematical framework, including operators, measurement, and gates.



### 1. Operators and Observables

Physical quantities (energy, momentum, spin) are represented by **Operators** acting on the Hilbert space.

* **Hermitian Operator ($\hat{A}$):** An operator that is equal to its conjugate transpose ($\hat{A} = \hat{A}^\dagger$).
    * These represent **Observables** because their eigenvalues are always real.
    * $\hat{A}|\lambda_n\rangle = \lambda_n |\lambda_n\rangle$ (Eigenvalue equation).
* **Mean / Expectation Value:**

  $$
  \langle \hat{A} \rangle = \langle \psi | \hat{A} | \psi \rangle = \sum \lambda_n |a_n|^2
  $$

* **Standard Deviation (Uncertainty):**

  $$
  \Delta A = \sqrt{\langle \hat{A}^2 \rangle - \langle \hat{A} \rangle^2}
  $$

* **Commutators:** Two operators commute if $[\hat{A}, \hat{B}] = \hat{A}\hat{B} - \hat{B}\hat{A} = 0$. If they do not commute (e.g., Position and Momentum, or Pauli matrices), they cannot be simultaneously measured with arbitrary precision.

### 2. Pauli Matrices & Gates

The fundamental operators for qubits (Spin-1/2 systems).

* **Pauli-X ($\sigma_x$):** Bit flip. Exchanges $|0\rangle \leftrightarrow |1\rangle$.

  $$
  \sigma_x = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}
  $$

* **Pauli-Y ($\sigma_y$):**

  $$
  \sigma_y = \begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}
  $$

* **Pauli-Z ($\sigma_z$):** Phase flip.

  $$
  \sigma_z = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}
  $$

* **Hadamard Gate ($\hat{H}$):** Creates superposition.

  $$
  \hat{H} = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}
  $$

  $$
  \hat{H}|0\rangle = |+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}, \quad \hat{H}|1\rangle = |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}
  $$

### 3. Measurement Theory

* **Projective Measurement:**
    * Defined by Projection Operators $\hat{\Pi}_n = |\lambda_n\rangle\langle\lambda_n|$.
    * **Born Rule:** Probability of outcome $\lambda_n$ is $P(\lambda_n) = |\langle \lambda_n | \psi \rangle|^2 = \langle \psi | \hat{\Pi}_n | \psi \rangle$.
    * **Post-Measurement State:** $|\psi'\rangle = \frac{\hat{\Pi}_n |\psi\rangle}{\sqrt{P(\lambda_n)}}$ (Normalized).
* **POVM (Positive Operator-Valued Measure):**
    * A more general measurement formalism.
    * Set of operators $\{\hat{M}_n\}$ such that $\sum \hat{M}_n = \hat{I}$ and $\hat{M}_n \ge 0$.
    * Probability $P(n) = \text{Tr}(\hat{M}_n \rho)$.

---

# Density Matrix & Multiple Systems

### 1. The Density Matrix ($\rho$)

Used to describe both pure and mixed states.

* **Pure State:** $\rho = |\psi\rangle\langle\psi|$. Purity $\text{Tr}(\rho^2) = 1$.
* **Mixed State:** $\rho = \sum p_i |\psi_i\rangle\langle\psi_i|$. Purity $\text{Tr}(\rho^2) < 1$.
* **Properties:**
    1. Hermitian ($\rho = \rho^\dagger$).
    2. Positive Semi-definite (Eigenvalues $\ge 0$).
    3. Trace $\text{Tr}(\rho) = 1$ (Sum of probabilities).
* **Von Neumann Entropy:** A measure of uncertainty or entanglement.

  $$
  S(\rho) = -\text{Tr}(\rho \log \rho)
  $$

    * For a pure state, $S(\rho) = 0$.
    * For a maximally mixed state of dimension $d$, $S(\rho) = \log d$.

### 2. Multiple Quantum Systems

* **Tensor Product ($\otimes$):** The joint state space of system A and B is $H_A \otimes H_B$.
    * If $|\psi\rangle_A = \begin{bmatrix} a_1 \\ a_2 \end{bmatrix}$ and $|\phi\rangle_B = \begin{bmatrix} b_1 \\ b_2 \end{bmatrix}$, then:

      $$
      |\psi\rangle_A \otimes |\phi\rangle_B = \begin{bmatrix} a_1 b_1 \\ a_1 b_2 \\ a_2 b_1 \\ a_2 b_2 \end{bmatrix}
      $$

* **Partial Trace:** Used to obtain the state of a subsystem (Reduced Density Matrix) by averaging out the other system.

  $$
  \rho_A = \text{Tr}_B(\rho_{AB}) = \sum_i \langle i|_B \rho_{AB} |i\rangle_B
  $$

### 3. Entanglement



A state is entangled if it cannot be written as a product of individual states ($|\psi\rangle \neq |\phi\rangle_A \otimes |\chi\rangle_B$).

* **Bell States (Maximally Entangled):**

  $$
  |\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}
  $$

    * Strong non-classical correlations.
* **GHZ State (3 qubits):** $|\text{GHZ}\rangle = \frac{|000\rangle + |111\rangle}{\sqrt{2}}$.

---

# Measures of Correlation

This section quantifies how coupled two systems are, distinguishing between classical and quantum correlations.

### 1. Mutual Information ($I(A:B)$)

Quantifies the total correlation (classical + quantum) between subsystem A and B.



$$
I(A:B) = S(\rho_A) + S(\rho_B) - S(\rho_{AB})
$$

* **Example: Bell State $|\Phi^+\rangle$**
    * The joint state is pure, so $S(\rho_{AB}) = 0$.
    * The reduced states $\rho_A$ and $\rho_B$ are maximally mixed ($I/2$), so $S(\rho_A) = 1$ and $S(\rho_B) = 1$ (in bit base 2).
    * **Result:** $I(A:B) = 1 + 1 - 0 = 2$. (This is double the correlation max possible for classical bits).

* **Example: Fully Mixed Correlated State**
    * Classical mixture: $\rho = \frac{1}{2}(|00\rangle\langle00| + |11\rangle\langle11|)$.
    * $S(\rho_{AB}) = 1$ (1 bit of randomness in the choice of 00 vs 11).
    * $S(\rho_A) = 1, S(\rho_B) = 1$.
    * **Result:** $I(A:B) = 1 + 1 - 1 = 1$.

### 2. Quantum Discord

Separates correlations into "Classical" and "Quantum" parts.

* **Classical Correlation $C(A,B)$:** The maximum information we can gain about B by measuring A.

  $$
  C(A,B) = \max_{\{\Pi_i^A\}} [ S(\rho_B) - \sum p_i S(\rho_{B|i}) ]
  $$

* **Quantum Discord $D(A,B)$:** The remaining non-classical correlation.

  $$
  D(A,B) = I(A,B) - C(A,B)
  $$

    * For pure entangled states, all correlation is quantum (Discord = Mutual Information).
    * For purely classical states, Discord is zero.
