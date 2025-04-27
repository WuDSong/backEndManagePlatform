
//查找
export type PostParam = {
    title: string,
    curPage: Number,
    pageSize: Number,
    total?: number
}

// 添加和修改
export type Post = {
    postId:string,
    title: string,
    content: string,
    authorId: string,
    boardId: string,
    createdAt: string,
    updatedAt: string,
    viewCount: number,
    likeCount: number,
    status: string,
    hasImages: boolean,
    coverImages?: null|[],
    topicIds?: null|[],
    topicList?: null|[]
}