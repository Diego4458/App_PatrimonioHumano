import PaginationMetaStructure from "./PaginationMetaStructure";

type PaginationResponseStructure<T> = {
    Message: {
        Title: string | null,
        Content: string
    },
    Content: {
        Meta: PaginationMetaStructure,
        Data: T[]
    }
}

export default PaginationResponseStructure;