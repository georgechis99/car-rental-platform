export interface ICategory{
    id: number;
    name: string;
    pictureUrl: string;
}

export interface ICategoryForCheckboxFilter{
    id: number;
    name: string;
    pictureUrl: string;
    isChecked: boolean;
}
