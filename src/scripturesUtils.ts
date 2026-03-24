import type { Books, Volume } from "./Types";

export function replaceEntities(text: string): string {
	return text.replaceAll("&mdash;", "\u2014").replaceAll("&amp;", "&");
}

export function conditionallyReplace(obj: Record<string, unknown>, props: string[]): void {
	props.forEach((prop) => {
		const property = obj[prop];

		if (typeof property === "string") {
			if (property.includes("&")) {
				obj[prop] = replaceEntities(property);
			}
		}
	});
}

export function replaceHtmlEntities(volumesData: Volume[], booksData: Books): void {
	volumesData.forEach((volume) => {
		conditionallyReplace(volume as unknown as Record<string, unknown>, ["citeAbbr"]);
	});

	Object.keys(booksData).forEach((bookId) => {
		conditionallyReplace(booksData[bookId] as unknown as Record<string, unknown>, [
			"backName",
			"citeAbbr",
			"citeFull",
			"fullName",
			"gridName",
			"subdiv",
			"tocName",
		]);
	});
}
