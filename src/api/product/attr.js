import httpRequest from "@/utils/httpRequest";

export default {
  getBaseAttrList(type, catelogId, page, limit, key = null) {
    return httpRequest({
      url: `/product/attr/${type}/list/${catelogId}`,
      method: `get`,
      params: {page, limit, key}
    })
  },
  save(data) {
    return httpRequest({
      url: `product/attr`,
      method: `post`,
      data
    })
  },
  update(data) {
    return httpRequest({
      url: `product/attr`,
      method: `put`,
      data
    })
  },
  getAttrInfo(attrId) {
    return httpRequest({
      url: `product/attr/${attrId}`,
      method: `get`
    })
  },
  delete(attrIds) {
    return httpRequest({
      url: `product/attr`,
      method: `delete`,
      data: attrIds
    })
  },
  deleteGroupRelation(attrId, attrGroupId) {
    return httpRequest({
      url: `product/attr/attrgroup/relation`,
      method: `delete`,
      data: {attrId, attrGroupId}
    })
  },
  getBaseAttrValueBySpuId(spuId) {
    return httpRequest({
      url: `product/attr/base/spu/${spuId}`,
      method: `get`
    })
  },
  updateAttrValue(spuId, data) {
    return httpRequest({
      url: `product/attr/update/${spuId}`,
      method: `put`,
      data
    })
  }
}
