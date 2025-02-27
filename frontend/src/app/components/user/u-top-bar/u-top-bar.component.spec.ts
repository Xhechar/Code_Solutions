import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UTopBarComponent } from './u-top-bar.component';

describe('UTopBarComponent', () => {
  let component: UTopBarComponent;
  let fixture: ComponentFixture<UTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UTopBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
