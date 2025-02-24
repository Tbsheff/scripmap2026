/*======================================================================
 * FILE:    mapHelper.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Module for managing Google Maps API.
 */

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
import { GOOGLE_MAPS_API_KEY } from "./config.js";
import { DARK_MAP_ID, LIGHT_MAP_ID } from "./constants.js";
import { domNode, TAG_DIV } from "./html.js";
import { initializeGoogleMaps } from "./mapInitializer.js";
import { panAndZoom } from "./scriptures.js";
import { GeoPlace, GeoPlaces, Position } from "./types.js";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const CLASS_GEOPLACE_MARKER = "geoplace-marker";
const CLASS_LABEL = "label";
const CLASS_PIN = "pin";
const DEFAULT_MAP_TYPE_ID = "terrain";
const DEFAULT_POSITION: Position = { lat: 31.778407, lng: 35.234725 };
const DEFAULT_VIEW_ALTITUDE = 5000;
const DEFAULT_ZOOM = 8;
const ID_MAP_ELEMENT = "map";
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),'(.*)'\)/;
const VIEW_ALTITUDE_DEFAULT = 5000;
const VIEW_ALTITUDE_CONVERSION_RATIO = 591657550.5;
const VIEW_ALTITUDE_ZOOM_ADJUST = -2;
const ZOOM_RATIO = 450;

/*----------------------------------------------------------------------
 *                      PRIVATE VARIABLES
 */
let mapMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

/*----------------------------------------------------------------------
 *                      PRIVATE FUNCTIONS
 */
const boundsForCurrentMarkers = function (): google.maps.LatLngBounds {
    const bounds = new google.maps.LatLngBounds();

    mapMarkers.forEach((marker) => {
        if (marker.position) {
            bounds.extend(marker.position);
        }
    });

    return bounds;
};

const clearMapMarkers = function (): void {
    mapMarkers.forEach((marker) => {
        marker.map = null;
    });

    mapMarkers = [];
};

const createMap = async function (
    zoom: number,
    center: Position,
    mapTypeId: string,
    isDark: boolean
): Promise<void> {
    const mapElement = document.getElementById(ID_MAP_ELEMENT);

    if (mapElement) {
        window.map = new google.maps.Map(mapElement, {
            zoom,
            center,
            mapId: isDark ? DARK_MAP_ID : LIGHT_MAP_ID,
            mapTypeId,
            mapTypeControl: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        });

        window.mapIsLoaded = true;
    }
};

const createMapMarkers = function (geoplaces: GeoPlaces): void {
    Object.values(geoplaces).forEach((geoplace) => {
        const markerContent = domNode(TAG_DIV, CLASS_GEOPLACE_MARKER);

        markerContent.appendChild(domNode(TAG_DIV, CLASS_PIN));
        markerContent.appendChild(domNode(TAG_DIV, CLASS_LABEL, undefined, geoplace.placename));

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: window.map,
            position: { lat: geoplace.latitude, lng: geoplace.longitude },
            title: geoplace.placename,
            content: markerContent
        });

        mapMarkers.push(marker);
    });
};

const extractGeoplaces = function (): GeoPlaces {
    const uniqueGeoplaces: GeoPlaces = {};
    const placeLinks = document.querySelectorAll("a[onclick^='showLocation('");

    placeLinks.forEach((placeLink) => {
        const onclickAttribute = placeLink.getAttribute("onclick");

        if (onclickAttribute) {
            const matches = LAT_LON_PARSER.exec(onclickAttribute);

            if (matches) {
                const [_, __, name, latitude, longitude, viewAltitude, flag] = matches;

                let placename = placenameWithFlag(name, flag);

                const key = `${latitude}|${longitude}`;
                const value = {
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    placename,
                    viewAltitude: Number(viewAltitude)
                };

                if (uniqueGeoplaces[key] !== undefined) {
                    mergePlacename(uniqueGeoplaces[key], name);
                } else {
                    uniqueGeoplaces[key] = value;
                }
            }
        }
    });

    return uniqueGeoplaces;
};

