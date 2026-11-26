
import { Routes } from '@angular/router';

// Authentication
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

// Customer
import { CustomerLayoutComponent } from './features/customer/layout/customer-layout/customer-layout';
import { Home } from './features/home/components/home/home';
import { ProductListComponent } from './features/products/components/product-list/product-list';
import { ProductDetailsComponent } from './features/products/components/product-details/product-details';
import { CustomerCategoryListComponent } from './features/categories/components/customer-category-list/customer-category-list';
import { Cart } from './features/cart/components/cart/cart';
import { Checkout } from './features/checkout/components/checkout/checkout';
import { MyOrders } from './features/orders/components/my-orders/my-orders';
import { OrderDetails } from './features/orders/components/order-details/order-details';
import { Profile } from './features/profile/components/profile/profile';

// Admin
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard/admin-dashboard';
import { ProductManagementComponent } from './features/products/components/product-management/product-management';
import { CustomerManagementComponent } from './features/admin/customers/customer-management/customer-management';

// Guards
import { adminGuard } from './features/auth/guards/admin.guard';

export const routes: Routes = [

  // Default Route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Authentication
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },

  // Customer Layout
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [

      {
        path: 'home',
        component: Home
      },
      {
        path: 'products',
        component: ProductListComponent
      },
      {
        path: 'products/:id',
        component: ProductDetailsComponent
      },
      {
        path: 'categories',
        component: CustomerCategoryListComponent
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'checkout',
        component: Checkout
      },
      {
        path: 'my-orders',
        component: MyOrders
      },
      {
        path: 'my-orders/:orderId',
        component: OrderDetails
      },
      {
        path: 'profile',
        component: Profile
      }

    ]
  },

  // Admin Layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/components/category-list/category-list')
            .then(m => m.CategoryListComponent)
      },
      {
        path: 'products',
        component: ProductManagementComponent
      },
      {
        path: 'customers',
        component: CustomerManagementComponent
      }

    ]
  },

  // Unknown Routes
  {
    path: '**',
    redirectTo: 'login'
  }

];
