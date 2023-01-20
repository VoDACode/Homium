import { TestBed } from '@angular/core/testing';

import { ApiNavMenuService } from './api-nav-menu.service';

describe('ApiNavMenuService', () => {
  let service: ApiNavMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiNavMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
