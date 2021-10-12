import httpRequest from '@/utils/httpRequest'

export default {
  getTreeData() {
    return httpRequest({
      url: `product/category`,
      method: `get`
    })
  }
}
