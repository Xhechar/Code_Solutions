import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureguidesComponent } from './structureguides.component';

describe('StructureguidesComponent', () => {
  let component: StructureguidesComponent;
  let fixture: ComponentFixture<StructureguidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureguidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureguidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
