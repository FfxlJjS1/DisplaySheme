export class CommunicationWithServer {
    static schemeApi = "api/Scheme"
    
    static async GetRequest(request) {
        const response = await fetch(request);

        if (response.ok) {
            const data = await response.json();

            return data;
        }

        return null;
    }

    static async GetTopProductParkList() {
        const data = this.GetRequest(this.schemeApi);

        return data;
    }

    static async GetProductParkTreeTable(productParkId) {
        const data = this.GetRequest(this.schemeApi + "/GetProductParkTree?productParkId=" + productParkId);

        return data;
    }

    static async GetObjectFullInfo(objectId) {
        const data = this.GetRequest(this.schemeApi + "/GetObjectInfo?objectId=" + objectId);

        return data;
    }
}