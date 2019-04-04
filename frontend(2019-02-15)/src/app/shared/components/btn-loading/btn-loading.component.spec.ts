import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLoadingComponent } from './btn-loading.component';

describe('BtnLoadingComponent', () => {
  let component: BtnLoadingComponent;
  let fixture: ComponentFixture<BtnLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
