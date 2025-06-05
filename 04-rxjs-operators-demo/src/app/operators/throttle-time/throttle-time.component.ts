import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-throttle-time',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>ThrottleTime Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>throttleTime</code> operator emits a value, then ignores subsequent values for a specified duration.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Button click protection</li>
          <li>Scroll event throttling</li>
          <li>API rate limiting</li>
          <li>Performance optimization</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(throttleTime(milliseconds))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Button Click Throttling</h3>
        <div class="demo-controls">
          <button (click)="simulateClicks()" [disabled]="isRunning">Simulate Rapid Clicks</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>All Clicks</h4>
            <div class="values">
              <div *ngFor="let click of allClicks; let i = index" 
                   class="value" 
                   [ngClass]="{'allowed': isClickAllowed(i), 'throttled': !isClickAllowed(i)}">
                Click {{ i + 1 }}
                <span *ngIf="!isClickAllowed(i)" class="status">THROTTLED</span>
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Throttled Output (1000ms)</h4>
            <div class="values">
              <div *ngFor="let click of throttledClicks" class="value throttled-output">
                {{ click }}
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
      position: relative;
    }

    .value.allowed {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.throttled {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      opacity: 0.7;
    }

    .value.throttled-output {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .status {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 10px;
      background: #ff9800;
      color: white;
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
export class ThrottleTimeComponent implements OnInit, OnDestroy {
  allClicks: string[] = [];
  throttledClicks: string[] = [];
  isRunning = false;
  private clickSubject = new Subject<string>();
  private subscription?: Subscription;
  private clickTimestamps: number[] = [];

  codeExample = `import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

// Get button element
const button = document.getElementById('submit-btn');

// Create observable from click events
const clicks$ = fromEvent(button, 'click');

// Throttle clicks to prevent spam
const throttledClicks$ = clicks$.pipe(
  throttleTime(1000) // Only allow one click per second
);

throttledClicks$.subscribe(() => {
  console.log('Button clicked - processing...');
  // Process the click (e.g., submit form, make API call)
});

// Rapid clicks will be ignored during the throttle period`;

  ngOnInit() {
    // Set up throttled subscription
    this.subscription = this.clickSubject.pipe(
      throttleTime(1000)
    ).subscribe(click => {
      this.throttledClicks.push(click);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  simulateClicks() {
    this.clearResults();
    this.isRunning = true;

    // Simulate rapid clicks with varying intervals
    const clickIntervals = [0, 200, 400, 500, 800, 1200, 1400, 1600, 2800, 3000];
    
    clickIntervals.forEach((delay, index) => {
      setTimeout(() => {
        const clickTime = Date.now();
        const clickLabel = `Click ${index + 1}`;
        
        this.allClicks.push(clickLabel);
        this.clickTimestamps.push(clickTime);
        this.clickSubject.next(clickLabel);
        
        if (index === clickIntervals.length - 1) {
          this.isRunning = false;
        }
      }, delay);
    });
  }

  isClickAllowed(index: number): boolean {
    if (index === 0) return true; // First click is always allowed
    
    const currentTime = this.clickTimestamps[index];
    const lastAllowedIndex = this.findLastAllowedClickIndex(index);
    
    if (lastAllowedIndex === -1) return true;
    
    const lastAllowedTime = this.clickTimestamps[lastAllowedIndex];
    return currentTime - lastAllowedTime >= 1000;
  }

  private findLastAllowedClickIndex(currentIndex: number): number {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (this.isClickAllowed(i)) {
        return i;
      }
    }
    return -1;
  }

  clearResults() {
    this.allClicks = [];
    this.throttledClicks = [];
    this.clickTimestamps = [];
  }
}
