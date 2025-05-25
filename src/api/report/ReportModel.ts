export type MyCommentReport={
    reportId:string,
    commentId:string,
    status:string,
    handledBy:string,
    result:string
}

export type MyPostReport={
    reportId:string,
    postId?:string,
    status:string,
    handledBy:string,
    result:string
}

export type MyReport={
    reportId:string,
    status:string,
    handledBy:string,
    result:string
}