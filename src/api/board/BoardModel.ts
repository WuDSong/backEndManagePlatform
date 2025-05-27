//board
export type Board = {
    boardId?: string,  
    name: string,
    icon?: string,
    description: string,
    sortOrder?: number,
    parentId?:string,
    status?:string|null,
    creatorId?:string,
    children?:Array<Board>,
    postCount?:number
}

export type changeBoardParam={
    boardId?: string,  
    name: string,
    icon: string,
    description: string,
    sortOrder?: number,
    parentId?:string,
    status?:string,
}

//board查找
export type BoardParam={
    name: string,
    curPage:Number,
    pageSize:Number,
    total?:number
}