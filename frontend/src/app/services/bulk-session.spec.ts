import { TestBed } from '@angular/core/testing';
import { BulkSession } from './bulk-session';

describe('BulkSession', () => {
  let service: BulkSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
