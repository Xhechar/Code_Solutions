import { ComponentFixture, TestBed } from '@angular/core/testing';

import { USideBarComponent } from './u-side-bar.component';

describe('USideBarComponent', () => {
  let component: USideBarComponent;
  let fixture: ComponentFixture<USideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [USideBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(USideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
