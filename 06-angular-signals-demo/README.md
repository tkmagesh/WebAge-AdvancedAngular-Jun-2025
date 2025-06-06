
##  What Are Signals in Angular?

**Signals** are Angular’s new reactivity primitive introduced to manage reactive state in a fine-grained and efficient way. They allow you to **store reactive values** and **automatically update** the UI or any dependent logic when these values change.

Unlike Angular’s classic **zone.js**-based change detection that refreshes the entire view tree, signals enable **fine-grained change detection** by only updating components or computations that depend on the changed signal.

---

##  How Do Signals Work Internally?

Here’s a simplified breakdown of the internals:

1. **Signal Creation**:

   * When you create a signal using `signal(initialValue)`, Angular:

     * Creates a **signal node** in its reactivity graph.
     * Stores the current value.
     * Maintains a **dependency list**—observers that depend on this signal (e.g., computed signals, components, templates).

2. **Reading a Signal**:

   * When you access a signal’s value via `mySignal()`, Angular:

     * Registers the **read** operation with a current **tracking context** (e.g., a component or a computed signal).
     * Records this dependency to update the context when the signal changes.

3. **Updating a Signal**:

   * When you call `mySignal.set(newValue)` or `mySignal.update(fn)`, Angular:

     * Updates the stored value.
     * Notifies all dependents (observers) that the value has changed.
     * Triggers re-execution of dependent computations or view updates.

4. **Dependency Tracking**:

   * Signals rely on **dynamic dependency tracking**, meaning:

     * When a computation reads from a signal, that computation is **registered as a dependent**.
     * On signal update, Angular **invalidates** the computation and schedules it for re-execution.

5. **Change Propagation**:

   * Angular uses a **push-based model**—only computations depending on a changed signal are updated.
   * This means fewer unnecessary updates compared to zone.js, leading to better performance.

---

##  Angular Signal APIs & Usage

Here’s a list of the key signal APIs in Angular (as of v17+) and their usage:

---

### 1. **signal()**

**Purpose**: Creates a writable signal.

```typescript
import { signal } from '@angular/core';

const counter = signal(0);

// Usage
console.log(counter());       // Read value
counter.set(5);               // Set value
counter.update(v => v + 1);   // Update value
```

---

### 2️. **computed()**

**Purpose**: Creates a derived signal that automatically recalculates when its dependencies change.

```typescript
import { computed } from '@angular/core';

const doubled = computed(() => counter() * 2);
console.log(doubled()); // Reacts to counter changes
```

---

### 3️. **effect()**

**Purpose**: Runs a side-effect whenever the signals inside it change.

```typescript
import { effect } from '@angular/core';

effect(() => {
  console.log('Counter changed:', counter());
});
```

---

### 4️. **set()**

**Purpose**: Updates the signal value.

```typescript
counter.set(10);
```

---

### 5️. **update()**

**Purpose**: Updates the signal using a function.

```typescript
counter.update(v => v + 1);
```

---

### 6️. **readonly()**

**Purpose**: Creates a read-only view of a signal to expose state without allowing direct mutations.

```typescript
import { readonly } from '@angular/core';

const readOnlyCounter = readonly(counter);
console.log(readOnlyCounter()); // Read-only
```

---

### 7️. **untracked()**

**Purpose**: Read a signal’s value without registering a dependency.

```typescript
import { untracked } from '@angular/core';

const value = untracked(() => counter());
```

