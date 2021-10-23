import httpRequest from "@/utils/httpRequest";

export default {
  getWarePagination(page, limit, key) {
    return httpRequest({
      url: `ware/wareinfo/pagination`,
      method: `get`,
      params: {page, limit, key}
    })
  },
  getById(id) {
    return httpRequest({
      url: `ware/wareinfo/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `ware/wareinfo`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `ware/wareinfo`,
      method: `put`,
      data
    })
  },
  delete(ids) {
    return httpRequest({
      url: `ware/wareinfo`,
      method: `delete`,
      data: ids
    })
  }
}
