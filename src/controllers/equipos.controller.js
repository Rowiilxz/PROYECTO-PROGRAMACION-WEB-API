import repository from '../repositories/equipos.repository.js'

const sendResponse = (respuesta, message, errorCode, resp) => {
  if (!respuesta) return resp.status(errorCode).json({ success: false, message })
  return resp.status(200).json(respuesta)
}

const findAll = async (req, resp) =>
  sendResponse(await repository.findAll(), 'No se encontró.', 404, resp)

const findOne = async (req, resp) =>
  sendResponse(await repository.findOne(req.params.id), 'No se encontró.', 404, resp)

const create = async (req, resp) =>
  sendResponse(await repository.create(req.body), 'No se pudo crear.', 400, resp)

const update = async (req, resp) =>
  sendResponse(await repository.update(req.body, req.params.id), 'No se pudo actualizar.', 400, resp)

const remove = async (req, resp) =>
  sendResponse(await repository.remove(req.params.id), 'No se encontró.', 404, resp)

export default { findAll, findOne, create, update, remove }