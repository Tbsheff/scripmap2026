export {};

declare global {
    interface Window {
        map: google.maps.Map;
        mapIsLoaded: boolean;
    }
}
