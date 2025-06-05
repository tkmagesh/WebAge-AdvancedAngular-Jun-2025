import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, combineLatest } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-combine-latest',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>CombineLatest Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>combineLatest</code> operator combines multiple observables and emits the latest values from each whenever any observable emits.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Form validation with multiple fields</li>
          <li>Combining user preferences and data</li>
          <li>Real-time dashboard updates</li>
          <li>Reactive calculations</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>combineLatest([obs1$, obs2$, obs3$])</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Temperature & Humidity Sensors</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="sensor-readings">
            <div class="sensor">
              <h4>Temperature Sensor</h4>
              <div class="values">
                <div *ngFor="let temp of temperatureReadings" class="value temp">
                  {{ temp }}°C
                </div>
              </div>
            </div>
            
            <div class="sensor">
              <h4>Humidity Sensor</h4>
              <div class="values">
                <div *ngFor="let humidity of humidityReadings" class="value humidity">
                  {{ humidity }}%
                </div>
              </div>
            </div>
          </div>
          
          <div class="arrow">↓</div>
          
          <div class="combined-section">
            <h4>Combined Readings</h4>
            <div class="values">
              <div *ngFor="let reading of combinedReadings" class="value combined">
                {{ reading }}
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

    .sensor-readings {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .sensor {
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
      min-height: 80px;
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

    .value.temp {
      background: #ffebee;
      border-left: 4px solid #f44336;
    }

    .value.humidity {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
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
export class CombineLatestComponent implements OnInit, OnDestroy {
  temperatureReadings: number[] = [];
  humidityReadings: number[] = [];
  combinedReadings: string[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { combineLatest, interval } from 'rxjs';
import { map } from 'rxjs/operators';

// Create temperature sensor observable
const temperature$ = interval(1000).pipe(
  map(() => Math.round(Math.random() * 30 + 15)) // 15-45°C
);

// Create humidity sensor observable  
const humidity$ = interval(1500).pipe(
  map(() => Math.round(Math.random() * 40 + 30)) // 30-70%
);

// Combine latest values from both sensors
const combined$ = combineLatest([temperature$, humidity$]).pipe(
  map(([temp, humidity]) => ({
    temperature: temp,
    humidity: humidity,
    comfort: temp > 20 && temp < 25 && humidity < 60 ? 'Comfortable' : 'Uncomfortable'
  }))
);

combined$.subscribe(reading => {
  console.log('Combined reading:', reading);
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    // Create temperature sensor (every 1000ms)
    const temperature$ = interval(1000).pipe(
      take(8),
      map(() => Math.round(Math.random() * 30 + 15)) // 15-45°C
    );

    // Create humidity sensor (every 1500ms)
    const humidity$ = interval(1500).pipe(
      take(6),
      map(() => Math.round(Math.random() * 40 + 30)) // 30-70%
    );

    // Track individual sensor readings
    temperature$.subscribe(temp => {
      this.temperatureReadings.push(temp);
    });

    humidity$.subscribe(humidity => {
      this.humidityReadings.push(humidity);
    });

    // Combine latest values
    this.subscription = combineLatest([temperature$, humidity$]).pipe(
      map(([temp, humidity]) => {
        const comfort = temp > 20 && temp < 25 && humidity < 60 ? 'Comfortable' : 'Uncomfortable';
        return `${temp}°C, ${humidity}% - ${comfort}`;
      })
    ).subscribe(combined => {
      this.combinedReadings.push(combined);
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
    this.temperatureReadings = [];
    this.humidityReadings = [];
    this.combinedReadings = [];
  }
}
