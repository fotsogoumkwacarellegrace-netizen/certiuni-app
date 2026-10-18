import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RevoquerDiplome } from './revoquer-diplome';

describe('RevoquerDiplome', () => {
  let component: RevoquerDiplome;
  let fixture: ComponentFixture<RevoquerDiplome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevoquerDiplome],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RevoquerDiplome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
