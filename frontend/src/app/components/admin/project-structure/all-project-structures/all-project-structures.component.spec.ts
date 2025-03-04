import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectStructuresComponent } from './all-project-structures.component';

describe('AllProjectStructuresComponent', () => {
  let component: AllProjectStructuresComponent;
  let fixture: ComponentFixture<AllProjectStructuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProjectStructuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProjectStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
