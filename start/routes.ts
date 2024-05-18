/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ArticlesController from '#controllers/articles_controller'
import LoginController from '#controllers/auth/login_controller'
import LogoutController from '#controllers/auth/logout_controller'
import RegisterController from '#controllers/auth/register_controller'
import DashboardController from '#controllers/dashboard_controller'
import ProductsController from '#controllers/products_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import PurchasesController from '#controllers/purchases_controller'

router.on('/').render('pages/home').as('home')


// Auth Admin
router.group(() => {
    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')

    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')

    router.post('/logout', [LogoutController, 'handle']).as('logout')
  }).prefix('admin')

// Admin Router
router.group(() => {
    router.get('/', [DashboardController, 'index']).as('admin.dashboard')

    router.resource('products', ProductsController)
    router.resource('articles', ArticlesController)
    router.post('/buy/:id', [PurchasesController, 'buy']).as('products.buy')
}).prefix('admin').use(middleware.auth())

