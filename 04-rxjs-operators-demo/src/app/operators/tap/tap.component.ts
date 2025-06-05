import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { tap, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-tap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Tap Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>tap</code> operator performs side effects for notifications from the source observable without affecting the stream.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Debugging and logging</li>
          <li>Triggering side effects</li>
          <li>Updating UI state</li>
          <li>Analytics tracking</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(tap(value => sideEffect(value)))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Logging Side Effects</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>Side Effects (Tap)</h4>
            <div class="values">
              <div *ngFor="let log of sideEffectLogs" class="value side-effect">
                {{ log }}
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Final Output</h4>
            <div class="values">
              <div *ngFor="let value of finalOutput" class="value output">
                {{ value }}
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
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-top: 20px;
    }

    .result-column {
      flex: 1;
    }

    .arrow {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      align-self: center;
    }

    .values {
      min-height: 150px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
    }

    .value {
      padding: 5px 10px;
      margin: 5px 0;
      border-radius: 4px;
      animation: fadeIn 0.3s ease-in;
    }

    .value.side-effect {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      font-family: monospace;
      font-size: 12px;
    }

    .value.output {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
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
      margin-top: 20px;
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
export class TapComponent implements OnInit, OnDestroy {
  sideEffectLogs: string[] = [];
  finalOutput: string[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { interval } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

const source$ = interval(1000).pipe(
  take(5),
  tap(value => {
    // Side effect: logging
    console.log('Processing value:', value);
    
    // Side effect: analytics
    analytics.track('value_processed', { value });
    
    // Side effect: update loading state
    this.isLoading = true;
  }),
  map(value => value * 2),
  tap(value => {
    // Side effect after transformation
    console.log('Transformed value:', value);
    this.isLoading = false;
  })
);

source$.subscribe(result => {
  console.log('Final result:', result);
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    const source$ = interval(1000).pipe(
      take(5),
      tap(value => {
        // Side effect: logging
        this.sideEffectLogs.push(`LOG: Processing value ${value}`);
        this.sideEffectLogs.push(`ANALYTICS: Tracked value ${value}`);
      }),
      map(value => `Processed: ${value * 2}`),
      tap(value => {
        // Side effect after transformation
        this.sideEffectLogs.push(`LOG: Transformed to ${value}`);
      })
    );

    this.subscription = source$.subscribe({
      next: value => {
        this.finalOutput.push(value);
      },
      complete: () => {
        this.sideEffectLogs.push('LOG: Stream completed');
        this.isRunning = false;
      }
    });
  }

  stopDemo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.sideEffectLogs = [];
    this.finalOutput = [];
  }
}
