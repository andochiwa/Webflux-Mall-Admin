import httpRequest from "@/utils/httpRequest";

export default {
  getListPagination(page, limit, key) {
    return httpRequest({
      url: `product/brand/pagination`,
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
      url: `product/brand`,
      method: `delete`,
      data: ids
    })
  },
  getById(id) {
    return httpRequest({
      url: `product/brand/${id}`,
      method: `get`
    })
  },
  save(data) {
    return httpRequest({
      url: `product/brand`,
      method: `post`,
      data: data
    })
  },
  update(data) {
    return httpRequest({
      url: `product/brand`,
      method: `put`,
      data: data
    })
  }
}
