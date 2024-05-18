import Product from '#models/product'
import { createProductValidator, editProductValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ view }: HttpContext) {
    const products = await Product.all()

    return view.render('pages/admin/products/index', { products })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/products/create')
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    await Product.create(payload)

    return response.redirect().toRoute('products.index')
  }

  async show({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    await product.save()
  }

  async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return view.render('pages/admin/products/edit', { product: product })
  }

  async update({ params, request, response }: HttpContext) {
    const id = params.id
    const product = await Product.findOrFail(id)
    const payload = await request.validateUsing(editProductValidator)

    await product.merge(payload).save()

    return response.redirect().toRoute('products.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    session.flash('notification', {
      message: 'Product has been deleted'
    })
    return response.redirect().back()
  }
}
