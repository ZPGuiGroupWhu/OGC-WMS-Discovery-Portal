// menu item variable type
export interface IMenu{
    name: string;
    icon: string;
    children: object[];
}

// submenu item variable type
export interface ISubMenu{
    name: string;
    count: number;
}

// service item variable type
export interface IServ{
    id: string;
    title : string;
    url : string;
    Rank : number; // 
    ResponseTime: string; //
    Image : string; //
    Abstract : string; // 
    keywords : string;
    administrative_unit: string;
    GeoLocation : number[]; //
}

// service list request body interface
export interface IBody{
    keywords: string;
    bound: number[];
}

// service list request par interface, also is the page info of the list and pagination
export interface IPageInfo{
    page: number;
    size: number;
}