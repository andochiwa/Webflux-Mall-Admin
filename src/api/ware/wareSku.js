import httpRequest from "@/utils/httpRequest";

export default {
  getPagination(page, limit, skuId, wareId) {
    return httpRequest({
      url: `ware/waresku/pagination`,
      method: `get`,
      params: {page, limit, skuId, wareId}
    })
  },
  getById(id) {
    return httpRequest({
      url: `ware/waresku/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `ware/waresku`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `ware/waresku`,
      method: `put`,
      data
    })
  },
  delete(ids) {
    return httpRequest({
      url: `ware/waresku`,
      method: `delete`,
      data: ids
    })
  }
}
