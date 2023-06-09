import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NotFoundException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(404).json({
      message: error.message
    })
  }
}
