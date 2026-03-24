import type { Books, Volume } from "./Types";

export function replaceEntities(text: string): string {
	return text.replaceAll("&mdash;", "\u2014").replaceAll("&amp;", "&");
}

export function conditionallyReplace(obj: Record<string, unknown>, props: string[]): void {
	for (const prop of props) {
		const property = obj[prop];

		if (typeof property === "string") {
			if (property.includes("&")) {
				obj[prop] = replaceEntities(property);
			}
		}
	}
}

export function replaceHtmlEntities(volumesData: Volume[], booksData: Books): void {
	for (const volume of volumesData) {
		conditionallyReplace(volume as unknown as Record<string, unknown>, ["citeAbbr"]);
	}

	for (const bookId of Object.keys(booksData)) {
		conditionallyReplace(booksData[bookId] as unknown as Record<string, unknown>, [
			"backName",
			"citeAbbr",
			"citeFull",
			"fullName",
			"gridName",
			"subdiv",
			"tocName",
		]);
	}
}
