import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Todoform } from './todoform';

describe('Todoform', () => {
  let component: Todoform;
  let fixture: ComponentFixture<Todoform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Todoform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Todoform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
