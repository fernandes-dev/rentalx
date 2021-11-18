import { AppError } from '@errors/AppError'
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { UserType } from '@modules/accounts/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { hash } from 'bcrypt'
import { inject, injectable } from 'tsyringe'

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    email,
    password,
    driver_license,
  }: ICreateUserDTO): Promise<UserType> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) throw new AppError('User already exists')

    const passwordHash = await hash(password, 8)

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      driver_license,
    })

    return user
  }
}

export { CreateUserUseCase }
