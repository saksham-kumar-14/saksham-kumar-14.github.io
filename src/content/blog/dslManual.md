---
title: 'Task Scheduler Manager DSL'
date: 2026-04-10
description: 'DSL User Manual'
tags: ['Domain Specific Language', 'Task Scheduling', 'Ocaml']
---

## Overview

This DSL is designed to simulate and evaluate task scheduling algorithms on multi-core systems. It allows you to configure hardware constraints, define tasks with complex dependencies, write custom routing logic, and generate performance reports across various scheduling heuristics.

<a href="https://github.com/saksham-kumar-14/task-scheduler-dsl"> Github </a>

## Getting Started

### 1. Define System Configuration

<pre>
set_cores(4);
set_memory(256.0);
</pre>

- `set_cores(n)` : Sets the number of processing cores available. Must be an integer ≥ 1.
- `set_memory(n)` : Sets the total system memory. Must be a non-negative float.

### 2. Define Tasks

- A task contains the following properties:
  - `name (string)`
  - `duration (float)`
  - `arrival (float)`
  - `memory (float)`
  - `preemptive (boolean)`
  - `dependencies (list of tasks)`
  - `priority (float)`

- *Method A (Constructor)*
  - <pre>
    task identifier("Name", duration, arrival, memory, preemptive, [dependencies], priority);
    </pre>

for example:
<pre>
task myTask("My Task Name", 15.0, 0.0, 32.0, false, [], 50.0);
</pre>

- *Method B (Field Assignment)*
<pre>
task identifier;
identifier.name = "My Task Name";
identifier.duration = 15.0;
identifier.arrival = 0.0;
identifier.memory = 32.0;
identifier.preemptive = true;
identifier.dependencies = [myTask2, myTask3];
identifier.priority = 67.0;
</pre>

### 3. Variables & If/Else Statements
- Variables are dynamically typed and can hold Integers, Floats, Booleans, Strings, Tasks, or Lists.
- Lists and Task Lists can be accessed using zero-based integer indexing (e.g., `ml_pipeline[0]`). Floating-point indices are strictly prohibited.
- Standard arithmetic (`+`, `-`, `*`, `/`) and logical (`&&`, `||`, `!`, `==`, `<`, `>`, etc.) operators are fully supported.

*If/Else Statements*
<pre>
if(myTask.memory >= 100.0){
    print("High Memory Task");
}else if(myTask.memory >= 50.0){
    print("Medium Memory Task");
}else{
    print("Low Memory Task");
}
</pre>
_*Note: You can chain as many `else if` statements as needed._

### 4. Loops
The DSL offers two specific loop structures:

1. *Range Loop:* Iterates over numbers `loop index(start, stop, step)`.
<pre>
loop i(3, 0, -1) {
    print(i); // Prints 3, 2, 1
}
</pre>

2. *Enumeration Loop:* Iterates over a _list_ or a task's dependencies.
<pre>
loop tasks as t {
    print(t.name);
}
</pre>

### 5. Functions
Used for general-purpose calculations. Functions can return any data type.

<pre>
def calculate_priority(base_prio, mem_req){
    if(mem_req >= 100.0){
        return base_prio - 10.0;
    }
    return base_prio;
}
</pre>

### 6. Custom Heuristics 

A specialized function used strictly by the scheduler to resolve ties or dictate priority. A heuristic *must* accept exactly two tasks as arguments and *must* return a **boolean** (`true` if the first task should be prioritized over the second, `false` otherwise).

<pre>
heuristic smart_balance(t1, t2) {
    if (t1.memory != t2.memory) {
        return t1.memory < t2.memory;
    } else {
        return t1.priority > t2.priority || t1.duration < t2.duration;
    }
}
</pre>

### 7. Simulation & Report

Once your tasks are defined, you can run them through custom or built-in heuristics.

*Built-in Heuristics:*
- `FCFS`: First Come First Serve
- `SJF`: Shortest Job First
- `ROUND_ROBIN(quantum)`: Classic Round Robin time-sliced execution
- `MAX_PRIORITY` / `MIN_PRIORITY`: Priority-based execution

*Generating a Full Report*
- The `report()` command runs the simulation and outputs a comprehensive schedule trace alongside all calculated metrics.

<pre>
report(ml_pipeline, [FCFS, ROUND_ROBIN(10.0), smart_balance]);
</pre>

*Generating Specific Metrics*
If you only want specific performance numbers instead of the full timeline, you can query individual metrics. You can get the following specific metrics:

<pre>
makespan(tasks, [FCFS, SJF]);
</pre>

<pre>
average_waiting(tasks, [ROUND_ROBIN(10.0), MAX_PRIORITY]);
</pre>

<pre>
average_flow(tasks, [FCFS, smart_balance]);
</pre>

<pre>
utilization(tasks, [FCFS, SJF]);
</pre>

<pre>
throughput(tasks, [FCFS, ROUND_ROBIN(10.0)]);
</pre>
