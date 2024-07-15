import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouttachesComponent } from './ajouttaches.component';

describe('AjouttachesComponent', () => {
  let component: AjouttachesComponent;
  let fixture: ComponentFixture<AjouttachesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouttachesComponent]
    });
    fixture = TestBed.createComponent(AjouttachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
