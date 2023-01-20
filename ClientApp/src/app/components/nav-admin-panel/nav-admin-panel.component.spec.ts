import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAdminPanelComponent } from './nav-admin-panel.component';

describe('NavAdminPanelComponent', () => {
  let component: NavAdminPanelComponent;
  let fixture: ComponentFixture<NavAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavAdminPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
