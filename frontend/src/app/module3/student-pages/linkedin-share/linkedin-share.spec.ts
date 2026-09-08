import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedinShare } from './linkedin-share';

describe('LinkedinShare', () => {
  let component: LinkedinShare;
  let fixture: ComponentFixture<LinkedinShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedinShare],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedinShare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
