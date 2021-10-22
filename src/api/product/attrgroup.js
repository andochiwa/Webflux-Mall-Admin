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
  getListPaginationByCategoryId(page, limit, key, categoryId) {
    return httpRequest({
      url: `product/attrgroup/pagination/${categoryId}`,
      method: `get`,
      params: {
        page, limit, key
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
  },
  getAttrRelation(groupId) {
    return httpRequest({
      url: `product/attrgroup/${groupId}/attr`,
      method: `get`
    })
  },
  getNoAttrRelation(groupId, page, limit, key) {
    return httpRequest({
      url: `product/attrgroup/${groupId}/no-attr`,
      method: `get`,
      params: {page, limit, key}
    })
  },
  saveAllAttrRelation(attrGroupRelation) {
    return httpRequest({
      url: `product/attrgroup/attr`,
      method: `post`,
      data: attrGroupRelation
    })
  }
}
