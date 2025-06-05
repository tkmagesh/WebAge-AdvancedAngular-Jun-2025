import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { 
  Subject, 
  BehaviorSubject,
  Observable, 
  of, 
  throwError,
  combineLatest,
  merge,
  timer,
  EMPTY
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  retry,
  tap,
  map,
  filter,
  startWith,
  scan,
  share,
  withLatestFrom,
  mergeMap,
  take,
  takeUntil,
  throttleTime,
  delay,
  finalize,
  reduce,
  concatMap
} from 'rxjs/operators';

interface SearchResult {
  id: number;
  name: string;
  category: string;
  description: string;
  highlight?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  timestamp: string;
  error?: string;
}

interface LoadingState {
  loading: true;
}

type SearchOrLoadingResponse = SearchResponse | LoadingState;

interface SearchState {
  loading: boolean;
  results: SearchResult[];
  error: string | null;
  query: string;
  searchCount: number;
  selectedCategories: string[];
}

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="typeahead-container">
      <h2>Advanced Typeahead Search</h2>
      
      <div class="info-section">
        <h3>RxJS Operators Used</h3>
        <div class="operators-grid">
          <span class="operator-badge" *ngFor="let op of usedOperators">{{ op }}</span>
        </div>
      </div>

      <div class="search-section">
        <div class="search-controls">
          <div class="search-input-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Search for programming languages, frameworks, tools..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="searchSubject.next($event)"
              [disabled]="useErrorEndpoint"
            />
            <div class="search-icon" [class.loading]="(searchState$ | async)?.loading">
              <span *ngIf="!(searchState$ | async)?.loading">🔍</span>
              <span *ngIf="(searchState$ | async)?.loading" class="spinner">⟳</span>
            </div>
          </div>

          <div class="controls">
            <label>
              <input type="checkbox" [(ngModel)]="useErrorEndpoint">
              Use error endpoint (test retry)
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="enableThrottle">
              Enable throttle (1s)
            </label>
          </div>
        </div>

        <div class="categories" *ngIf="categories$ | async as categories">
          <h4>Filter by Category:</h4>
          <label *ngFor="let category of categories" class="category-filter">
            <input 
              type="checkbox" 
              [checked]="isCategorySelected(category)"
              (change)="toggleCategory(category)">
            {{ category }}
          </label>
        </div>

        <div class="stats" *ngIf="searchState$ | async as state">
          <div class="stat">
            <span class="label">Search Count:</span>
            <span class="value">{{ state.searchCount }}</span>
          </div>
          <div class="stat">
            <span class="label">Results:</span>
            <span class="value">{{ state.results.length }}</span>
          </div>
          <div class="stat">
            <span class="label">Query:</span>
            <span class="value">"{{ state.query }}"</span>
          </div>
        </div>

        <div class="error" *ngIf="(searchState$ | async)?.error as error">
          <strong>Error:</strong> {{ error }}
        </div>

        <div class="results" *ngIf="(searchState$ | async)?.results as results">
          <div class="result-item" *ngFor="let result of results">
            <div class="result-header">
              <h4 [innerHTML]="result.highlight || result.name"></h4>
              <span class="category-badge" [attr.data-category]="result.category">
                {{ result.category }}
              </span>
            </div>
            <p class="description">{{ result.description }}</p>
          </div>
          
          <div class="no-results" *ngIf="results.length === 0 && (searchState$ | async)?.query">
            No results found for "{{ (searchState$ | async)?.query }}"
          </div>
        </div>

        <div class="recent-searches" *ngIf="recentSearches$ | async as recent">
          <h4>Recent Searches:</h4>
          <div class="recent-list">
            <span 
              *ngFor="let search of recent" 
              class="recent-item"
              (click)="searchTerm = search; searchSubject.next(search)">
              {{ search }}
            </span>
          </div>
        </div>
      </div>

      <div class="operator-flow">
        <h3>Data Flow Visualization</h3>
        <div class="flow-diagram">
          <div class="flow-step">Input → debounceTime(300ms)</div>
          <div class="flow-step">→ distinctUntilChanged()</div>
          <div class="flow-step">→ filter(length > 2)</div>
          <div class="flow-step">→ tap(logging)</div>
          <div class="flow-step">→ switchMap(API call)</div>
          <div class="flow-step">→ retry(3)</div>
          <div class="flow-step">→ catchError()</div>
          <div class="flow-step">→ map(transform)</div>
          <div class="flow-step">→ scan(accumulate state)</div>
          <div class="flow-step">→ share()</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .typeahead-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .info-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .operators-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .operator-badge {
      background: #007bff;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .search-section {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
    }

    .search-input-wrapper {
      position: relative;
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }

    .search-icon.loading .spinner {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .controls {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .categories {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .categories h4 {
      margin: 0 0 10px 0;
      color: #555;
    }

    .category-filter {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-right: 15px;
      cursor: pointer;
    }

    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 10px;
      background: #e9ecef;
      border-radius: 4px;
    }

    .stat {
      display: flex;
      gap: 5px;
    }

    .stat .label {
      font-weight: 600;
      color: #666;
    }

    .stat .value {
      color: #007bff;
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .results {
      margin-top: 20px;
    }

    .result-item {
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 10px;
      transition: all 0.3s;
      animation: fadeIn 0.3s ease-in;
    }

    .result-item:hover {
      border-color: #007bff;
      box-shadow: 0 2px 8px rgba(0,123,255,0.1);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .result-header h4 {
      margin: 0;
      color: #333;
    }

    .result-header h4 mark {
      background: #fff3cd;
      padding: 2px 4px;
      border-radius: 3px;
    }

    .category-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: #e9ecef;
      color: #495057;
    }

    .category-badge[data-category="Programming Language"] {
      background: #d1ecf1;
      color: #0c5460;
    }

    .category-badge[data-category="Framework"] {
      background: #d4edda;
      color: #155724;
    }

    .category-badge[data-category="Library"] {
      background: #fff3cd;
      color: #856404;
    }

    .category-badge[data-category="Database"] {
      background: #f8d7da;
      color: #721c24;
    }

    .category-badge[data-category="Tool"] {
      background: #e2e3e5;
      color: #383d41;
    }

    .description {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .recent-searches {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .recent-searches h4 {
      margin: 0 0 10px 0;
      color: #555;
    }

    .recent-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .recent-item {
      padding: 4px 12px;
      background: #e9ecef;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .recent-item:hover {
      background: #007bff;
      color: white;
    }

    .operator-flow {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .flow-diagram {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }

    .flow-step {
      padding: 10px 15px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
    }

    @keyframes fadeIn {
      from { 
        opacity: 0; 
        transform: translateY(-10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `]
})
export class TypeaheadComponent implements OnInit, OnDestroy {
  searchTerm = '';
  useErrorEndpoint = false;
  enableThrottle = false;
  
  private destroy$ = new Subject<void>();
  searchSubject = new Subject<string>();
  private categorySubject = new BehaviorSubject<string[]>([]);
  
  searchState$!: Observable<SearchState>;
  categories$!: Observable<string[]>;
  recentSearches$!: Observable<string[]>;

  usedOperators = [
    'debounceTime', 'distinctUntilChanged', 'switchMap', 'catchError',
    'retry', 'tap', 'map', 'filter', 'startWith', 'scan', 'share',
    'withLatestFrom', 'mergeMap', 'take', 'takeUntil', 'throttleTime',
    'delay', 'finalize', 'reduce', 'concatMap', 'combineLatest', 'merge'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch categories
    this.categories$ = this.http.get<string[]>('http://localhost:3001/api/categories').pipe(
      catchError(() => of(['Programming Language', 'Framework', 'Library', 'Database', 'Tool'])),
      share()
    );

    // Create search stream with multiple operators
    const search$ = this.searchSubject.pipe(
      tap(term => console.log('1. Input received:', term)),
      
      // Apply throttle if enabled
      mergeMap(term => 
        this.enableThrottle 
          ? of(term).pipe(throttleTime(1000))
          : of(term)
      ),
      
      // Debounce user input
      debounceTime(300),
      tap(term => console.log('2. After debounce:', term)),
      
      // Only emit if value changed
      distinctUntilChanged(),
      tap(term => console.log('3. After distinctUntilChanged:', term)),
      
      // Filter out short queries
      filter(term => term.length > 2 || term.length === 0),
      tap(term => console.log('4. After filter:', term)),
      
      // Log search attempt
      tap(term => {
        if (term) console.log('5. Searching for:', term);
      }),
      
      // Switch to API call
      switchMap((term: string): Observable<SearchOrLoadingResponse> => {
        if (!term) {
          return of({ query: '', results: [], total: 0, timestamp: new Date().toISOString() } as SearchResponse);
        }
        
        const endpoint = this.useErrorEndpoint 
          ? 'http://localhost:3001/api/search-with-errors'
          : 'http://localhost:3001/api/search';
          
        return this.http.get<SearchResponse>(`${endpoint}?q=${term}`).pipe(
          // Retry failed requests
          retry({
            count: 3,
            delay: (error, retryCount) => {
              console.log(`Retry attempt ${retryCount} after error:`, error.message);
              return timer(1000 * retryCount);
            }
          }),
          
          // Handle errors
          catchError(error => {
            console.error('Search error:', error);
            return of({
              query: term,
              results: [],
              total: 0,
              timestamp: new Date().toISOString(),
              error: error.message || 'Search failed'
            } as SearchResponse);
          }),
          
          // Add artificial delay for demo
          delay(200),
          
          // Log response
          tap(response => console.log('6. API response:', response)),
          
          // Add loading state
          startWith({ loading: true } as LoadingState),
          
          // Finalize
          finalize(() => console.log('7. Request completed'))
        );
      }),
      
      // Share the stream
      share()
    );

    // Combine search results with category filter
    this.searchState$ = combineLatest([
      search$,
      this.categorySubject.asObservable()
    ]).pipe(
      // Filter results by selected categories
      map(([response, selectedCategories]) => {
        if (response && typeof response === 'object' && 'loading' in response) {
          return response;
        }
        
        const searchResponse = response as SearchResponse;
        const filteredResults = (selectedCategories as string[]).length > 0
          ? searchResponse.results.filter((r: SearchResult) => (selectedCategories as string[]).includes(r.category))
          : searchResponse.results;
          
        return {
          ...searchResponse,
          results: filteredResults
        };
      }),
      
      // Accumulate state with scan
      scan((state: SearchState, response: any) => {
        if ('loading' in response) {
          return { ...state, loading: true };
        }
        
        return {
          loading: false,
          results: response.results || [],
          error: response.error || null,
          query: response.query || '',
          searchCount: state.searchCount + (response.query ? 1 : 0),
          selectedCategories: state.selectedCategories
        };
      }, {
        loading: false,
        results: [],
        error: null,
        query: '',
        searchCount: 0,
        selectedCategories: []
      }),
      
      // Start with initial state
      startWith({
        loading: false,
        results: [],
        error: null,
        query: '',
        searchCount: 0,
        selectedCategories: []
      }),
      
      // Share the state
      share()
    );

    // Track recent searches
    this.recentSearches$ = this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(term => term.length > 2),
      scan((recent: string[], term: string) => {
        const updated = [term, ...recent.filter(t => t !== term)];
        return updated.slice(0, 5);
      }, []),
      startWith([]),
      share()
    );

    // Auto-cleanup
    merge(
      this.searchState$,
      this.recentSearches$
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleCategory(category: string) {
    const current = this.categorySubject.value;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    this.categorySubject.next(updated);
  }

  isCategorySelected(category: string): boolean {
    return this.categorySubject.value.includes(category);
  }
}
