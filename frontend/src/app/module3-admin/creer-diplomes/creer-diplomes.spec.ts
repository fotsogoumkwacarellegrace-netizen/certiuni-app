import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CreerDiplomes } from './creer-diplomes';

describe('CreerDiplomes', () => {
  let component: CreerDiplomes;
  let fixture: ComponentFixture<CreerDiplomes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerDiplomes],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreerDiplomes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
