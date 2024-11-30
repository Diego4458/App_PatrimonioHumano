type ApiResponseStructure<T> = {
    Message: {
        Title: string | null,
        Content: string
    },
    Content: T
}

export default ApiResponseStructure;