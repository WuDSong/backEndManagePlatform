//board
export type Board = { 
    boardId?: string,  
    name: string,
    icon?: string,
    description: string,
    sortOrder?: string
}

//board查找
export type BoardParam={
    name: string,
    curPage:Number,
    pageSize:Number,
    total?:number
}