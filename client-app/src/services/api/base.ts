export class BaseApi {
    static async get(url: string, options: any = {}): Promise<Response> {
        let response = fetch(`/api/${url}`, options).then((response) => BaseApi.addAuthorizationHeader(response, options));
        response.catch((error) => BaseApi.errorHandling(error));
        return response;
    }

    static async post(url: string, data?: any, options: any = {}): Promise<Response> {
        let response = fetch(`/api/${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            ...options,
        }).then((response) => BaseApi.addAuthorizationHeader(response, options));
        response.catch((error) => BaseApi.errorHandling(error));
        return response;
    }

    static async put(url: string, data: any, options: any = {}): Promise<Response> {
        let response = fetch(`/api/${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            ...options,
        }).then((response) => BaseApi.addAuthorizationHeader(response, options));
        response.catch((error) => BaseApi.errorHandling(error));
        return response;
    }

    static async delete(url: string, options: any = {}): Promise<Response> {
        let response = fetch(`/api/${url}`, {
            method: "DELETE",
            ...options,
        }).then((response) => BaseApi.addAuthorizationHeader(response, options));
        response.catch((error) => BaseApi.errorHandling(error));
        return response;
    }

    static addAuthorizationHeader(response: Response, options: any): Response {
        if(response.status === 401 && window.location.pathname !== "/auth" && options?.ignoreAuth !== true) {
            console.log("Unauthorized");
        }
        return response;
    }

    static async errorHandling(error: any): Promise<void> {
        console.log(error);
    }

    static async getTextOrJson(response: Response): Promise<any> {
        let contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    }
}