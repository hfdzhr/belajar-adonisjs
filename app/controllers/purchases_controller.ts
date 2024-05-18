import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { MidtransClient } from 'midtrans-node-client'
import env from '#start/env'
import { randomUUID } from 'crypto'

export default class PurchasesController {
  async buy({ params, response, auth }: HttpContext) {
    const productId = await Product.query().sum('price')
    const product = await Product.findOrFail(productId)
    const user = await auth.getUserOrFail()

    const snap = new MidtransClient.Snap({
      isProduction: env.get('IS_PRODUCTION'),
      clientKey: env.get('CLIENT_KEY'),
      serverKey: env.get('SERVER_KEY'),
    })

    try {
      const transaction = await snap.createTransaction({
        transaction_details: {
          order_id: randomUUID(),
          gross_amount: product.price,
        },
        credit_card: {
          secure: true,
        },
        item_details: [
          {
            id: product.id,
            name: product.name,
            quantity: 1,
            price: product.price,
          },
        ],
        customer_details: {
          first_name: user.fullName,
          email: user.email,
        },
      })

      product.quantity -= 1
      await product.save()

      return response.redirect(transaction.redirect_url)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Something went wrong' })
    }
  }
}
