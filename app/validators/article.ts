import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255),
    content: vine.string(),
    author: vine.string().trim().maxLength(50),
    image: vine.string().url()
  })
)

export const editProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    quantity: vine.number(),
    price: vine.number().min(100),
  })
)
