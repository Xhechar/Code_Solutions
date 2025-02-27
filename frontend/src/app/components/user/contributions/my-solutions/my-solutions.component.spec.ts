import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySolutionsComponent } from './my-solutions.component';

describe('MySolutionsComponent', () => {
  let component: MySolutionsComponent;
  let fixture: ComponentFixture<MySolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySolutionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
