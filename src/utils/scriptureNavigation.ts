import { Book, Books, Volume } from "../Types";

let bookSlugMap: Map<string, Book> | null = null;
let volumeSlugMap: Map<string, Volume> | null = null;

export function initSlugMaps(volumes: Volume[], books: Books): void {
    volumeSlugMap = new Map(volumes.map((v) => [v.urlPath, v]));
    bookSlugMap = new Map(Object.values(books).map((b) => [b.urlPath, b]));
}

export function bookBySlug(slug: string): Book | undefined {
    return bookSlugMap?.get(slug);
}

export function volumeBySlug(slug: string): Volume | undefined {
    return volumeSlugMap?.get(slug);
}
