import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase'

class CreateSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, description } = request.body

      const createSpecificationUseCase = container.resolve(
        CreateSpecificationUseCase
      )

      const specification = await createSpecificationUseCase.execute({
        name,
        description,
      })

      return response.status(201).json({ specification })
    } catch (error) {
      return response
        .status(400)
        .json({ error: error instanceof Error ? error.message : error })
    }
  }
}

export { CreateSpecificationController }
