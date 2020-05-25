import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepOfMonthComponent } from './rep-of-month.component';

describe('RepOfMonthComponent', () => {
  let component: RepOfMonthComponent;
  let fixture: ComponentFixture<RepOfMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepOfMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepOfMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
