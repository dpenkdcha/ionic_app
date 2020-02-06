export enum ServletURL {
    baseUrl = 'http://localhost:8080/iRecruit'
}

export enum SERVICE_URL {
    baseUrl = 'http://localhost:8080/iRecruit'
}

export enum ServiceMapping {
    
}

export enum ServiceType {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT'
}
export class UrlOptions {
    queryParams?: any;
    body?: any;
    pathParam?: any;
    contentType?: string;
}

export enum IdentifyPlatform {
    Android = 'ANDROID',
    IOS = 'IOS',
    Web = 'WEB'
}

