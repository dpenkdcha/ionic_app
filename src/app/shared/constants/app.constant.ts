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

export enum QueryFormater {
    SELECT = '{"SELECT":[],"TABLE":"","WHERE":{},"ORDER_BY":[],"GROUP_BY":[]}',
    INSERT = '{"INSERT":{},"TABLE":""}',
    UPDATE = '{"UPDATE":{},"TABLE":"","WHERE":{}}',
    DELETE = '{"DELETE":{},"TABLE":"","WHERE":{}}',
    INSERTORUPDATE = '{"INSERTORUPDATE":{},"TABLE":"","WHERE":{}}',
}

export enum PopupFormater {
    Popup = '{"TITLE":"","BODY":"","BUTTON":[],"CONDITION":{}}'
}