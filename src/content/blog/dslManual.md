---
title: 'Task Scheuler Manager DSL'
date: 2026-04-10
description: 'About emulation programmming and emulators in general'
tags: ['Domain Specific Language', 'Task Scheduling', 'Ocaml']
---

## Overview

This DSL is designed to simulate and evaluate task scheduling algorithms on multi-core systems. It allows you to configure hardware constraints, define tasks with complex dependencies, write custom routing logic, and generate performance reports across various scheduling heuristics

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
  - `arrival (float)`
  - `memory (float)`
  - `preemptive (float)`
  - `dependencies (lists of tasks)`
  - `priority (float)`

- *Method A*
  - <pre>
    task identifier("Name", duration, arrival, memory, preemptive, [dependencies], priority);
    </pre>

for example:
<pre>
task myTask("My Task Name", 15.0, 0.0, 32.0, false, [], 50.0);
</pre>

- *Method B*
<pre>
task identifier;
identifier.name = "My Task Name";
identifier.duration = 15.0;
identifer.arrival = 0.0;
identifer.memory = 32.0;
identifer.preemptive = true;
identifer.dependencies = [myTask2, myTask3];
identifer.priority = 67.0;
</pre>

### 3. If/Else Statements
- Variables are dynamically typed and can hold Integers, Floats, Booleans, Strings, Tasks, or Lists
- Standard arithmetic (+, -, *, /) and logical (&&, ||, !, ==, <, >, etc.) operators are fully supported

*If/Else Statements*
<pre>
if(myTask.memory >= 100.0){
    print("High Memory Task");
}else if(myTask.memory >= 50.0){
    print("Medium Memory Taks");
}else{
    print("Low Memory Task");
}
</pre>
_*Note that you cannot use multiple else-if, only a single else-if is allowed <a href="https://github.com/saksham-kumar-14/task-scheduler-dsl/issues/7">[Issue]</a>_

### 4. Loops
The DSL offers two specific loop structure:

1. *Range Loop:* Iterates over numbers `loop index(start, stop, step)`.
<pre>
loop i(3, 0, -1) {
    print(i); // Prints 3, 2, 1
}
</pre>

2. *Enumeration Loop:* Iterates over a _list_
<pre>
loop tasks as t {
    print(t.name);
}
</pre>

### 5. Functions
Used for general-purpose calculations. Functions can return any data type.

<pre>
def myFunc(priorityA, priorityB){
    if(priorityA > priorityB){
        return 1;
    }
    return 0;
}
</pre>

### 6. Custom Heuristics 

A specialized function used strictly by the scheduler to resolve ties or dictate priority. A heuristic *must* accept exactly two tasks as arguments and *must* return the task that should be prioritized

<pre>
heuristic myHeuristic(t1, t2){
    if((t1.memory + t2.memory) / 2 >= 100){
        return t1;
    }
    return t2;
}
</pre>

### 7. Simulation & Report

Once your tasks are defined, you can run them through custom or built-in heuristics.

*Built-in Heuristics:*
- `FCFS`: First Come First Serve
- `SJF`: Shortest Job First
- `ROUND_ROBIN(quantum)`: Classic Round Robin time sliced execution
- `MAX_PRIORITY`/`MIN_PRIORITY`: Priority based execution

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
utilization(tasks, [FCFS, myHeuristic]);
</pre>

<pre>
throughput(tasks, [FCFS, SJF]);
</pre>
