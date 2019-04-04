import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDummyComponent } from './upload-dummy.component';

describe('UploadDummyComponent', () => {
  let component: UploadDummyComponent;
  let fixture: ComponentFixture<UploadDummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
