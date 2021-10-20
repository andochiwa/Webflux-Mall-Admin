import httpRequest from "@/utils/httpRequest";

export default {
  getAttrByGroup(groupId) {
    return httpRequest({
      url: `product/attrgrouprelation/${groupId}/attr`,
      method: `get`
    })
  }
}
