import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersDisplayComponent } from './characters-display.component';

describe('CharactersDisplayComponent', () => {
  let component: CharactersDisplayComponent;
  let fixture: ComponentFixture<CharactersDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharactersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
