import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreerDiplomes } from './creer-diplomes';

describe('CreerDiplomes', () => {
  let component: CreerDiplomes;
  let fixture: ComponentFixture<CreerDiplomes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerDiplomes],
    }).compileComponents();

    fixture = TestBed.createComponent(CreerDiplomes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
