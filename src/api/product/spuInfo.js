import httpRequest from "@/utils/httpRequest";

export default {
  saveFullReduction(data) {
    return httpRequest({
      url: `product/spuinfo`,
      method: `post`,
      data
    })
  },
  getOnConditions(page, limit, key, catelogId, brandId, status, order, sortField) {
    return httpRequest({
      url: `product/spuinfo/pagination`,
      method: `get`,
      params: {page, limit, key, catelogId, brandId, status, order, sortField }
    })
  }
}
