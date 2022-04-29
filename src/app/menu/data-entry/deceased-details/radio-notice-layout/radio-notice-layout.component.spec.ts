import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadioNoticeLayoutComponent } from './radio-notice-layout.component';

describe('RadioNoticeLayoutComponent', () => {
  let component: RadioNoticeLayoutComponent;
  let fixture: ComponentFixture<RadioNoticeLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioNoticeLayoutComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioNoticeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
