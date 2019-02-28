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

// service item variable type
export interface IServ{
    Abstract : string; // 
    administrative_unit: string;
    GeoLocation : number[]; //
    id: string;
    Image : string; //
    keywords : string;
    Rank : number; // 
    ResponseTime: string; //
    title : string;
    url : string;
}

// service list request body interface
export interface IBody{
    bound: number[];
    keywords: string; 
}

// service list request par interface, also is the page info of the list and pagination
export interface IPageInfo{
    page: number;
    size: number;
}