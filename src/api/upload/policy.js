import httpRequest from "@/utils/httpRequest";

export default {
  getPolicy() {
    return httpRequest({
      url: `third-party/oss/policy`,
      method: `get`
    })
  }
}
