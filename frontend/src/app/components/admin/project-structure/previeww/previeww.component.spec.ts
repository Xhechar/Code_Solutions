import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewwComponent } from './previeww.component';

describe('PreviewwComponent', () => {
  let component: PreviewwComponent;
  let fixture: ComponentFixture<PreviewwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
