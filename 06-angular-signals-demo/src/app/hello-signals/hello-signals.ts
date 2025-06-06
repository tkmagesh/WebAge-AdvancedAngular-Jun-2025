import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-hello-signals',
  template: `
    <div>
      <h2>Signals</h2>
      <hr/>
      <p>Count: {{ count() }}</p>
      <p>Doubled: {{ doubled() }}</p>
      <button (click)="increment()">Increment</button>
      <button>Decrement</button>
    </div>
  `
})
export class HelloSignalsComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment() {
    this.count.update(v => v + 1);
    // this.count.set(this.count() + 1)
  }
}