import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map', loadComponent: () => import('./operators/map/map.component').then(m => m.MapComponent) },
  { path: 'filter', loadComponent: () => import('./operators/filter/filter.component').then(m => m.FilterComponent) },
  { path: 'merge-map', loadComponent: () => import('./operators/merge-map/merge-map.component').then(m => m.MergeMapComponent) },
  { path: 'switch-map', loadComponent: () => import('./operators/switch-map/switch-map.component').then(m => m.SwitchMapComponent) },
  { path: 'debounce-time', loadComponent: () => import('./operators/debounce-time/debounce-time.component').then(m => m.DebounceTimeComponent) },
  { path: 'combine-latest', loadComponent: () => import('./operators/combine-latest/combine-latest.component').then(m => m.CombineLatestComponent) },
  { path: 'take', loadComponent: () => import('./operators/take/take.component').then(m => m.TakeComponent) },
  { path: 'distinct-until-changed', loadComponent: () => import('./operators/distinct-until-changed/distinct-until-changed.component').then(m => m.DistinctUntilChangedComponent) },
  { path: 'tap', loadComponent: () => import('./operators/tap/tap.component').then(m => m.TapComponent) },
  { path: 'catch-error', loadComponent: () => import('./operators/catch-error/catch-error.component').then(m => m.CatchErrorComponent) },
  { path: 'start-with', loadComponent: () => import('./operators/start-with/start-with.component').then(m => m.StartWithComponent) },
  { path: 'scan', loadComponent: () => import('./operators/scan/scan.component').then(m => m.ScanComponent) },
  { path: 'share', loadComponent: () => import('./operators/share/share.component').then(m => m.ShareComponent) },
  { path: 'concat-map', loadComponent: () => import('./operators/concat-map/concat-map.component').then(m => m.ConcatMapComponent) },
  { path: 'retry', loadComponent: () => import('./operators/retry/retry.component').then(m => m.RetryComponent) },
  { path: 'throttle-time', loadComponent: () => import('./operators/throttle-time/throttle-time.component').then(m => m.ThrottleTimeComponent) },
  { path: 'reduce', loadComponent: () => import('./operators/reduce/reduce.component').then(m => m.ReduceComponent) },
  { path: 'flat-map', loadComponent: () => import('./operators/flat-map/flat-map.component').then(m => m.FlatMapComponent) },
  { path: 'with-latest-from', loadComponent: () => import('./operators/with-latest-from/with-latest-from.component').then(m => m.WithLatestFromComponent) },
  { path: 'typeahead', loadComponent: () => import('./operators/typeahead/typeahead.component').then(m => m.TypeaheadComponent) },
  { path: 'typeahead-signal', loadComponent: () => import('./operators/typeahead-signal/typeahead-signal.component').then(m => m.TypeaheadSignalComponent) }
];
