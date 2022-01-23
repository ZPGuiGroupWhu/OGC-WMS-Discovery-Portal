// menu item variable type
export interface IMenu{
    children: object[];
    icon: string;
    name: string;
}

// submenu item variable type
export interface ISubMenu{
    count: number;
    name: string;
}

// individual service type in serviceInfo component
export interface IServInfo{
    abstr: string;
    administrative_unit: string;
    contact_info: {
        address: string,
        administrative_unit: string,
        city: string,
        email: string,
        fascimile_tel: string,
        organization: string,
        person: string,
        position: string,
        post_code: string,
        state_province: string,
        voice_tel: string
    },
    geoLocation: number[];
    id: number;
    ip: string;
    keywords: string;
    layers: ILayer[];
    title: string;
    topic: string;
    url: string;
    version: string;
}

// layers of each service in ServiceInfo component
export interface ILayer{
    abstr: string;
    attribution: string;
    bbox: number[][];
    id: number;
    keywords: string;
    name: string;
    // opt: false; // describe whether the layer is selected or not
    photo: string;
    projection: string;
    title: string;
    topic: string;
    url: string;
    service: object;
}

// service list request body interface
export interface IQueryPar{
    bound: number[];
    continent: string;
    keywords: string;
    organization: string;
    organization_type: string; 
    topic: string;
    // In order to reduce time cost and request number, it's necessary to distinguish query type(service or layers). 
    // Define 0: query service, 1: query layers.
    // type: number;
}

// service list request par interface,also is the page info of the list and pagination
export interface IPageInfo{
    pageNum: number;
    pageSize: number;
}