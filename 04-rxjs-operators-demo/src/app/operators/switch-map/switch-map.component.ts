import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, of, Subscription } from 'rxjs';
import { switchMap, take, delay } from 'rxjs/operators';

@Component({
  selector: 'app-switch-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>SwitchMap Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>switchMap</code> operator maps each source value to an Observable, then flattens the result by switching to the latest inner Observable and cancelling previous ones.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Search functionality (cancel previous search when new one starts)</li>
          <li>Navigation requests</li>
          <li>Auto-save features</li>
          <li>Real-time data updates</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(switchMap(value => innerObservable))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Search Simulation</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>Search Queries</h4>
            <div class="values">
              <div *ngFor="let query of searchQueries; let i = index" 
                   class="value" 
                   [ngClass]="{'cancelled': cancelledQueries.includes(i), 'active': i === searchQueries.length - 1}">
                Search: "{{ query }}"
                <span *ngIf="cancelledQueries.includes(i)" class="status cancelled">CANCELLED</span>
                <span *ngIf="i === searchQueries.length - 1 && isRunning" class="status active">ACTIVE</span>
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Search Results</h4>
            <div class="values">
              <div *ngFor="let result of searchResults" class="value result">
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
      min-height: 100px;
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

    .value.cancelled {
      background: #ffebee;
      border-left: 4px solid #f44336;
      opacity: 0.7;
    }

    .value.active {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.result {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .status {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 10px;
      font-weight: bold;
    }

    .status.cancelled {
      background: #f44336;
      color: white;
    }

    .status.active {
      background: #4caf50;
      color: white;
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

    h3 {
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
export class SwitchMapComponent implements OnInit, OnDestroy {
  searchQueries: string[] = [];
  searchResults: string[] = [];
  cancelledQueries: number[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { fromEvent, of } from 'rxjs';
import { switchMap, debounceTime, delay } from 'rxjs/operators';

// Simulate search input
const searchInput$ = fromEvent(searchInput, 'input');

// Use switchMap for search - cancels previous searches
const searchResults$ = searchInput$.pipe(
  debounceTime(300),
  switchMap(event => 
    searchAPI(event.target.value).pipe(
      delay(1000) // Simulate API delay
    )
  )
);

searchResults$.subscribe(results => {
  console.log('Search results:', results);
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    const queries = ['a', 'ap', 'app', 'apple'];
    const source$ = interval(1500).pipe(take(queries.length));
    
    this.subscription = source$.pipe(
      switchMap((index) => {
        const query = queries[index];
        this.searchQueries.push(query);
        
        // Mark previous queries as cancelled (except the current one)
        if (index > 0) {
          this.cancelledQueries.push(index - 1);
        }
        
        // Simulate search API call
        return of(`Results for "${query}": Found ${Math.floor(Math.random() * 10) + 1} items`).pipe(
          delay(2000)
        );
      })
    ).subscribe(result => {
      this.searchResults.push(result);
    });

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 10000);
  }

  stopDemo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.searchQueries = [];
    this.searchResults = [];
    this.cancelledQueries = [];
  }
}
