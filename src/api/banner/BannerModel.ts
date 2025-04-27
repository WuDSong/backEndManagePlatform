//Banner 添加时主要要有title，imageUrl
export type Banner = {
    id?: string,
    title: string,
    imageUrl?: string,
    sortOrder?: number,
    startTime?: string|null,
    endTime?: string|null,
    isActive?: boolean,
    extData?: string,
    postId?: string|null
}


//Banner查找
export type BannerParam = {
    name: string,
    curPage: Number,
    pageSize: Number,
    total?: number
}