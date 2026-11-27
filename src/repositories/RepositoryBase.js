class RepositoryBase {
  constructor(model) {
    this.model = model
  }

  async findAll() {
    try {
      return await this.model.findAll()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async findOne(id) {
    try {
      return await this.model.findOne({ where: { id } })
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async create(entity) {
    try {
      return await this.model.create(entity)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async update(entity, id) {
    try {
      const [filas] = await this.model.update(entity, { where: { id } })
      return filas > 0 ? await this.findOne(id) : null
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async remove(id) {
    try {
      const filas = await this.model.destroy({ where: { id } })
      return filas > 0 ? { eliminado: true } : null
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default RepositoryBase