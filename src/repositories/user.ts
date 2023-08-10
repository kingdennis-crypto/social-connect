import { User } from '@/types/models'
import Repository from '@/interfaces/classes'
import DatabaseService from '@/utilities/services/database'

export default class UserRepo
  extends DatabaseService
  implements Repository<User>
{
  constructor() {
    super()
  }

  async getAll(): Promise<User[]> {
    const result = await super.queryDB('SELECT * FROM users')
    return result
  }
}
