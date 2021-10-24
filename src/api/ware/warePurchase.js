import httpRequest from "@/utils/httpRequest";

export default {
  getOnConditions(page, limit, key, status) {
    return httpRequest({
      url: `ware/purchase/pagination`,
      method: `get`,
      params: {page, limit, key, status}
    })
  },
  getById(id) {
    return httpRequest({
      url: `ware/purchase/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `ware/purchase`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `ware/purchase`,
      method: `put`,
      data
    })
  },
  delete(ids) {
    return httpRequest({
      url: `ware/purchase`,
      method: `delete`,
      data: ids
    })
  }
}
