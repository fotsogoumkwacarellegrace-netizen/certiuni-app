import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsulterDemande } from './consulter-demande';

describe('ConsulterDemande', () => {
  let component: ConsulterDemande;
  let fixture: ComponentFixture<ConsulterDemande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulterDemande],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsulterDemande);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
