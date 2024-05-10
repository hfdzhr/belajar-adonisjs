import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    quantity: vine.number(),
    price: vine.number().min(100),
  })
)

export const editProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    quantity: vine.number(),
    price: vine.number().min(100),
  })
)
