import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOfMonthComponent } from './drug-of-month.component';

describe('DrugOfMonthComponent', () => {
  let component: DrugOfMonthComponent;
  let fixture: ComponentFixture<DrugOfMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugOfMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOfMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
