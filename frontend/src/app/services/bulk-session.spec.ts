import { TestBed } from '@angular/core/testing';
import { BulkSessionService } from './bulk-session';

describe('BulkSessionService', () => {
  let service: BulkSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start without a batch', () => {
    expect(service.hasBatch()).toBe(false);
  });
});
