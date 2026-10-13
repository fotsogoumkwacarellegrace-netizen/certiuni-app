import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerationDiplomes } from './generation-diplomes';

describe('GenerationDiplomes', () => {
  let component: GenerationDiplomes;
  let fixture: ComponentFixture<GenerationDiplomes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationDiplomes],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerationDiplomes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
