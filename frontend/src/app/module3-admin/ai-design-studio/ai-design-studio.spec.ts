import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiDesignStudio } from './ai-design-studio';

describe('AiDesignStudio', () => {
  let component: AiDesignStudio;
  let fixture: ComponentFixture<AiDesignStudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiDesignStudio],
    }).compileComponents();

    fixture = TestBed.createComponent(AiDesignStudio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
