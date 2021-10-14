import httpRequest from '@/utils/httpRequest'

export default {
  getTreeData() {
    return httpRequest({
      url: `product/category`,
      method: `get`
    })
  },
  deleteById(id) {
    return httpRequest({
      url: `product/category/${id}`,
      method: `delete`
    })
  }
}
