import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeARenterComponent } from './become-a-renter.component';

describe('BecomeARenterComponent', () => {
  let component: BecomeARenterComponent;
  let fixture: ComponentFixture<BecomeARenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeARenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeARenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
