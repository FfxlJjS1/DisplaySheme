export class CommunicationWithServer {
    static schemeApi = "api/Scheme";
    
    static async GetRequest(request) {
        const response = await fetch(request);

        if (response.ok) {
            const data = await response.json();

            return data;
        }

        return null;
    }

    static async GetTipNpoTable() {
        const data = this.GetRequest(this.schemeApi + "/GetTipNpoTable");

        return data;
    }

    static async GetParentInjectionOutList() {
        const data = this.GetRequest(this.schemeApi + "/GetParentInjectionOutList");

        return data;
    }

    static async GetInjectionInOutClassification() {
        const data = this.GetRequest(this.schemeApi + "/GetInjectionInOutClassification");

        return data;
    }
    
    static async GetInjectionOutTreeTable(productParkId) {
        const data = this.GetRequest(this.schemeApi + "/GetInjectionOutTreeTable?productParkId=" + productParkId
            + "&selectedTipNpoIdsString=1;2;3;4;5;6;7;10;11;12;13;14;16;25;26;27");

        return data;
    }

    static async GetObjectFullInfo(objectId) {
        const data = this.GetRequest(this.schemeApi + "/GetObjectInfo?objectId=" + objectId);

        return data;
    }
}