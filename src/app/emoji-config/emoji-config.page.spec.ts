import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmojiConfigPage } from './emoji-config.page';

describe('EmojiConfigPage', () => {
  let component: EmojiConfigPage;
  let fixture: ComponentFixture<EmojiConfigPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmojiConfigPage]
    });
    fixture = TestBed.createComponent(EmojiConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
