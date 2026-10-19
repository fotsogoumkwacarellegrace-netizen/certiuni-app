import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSuperadmin } from './dashboard-superadmin';

describe('DashboardSuperadmin', () => {
  let component: DashboardSuperadmin;
  let fixture: ComponentFixture<DashboardSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSuperadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSuperadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
