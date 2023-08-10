import { User } from '@/types'
import DatabaseService from '@/utilities/services/database'

export default class UserRepo extends DatabaseService<User> {
  constructor() {
    super()
  }

  async getAll(): Promise<User[]> {
    const result = await super.queryDB('SELECT * FROM users')
    console.log(result)
    return result.data
  }
}
