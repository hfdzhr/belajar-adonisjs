
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db';

export default class DashboardController {
  async index({ view }: HttpContext) {
    const productCount = await db
    .from('products')
    .count('* as total')

    const articleCount = await db
    .from('articles')
    .count('* as total')


    return view.render('pages/admin/dashboard/index', {productCount: productCount[0].total, articleCount: articleCount[0].total})
  }
}
