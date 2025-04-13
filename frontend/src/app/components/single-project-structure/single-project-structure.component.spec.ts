import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectStructureComponent } from './single-project-structure.component';

describe('SingleProjectStructureComponent', () => {
  let component: SingleProjectStructureComponent;
  let fixture: ComponentFixture<SingleProjectStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleProjectStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProjectStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
