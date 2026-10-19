import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParametresSuperadmin } from './parametres-superadmin';

describe('ParametresSuperadmin', () => {
  let component: ParametresSuperadmin;
  let fixture: ComponentFixture<ParametresSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametresSuperadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ParametresSuperadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
