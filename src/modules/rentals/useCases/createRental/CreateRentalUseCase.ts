import { inject, injectable } from 'tsyringe'

import { Rental } from '@modules/rentals/entities/Rental'
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  user_id: string
  car_id: string
  expected_return_date: Date
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumHoursToRentalCar = 24

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(
      car_id
    )

    if (carUnavailable) throw new AppError('Car is unavailable')

    const rentalOpenToUser =
      await this.rentalsRepository.findOpenRentalByUserId(user_id)

    if (rentalOpenToUser)
      throw new AppError("There's a rental in progress for this user")

    const dateNow = this.dateProvider.dateNow()
    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    )

    if (compare < minimumHoursToRentalCar)
      throw new AppError('Invalid return time')

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    })

    return rental
  }
}

export { CreateRentalUseCase }
