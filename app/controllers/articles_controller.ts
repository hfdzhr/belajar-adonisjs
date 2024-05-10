import Article from '#models/article'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'
import fs from 'fs'
import path from 'path'

export default class ArticlesController {
  async index({ view }: HttpContext) {
    const articles = await Article.all()

    articles.forEach((article) => {
      article.content = string.truncate(article.content, 30, {
        completeWords: true,
      })
    })

    return view.render('pages/admin/articles/index', { articles })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/articles/create')
  }

  async store({ request, response }: HttpContext) {
    const articleImage = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    const filename = `${cuid()}.${articleImage?.extname}`

    console.log(filename)

    await articleImage?.move(app.publicPath('images'), {
      name: filename,
      overwrite: true,
    })

    const payload = request.except(['_csrf'])

    payload.image = filename

    Article.create(payload)

    return response.redirect().toRoute('articles.index')
  }

  async show({ params }: HttpContext) {}

  async edit({ params, view }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    return view.render('pages/admin/articles/edit', { article: article })
  }

  async update({ params, request, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)
  
    const articleImage = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })
  
    if (articleImage) {
      const imagePath = article.image
      const imagePathFull = path.join(app.publicPath('images'), imagePath)
      fs.unlinkSync(imagePathFull)
  
      const filename = `${cuid()}.${articleImage.extname}`
      
      await articleImage.move(app.publicPath('images'), {
        name: filename,
        overwrite: true,
      })
  
      const payload = request.except(['_csrf', '_method'])
      payload.image = filename
  
      await article.merge(payload).save()
  
      return response.redirect().toRoute('articles.index')
    } else {
      const payload = request.except(['_csrf', '_method'])
      await article.merge(payload).save()
  
      return response.redirect().toRoute('articles.index')
    }
  }
  

  async destroy({ params, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    const imagePath = article.image
    const imagePathFull = path.join(app.publicPath('images'), imagePath)

    await article.delete()

    fs.unlinkSync(imagePathFull)

    return response.redirect().back()
  }
}
