import httpRequest from "@/utils/httpRequest";

export default {
  getList(page, limit, key) {
    return httpRequest({
      url: `member/memberlevel/pagination`,
      method: `get`,
      params: {page, limit, key}
    })
  },
  save(data) {
    return httpRequest({
      url: `member/memberlevel`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `member/memberlevel`,
      method: `put`,
      data
    })
  },
  getById(id) {
    return httpRequest({
      url: `member/memberlevel/${id}`,
      method: `get`
    })
  },
  delete(ids) {
    return httpRequest({
      url: `member/memberlevel`,
      method: `delete`,
      data: ids
    })
  }
}
