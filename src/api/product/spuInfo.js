import httpRequest from "@/utils/httpRequest";

export default {
  saveFullReduction(data) {
    return httpRequest({
      url: `product/spuinfo`,
      method: `post`,
      data
    })
  },
}
