import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPasswordReset } from './direct-password-reset';

describe('DirectPasswordReset', () => {
  let component: DirectPasswordReset;
  let fixture: ComponentFixture<DirectPasswordReset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectPasswordReset]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectPasswordReset);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
