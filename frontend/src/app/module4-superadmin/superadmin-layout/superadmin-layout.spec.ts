import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SuperadminLayout } from './superadmin-layout';

describe('SuperadminLayout', () => {
  let component: SuperadminLayout;
  let fixture: ComponentFixture<SuperadminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminLayout],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
