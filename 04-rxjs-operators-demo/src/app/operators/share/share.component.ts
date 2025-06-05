import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { share, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Share Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>share</code> operator makes a cold Observable hot by sharing a single subscription among multiple subscribers.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Sharing expensive operations (HTTP requests)</li>
          <li>Preventing duplicate API calls</li>
          <li>Broadcasting data to multiple components</li>
          <li>Optimizing resource usage</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(share())</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Multiple Subscribers</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="comparison">
            <div class="scenario">
              <h4>Without Share (Cold Observable)</h4>
              <div class="subscribers">
                <div class="subscriber">
                  <h5>Subscriber A</h5>
                  <div class="values">
                    <div *ngFor="let value of coldSubscriberA" class="value cold-a">
                      {{ value }}
                    </div>
                  </div>
                </div>
                <div class="subscriber">
                  <h5>Subscriber B</h5>
                  <div class="values">
                    <div *ngFor="let value of coldSubscriberB" class="value cold-b">
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="scenario">
              <h4>With Share (Hot Observable)</h4>
              <div class="subscribers">
                <div class="subscriber">
                  <h5>Subscriber A</h5>
                  <div class="values">
                    <div *ngFor="let value of hotSubscriberA" class="value hot-a">
                      {{ value }}
                    </div>
                  </div>
                </div>
                <div class="subscriber">
                  <h5>Subscriber B</h5>
                  <div class="values">
                    <div *ngFor="let value of hotSubscriberB" class="value hot-b">
                      {{ value }}
                    </div>
                  </div>
                </div>
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
      max-width: 1200px;
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

    .comparison {
      display: flex;
      gap: 30px;
      margin-top: 20px;
    }

    .scenario {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
    }

    .subscribers {
      display: flex;
      gap: 15px;
      margin-top: 15px;
    }

    .subscriber {
      flex: 1;
    }

    .values {
      min-height: 120px;
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

    .value.cold-a {
      background: #ffebee;
      border-left: 4px solid #f44336;
    }

    .value.cold-b {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .value.hot-a {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.hot-b {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
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

    h3, h4, h5 {
      color: #555;
      margin-top: 15px;
    }

    h4 {
      text-align: center;
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      margin: 0 0 15px 0;
    }

    h5 {
      margin: 0 0 5px 0;
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
export class ShareComponent implements OnInit, OnDestroy {
  coldSubscriberA: string[] = [];
  coldSubscriberB: string[] = [];
  hotSubscriberA: string[] = [];
  hotSubscriberB: string[] = [];
  isRunning = false;
  private subscriptions: Subscription[] = [];

  codeExample = `import { interval } from 'rxjs';
import { share, map } from 'rxjs/operators';

// Expensive operation (e.g., HTTP request)
const expensiveOperation$ = interval(1000).pipe(
  map(value => {
    console.log('Expensive operation executed!', value);
    return \`Data \${value}\`;
  })
);

// Without share - each subscriber gets its own execution
const cold$ = expensiveOperation$;

// With share - single execution shared among subscribers
const hot$ = expensiveOperation$.pipe(share());

// Cold observable - executes twice
cold$.subscribe(data => console.log('Subscriber A (cold):', data));
cold$.subscribe(data => console.log('Subscriber B (cold):', data));

// Hot observable - executes once, shared
hot$.subscribe(data => console.log('Subscriber A (hot):', data));
hot$.subscribe(data => console.log('Subscriber B (hot):', data));`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    // Create expensive operation
    const expensiveOperation$ = interval(1000).pipe(
      take(5),
      map(value => {
        console.log('Expensive operation executed!', value);
        return `Data ${value}`;
      })
    );

    // Cold observable - each subscriber gets its own execution
    const cold$ = expensiveOperation$;
    
    // Hot observable - shared execution
    const hot$ = expensiveOperation$.pipe(share());

    // Subscribe to cold observable (2 separate executions)
    this.subscriptions.push(
      cold$.subscribe(data => {
        this.coldSubscriberA.push(`A: ${data}`);
      })
    );

    // Subscribe to cold observable again (another separate execution)
    setTimeout(() => {
      this.subscriptions.push(
        cold$.subscribe(data => {
          this.coldSubscriberB.push(`B: ${data}`);
        })
      );
    }, 500);

    // Subscribe to hot observable (shared execution)
    this.subscriptions.push(
      hot$.subscribe(data => {
        this.hotSubscriberA.push(`A: ${data}`);
      })
    );

    // Subscribe to hot observable again (same shared execution)
    setTimeout(() => {
      this.subscriptions.push(
        hot$.subscribe(data => {
          this.hotSubscriberB.push(`B: ${data}`);
        })
      );
    }, 500);

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 7000);
  }

  stopDemo() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.isRunning = false;
  }

  clearResults() {
    this.coldSubscriberA = [];
    this.coldSubscriberB = [];
    this.hotSubscriberA = [];
    this.hotSubscriberB = [];
  }
}
