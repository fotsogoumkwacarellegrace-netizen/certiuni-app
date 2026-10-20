import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VoirDiplome } from './voir-diplome';

describe('VoirDiplome', () => {
  let component: VoirDiplome;
  let fixture: ComponentFixture<VoirDiplome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirDiplome],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VoirDiplome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
