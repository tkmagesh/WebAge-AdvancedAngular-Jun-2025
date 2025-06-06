import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloSignals } from './hello-signals';

describe('HelloSignals', () => {
  let component: HelloSignals;
  let fixture: ComponentFixture<HelloSignals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloSignals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelloSignals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
