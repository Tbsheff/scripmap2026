import { ShowLocationFunction } from "./Types";

declare global {
	interface Window {
		showLocation?: ShowLocationFunction;
	}
}
