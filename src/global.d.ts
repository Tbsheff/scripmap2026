import { ShowLocationFunction } from "./Types";

export {};

declare global {
    interface Window {
        showLocation?: ShowLocationFunction;
    }
}
