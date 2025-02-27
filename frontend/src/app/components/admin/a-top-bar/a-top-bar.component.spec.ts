import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ATopBarComponent } from './a-top-bar.component';

describe('ATopBarComponent', () => {
  let component: ATopBarComponent;
  let fixture: ComponentFixture<ATopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ATopBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ATopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
