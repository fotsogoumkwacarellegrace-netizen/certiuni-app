import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SuperadminLogin } from './superadmin-login';

describe('SuperadminLogin', () => {
  let component: SuperadminLogin;
  let fixture: ComponentFixture<SuperadminLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminLogin],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
