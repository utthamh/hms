import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsDropdownComponent } from './zs-dropdown.component';

describe('ZsDropdownComponent', () => {
  let component: ZsDropdownComponent;
  let fixture: ComponentFixture<ZsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
