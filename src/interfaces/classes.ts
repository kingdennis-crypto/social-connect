export default interface Repository<T> {
  getAll(): Promise<T | T[]>
}
