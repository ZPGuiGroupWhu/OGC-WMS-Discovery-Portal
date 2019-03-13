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
    geoLocation: number[];
    id: number;
    ip: string;
    keywords: string;
    layer: object[];
    title: string;
    url: string;
    version: string;
}

// layers of each service in ServiceInfo component
export interface ILayer{
    abstr: string;
    attribution: string;
    bbox: number[][];
    id: number;
    imagepath: string;
    keywords: string;
    name: string;
    projection: string;
    title: string;
    url: string;
}

// service list request body interface
export interface IQueryPar{
    bound: number[];
    continent: string;
    keywords: string; 
}

// service list request par interface,also is the page info of the list and pagination
export interface IPageInfo{
    pageNum: number;
    pageSize: number;
}