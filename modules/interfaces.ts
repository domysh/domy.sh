import { Binary } from "mongodb"

export type LinkObject = {
    _id: string
    name: string
    icon: string
    color: string
    url: string
}

export type MetaInfo = {
    name: string
    description: string
    site_name: string
    footer: string
    header_img?: string
    profile_img?: string
}

export type Page = {
    _id: string
    name: string
    description: string
    content: string
    highlighted: boolean
}

export type Category = {
    _id: string
    name: string
    description: string
    highlighted: boolean
    icon: string
    color: string
}

export type Post = {
    _id: string
    title: string
    description: string
    category: string
    image?: string
    date: string
    star: boolean
    end_date: string
    showMonth?: boolean
}

export type PageInfo = {
    name: string
    path: string
    highlighted: boolean
}

export type PublicInfo = {
    meta: MetaInfo
    links: LinkObject[]
    pages: PageInfo[]
    categories: Category[]
    publicurl: string
}

export type FileInfo = {
    filename: string
    _id: string
}

export type FileContent = {
    content: Binary
} & FileInfo

export type AdminInfos = [
    Post[],
    Page[],
    LinkObject[],
    Category[],
    FileInfo[]
]

