import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { withLatestFrom, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-with-latest-from',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>WithLatestFrom Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>withLatestFrom</code> operator combines the source Observable with other Observables to create an Observable whose values are calculated from the latest values of each.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Combining user actions with current state</li>
          <li>Form submissions with latest form values</li>
          <li>Event handling with context data</li>
          <li>Reactive calculations</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(withLatestFrom(other$, (source, other) => result))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Button Clicks with Counter State</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="streams">
            <div class="stream">
              <h4>Button Clicks (Source)</h4>
              <div class="values">
                <div *ngFor="let click of buttonClicks" class="value click">
                  {{ click }}
                </div>
              </div>
            </div>
            
            <div class="stream">
              <h4>Counter State</h4>
              <div class="values">
                <div *ngFor="let count of counterValues" class="value counter">
                  Count: {{ count }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="arrow">↓</div>
          
          <div class="combined-section">
            <h4>WithLatestFrom Results</h4>
            <div class="values">
              <div *ngFor="let result of combinedResults" class="value combined">
                {{ result }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-example">
        <h3>Code Example</h3>
        <pre><code>{{ codeExample }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .operator-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .operator-info {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .demo-section {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .demo-controls {
      margin-bottom: 20px;
    }

    .demo-controls button {
      margin-right: 10px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }

    .demo-controls button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .results {
      margin-top: 20px;
    }

    .streams {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .stream {
      flex: 1;
    }

    .arrow {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      margin: 10px 0;
    }

    .combined-section {
      border-top: 2px solid #007bff;
      padding-top: 15px;
    }

    .values {
      min-height: 100px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      margin-top: 10px;
    }

    .value {
      padding: 5px 10px;
      margin: 5px 0;
      border-radius: 4px;
      animation: fadeIn 0.3s ease-in;
    }

    .value.click {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .value.counter {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .value.combined {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
      font-weight: bold;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .code-example {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }

    .code-example pre {
      background: #2d3748;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }

    h2 {
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    h3, h4 {
      color: #555;
      margin-top: 15px;
    }

    h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
    }

    code {
       
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 5px;
    }
  `]
})
export class WithLatestFromComponent implements OnInit, OnDestroy {
  buttonClicks: string[] = [];
  counterValues: number[] = [];
  combinedResults: string[] = [];
  isRunning = false;
  private subscriptions: Subscription[] = [];

  codeExample = `import { fromEvent, interval } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

// Button click stream
const buttonClicks$ = fromEvent(button, 'click');

// Counter state stream
const counter$ = interval(1000).pipe(
  map(count => count + 1)
);

// Combine clicks with latest counter value
const clicksWithCounter$ = buttonClicks$.pipe(
  withLatestFrom(counter$),
  map(([clickEvent, counterValue]) => ({
    timestamp: Date.now(),
    counterAtClick: counterValue
  }))
);

clicksWithCounter$.subscribe(result => {
  console.log('Click with counter:', result);
});

// Only emits when button is clicked, using latest counter value`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    // Create counter stream (updates every 800ms)
    const counter$ = interval(800).pipe(
      take(8),
      map(count => count + 1)
    );

    // Create button click stream (clicks at specific intervals)
    const buttonClicks$ = interval(2000).pipe(
      take(3),
      map(click => `Click ${click + 1}`)
    );

    // Track counter values
    this.subscriptions.push(
      counter$.subscribe(count => {
        this.counterValues.push(count);
      })
    );

    // Track button clicks
    this.subscriptions.push(
      buttonClicks$.subscribe(click => {
        this.buttonClicks.push(click);
      })
    );

    // Combine clicks with latest counter value
    this.subscriptions.push(
      buttonClicks$.pipe(
        withLatestFrom(counter$),
        map(([click, counter]) => `${click} at counter: ${counter}`)
      ).subscribe(result => {
        this.combinedResults.push(result);
      })
    );

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 8000);
  }

  stopDemo() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.isRunning = false;
  }

  clearResults() {
    this.buttonClicks = [];
    this.counterValues = [];
    this.combinedResults = [];
  }
}
