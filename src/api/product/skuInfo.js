import httpRequest from "@/utils/httpRequest";

export default {
  getListOnConditions(page, limit, key, catelogId, brandId, min, max) {
    return httpRequest({
      url: `product/skuinfo/pagination`,
      method: `get`,
      params: {page, limit, key, catelogId, brandId, min, max}
    })
  }
}
