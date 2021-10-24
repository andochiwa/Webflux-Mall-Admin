import httpRequest from "@/utils/httpRequest";

export default {
  getOnConditions(page, limit, wareId, status) {
    return httpRequest({
      url: `ware/purchasedetail/pagination`,
      method: `get`,
      params: {page, limit, wareId, status}
    })
  },
  getById(id) {
    return httpRequest({
      url: `ware/purchasedetail/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `ware/purchasedetail`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `ware/purchasedetail`,
      method: `put`,
      data
    })
  },
  delete(ids) {
    return httpRequest({
      url: `ware/purchasedetail`,
      method: `delete`,
      data: ids
    })
  }
}
