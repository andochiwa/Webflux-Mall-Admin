import httpRequest from "@/utils/httpRequest";

export default {
  getPagination(page, limit, key) {
    return httpRequest({
      url: `ware/wareordertask/pagination`,
      method: `get`,
      params: {page, limit, key}
    })
  },
  getById(id) {
    return httpRequest({
      url: `ware/wareordertask/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `ware/wareordertask`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `ware/wareordertask`,
      method: `put`,
      data
    })
  },
  delete(ids) {
    return httpRequest({
      url: `ware/wareordertask`,
      method: `delete`,
      data: ids
    })
  }
}