const firstAltitude = function (geoplaces: GeoPlaces): number {
    // Return the first viewAltitude we can find in the dictionary

    const keys = Object.keys(geoplaces);

    if (keys.length > 0) {
        return geoplaces[keys[0]].viewAltitude;
    }

    return DEFAULT_VIEW_ALTITUDE;
};

const mergePlacename = function (geoplace: GeoPlace, name: string): void {
    if (!geoplace.placename.includes(name)) {
        geoplace.placename += `, ${name}`;
    }
};

const placenameWithFlag = function (name: string, flag?: string): string {
    let placename = name;

    if (flag && flag.length > 0) {
        placename += ` ${flag}`;
    }

    return placename;
};

const updateMarkers = function (geoplaces: GeoPlaces): void {
    if (!window.mapIsLoaded) {
        // Call this function again in half a second
        window.setTimeout(() => {
            updateMarkers(geoplaces);
        }, 500);

        return;
    }

    clearMapMarkers();
    createMapMarkers(geoplaces);
    zoomMapToFitMarkers(firstAltitude(geoplaces));
};

const zoomLevelForAltitude = function (viewAltitude: number): number {
    let zoomLevel = viewAltitude / ZOOM_RATIO;

    if (viewAltitude !== VIEW_ALTITUDE_DEFAULT) {
        zoomLevel =
            Math.log2(VIEW_ALTITUDE_CONVERSION_RATIO / viewAltitude) + VIEW_ALTITUDE_ZOOM_ADJUST;
    }

    return zoomLevel;
};

const zoomMapToFitMarkers = function (viewAltitude: number): void {
    if (mapMarkers.length > 0) {
        if (mapMarkers.length === 1 && viewAltitude) {
            const marker = mapMarkers[0];

            zoomToOneMarker(marker, viewAltitude);
        } else {
            zoomToFitMarkerBounds();
        }
    }
};

const zoomToFitMarkerBounds = function (): void {
    const bounds = boundsForCurrentMarkers();

    window.map.panTo(bounds.getCenter());
    window.map.fitBounds(bounds);
};

const zoomToOneMarker = function (
    marker: google.maps.marker.AdvancedMarkerElement,
    viewAltitude: number
): void {
    if (marker.position) {
        const lat =
            typeof marker.position.lat === "number" ? marker.position.lat : marker.position.lat();
        const lng =
            typeof marker.position.lng === "number" ? marker.position.lng : marker.position.lng();

        panAndZoom(lat, lng, viewAltitude);
    }
};

/*----------------------------------------------------------------------
 *                      PUBLIC FUNCTIONS
 */
export const mapInit = async function () {
    initializeGoogleMaps({
        key: GOOGLE_MAPS_API_KEY,
        v: "quarterly"
    });

    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("marker");

    let isDark = false;

    if (typeof window.matchMedia === "function") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            isDark = true;
        }

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
            const zoom = window.map.getZoom() ?? DEFAULT_ZOOM;
            const mapTypeId = window.map.getMapTypeId() ?? DEFAULT_MAP_TYPE_ID;
            const centerLatLng = window.map.getCenter();
            let center: Position;

            if (centerLatLng) {
                center = { lat: centerLatLng.lat(), lng: centerLatLng.lng() };
            } else {
                center = DEFAULT_POSITION;
            }

            createMap(zoom, center, mapTypeId, event.matches);
        });
    }

    createMap(DEFAULT_ZOOM, DEFAULT_POSITION, DEFAULT_MAP_TYPE_ID, isDark);
};

export const showLocation = function (lat: number, lng: number, viewAltitude: number): void {
    window.map.panTo({ lat, lng });
    window.map.setZoom(zoomLevelForAltitude(viewAltitude));
};

export const setupMarkers = function (): void {
    updateMarkers(extractGeoplaces());
};
