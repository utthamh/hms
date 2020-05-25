import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsTextboxComponent } from './zs-textbox.component';

describe('ZsTextboxComponent', () => {
  let component: ZsTextboxComponent;
  let fixture: ComponentFixture<ZsTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
