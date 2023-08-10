import { DatabaseResponse, User } from '@/types'
import DatabaseService from '@/utilities/services/database'

export default class UserRepo extends DatabaseService {
  constructor() {
    super()
  }

  async getAll(): Promise<DatabaseResponse<User[]>> {
    const result: DatabaseResponse<User[]> = await super.queryDB<User[]>(
      'SELECT * FROM users'
    )
    return result
  }

  async getById(id: number): Promise<DatabaseResponse<User>> {
    const result: DatabaseResponse<User> = await super.queryDBWithValues<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result
  }
}
