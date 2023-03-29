export interface Song {
    id: number,
    artist: string,
    title: string,
    genre: string,
    starred: boolean,
    created: number
}

export interface TableData {
    columns: string[],
    rows: Song[]
}

export interface Column {
    key: string,
    label: string
}