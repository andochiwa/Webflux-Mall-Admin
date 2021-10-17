import httpRequest from "@/utils/httpRequest";

export default {
  getListPagination(page, limit, key) {
    return httpRequest({
      url: `product/attrgroup/pagination`,
      method: `get`,
      params: {
        page: page,
        limit: limit,
        key: key
      }
    })
  },
  deleteByIds(ids) {
    return httpRequest({
      url: `product/attrgroup`,
      method: `delete`,
      data: ids
    })
  },
  getById(id) {
    return httpRequest({
      url: `product/attrgroup/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `product/attrgroup`,
      method: `post`,
      data: data
    })
  },
  update(data) {
    return httpRequest({
      url: `product/attrgroup`,
      method: `put`,
      data: data
    })
  },
  deleteById(id) {
    return httpRequest({
      url: `product/attrgroup/${id}`,
      method: `delete`
    })
  }
}
