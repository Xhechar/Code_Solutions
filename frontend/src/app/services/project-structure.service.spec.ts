import { TestBed } from '@angular/core/testing';

import { ProjectStructureService } from './project-structure.service';

describe('ProjectStructureService', () => {
  let service: ProjectStructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectStructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
