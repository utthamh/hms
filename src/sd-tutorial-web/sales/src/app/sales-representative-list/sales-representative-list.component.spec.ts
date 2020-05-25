import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRepresentativeListComponent } from './sales-representative-list.component';

describe('SalesRepresentativeListComponent', () => {
  let component: SalesRepresentativeListComponent;
  let fixture: ComponentFixture<SalesRepresentativeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesRepresentativeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesRepresentativeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
