import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkTable } from './bulk-table';

describe('BulkTable', () => {
  let component: BulkTable;
  let fixture: ComponentFixture<BulkTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
