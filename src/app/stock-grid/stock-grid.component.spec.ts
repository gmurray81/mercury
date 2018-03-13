import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGridComponent } from './stock-grid.component';
import { IgxGridModule, IgxProgressBarModule, IgxAvatarModule, IgxBadgeModule, IgxSwitchModule } from 'igniteui-angular/main';

describe('StockGridComponent', () => {
  let component: StockGridComponent;
  let fixture: ComponentFixture<StockGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockGridComponent ],
      imports: [ IgxGridModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
