import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import moment from 'moment-timezone'

export default class DashboardController {
  async index({ view }: HttpContext) {
    const productCount = await db.from('products').count('* as total')

    const articleCount = await db.from('articles').count('* as total')

    const userCount = await db.from('users').count('* as total')

    const getGreeting = () => {
      const epochMillis = Date.now()
      const hour = moment(epochMillis).tz('Asia/Jakarta').hour()
      let greeting

      if (hour >= 5 && hour < 12) {
        greeting = 'Pagi'
      } else if (hour >= 12 && hour < 17) {
        greeting = 'Siang'
      } else {
        greeting = 'Malam'
      }

      return greeting
    }

    return view.render('pages/admin/dashboard/index', {
      productCount: productCount[0].total,
      articleCount: articleCount[0].total,
      userCount: userCount[0].total,
      greeting: getGreeting(),
    })
  }
}
