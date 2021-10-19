import httpRequest from '@/utils/httpRequest'

export default {
  getTreeData() {
    return httpRequest({
      url: `product/categorybrandrelation`,
      method: `get`
    })
  },
  deleteById(id) {
    return httpRequest({
      url: `product/categorybrandrelation/${id}`,
      method: `delete`
    })
  },
  save(data) {
    return httpRequest({
      url: `product/categorybrandrelation`,
      method: `post`,
      data: data
    })
  },
  update(data) {
    return httpRequest({
      url: `product/categorybrandrelation`,
      method: `put`,
      data: data
    })
  },
  deleteAll(ids) {
    return httpRequest({
      url: `product/categorybrandrelation`,
      method: `delete`,
      data: ids
    })
  },
  getCatelogList(brandId) {
    return httpRequest({
      url: `product/categorybrandrelation/catelog/${brandId}`,
      method: `get`,
    })
  }
}
