import httpRequest from "@/utils/httpRequest";

export default {
  getList(page, limit, key) {
    return httpRequest({
      url: `member/member/pagination`,
      method: `get`,
      params: {page, limit, key}
    })
  },
  save(data) {
    return httpRequest({
      url: `member/member`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `member/member`,
      method: `put`,
      data
    })
  },
  getById(id) {
    return httpRequest({
      url: `member/member/${id}`,
      method: `get`
    })
  },
  delete(ids) {
    return httpRequest({
      url: `member/member`,
      method: `delete`,
      data: ids
    })
  }
}
