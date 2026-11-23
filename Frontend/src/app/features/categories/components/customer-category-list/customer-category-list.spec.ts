
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCategoryListComponent } from './customer-category-list';

describe('CustomerCategoryListComponent', () => {

  let component: CustomerCategoryListComponent;
  let fixture: ComponentFixture<CustomerCategoryListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CustomerCategoryListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryListComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
