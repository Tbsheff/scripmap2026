/*======================================================================
 * FILE:    MapHelper.ts
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2025
 *
 * DESCRIPTION: Module to support the Google Maps API.
 */

import { GeoPlaces, GeoPlace } from "../Types";

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const LAT_LON_PARSER = /showLocation\((.*),'(.*)',(.*),(.*),(.*),'(.*)'\)/g;

/*----------------------------------------------------------------------
 *                      PRIVATE FUNCTIONS
 */
// const boundsForCurrentMarkers = function (): google.maps.LatLngBounds {
//     const bounds = new google.maps.LatLngBounds();

//     mapMarkers.forEach((marker) => {
//         if (marker.position) {
//             bounds.extend(marker.position);
//         }
//     });

//     return bounds;
// };

export const extractGeoplaces = function (html: string): GeoPlaces {
    const uniqueGeoplaces: GeoPlaces = {};

    try {
        for (const match of html.matchAll(LAT_LON_PARSER)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, __, name, latitude, longitude, viewAltitude, flag] = match;
            const placename = placenameWithFlag(name, flag);
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
    } catch (error) {
        console.error("Error parsing location data:", error);
        throw error;
    }

    return uniqueGeoplaces;
};

// const firstAltitude = function (geoplaces: GeoPlaces): number {
//     // Return the first viewAltitude we can find in the dictionary

//     const keys = Object.keys(geoplaces);

//     if (keys.length > 0) {
//         return geoplaces[keys[0]].viewAltitude;
//     }

//     return DEFAULT_VIEW_ALTITUDE;
// };

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

// const zoomLevelForAltitude = function (viewAltitude: number): number {
//     let zoomLevel = viewAltitude / ZOOM_RATIO;

//     if (viewAltitude !== VIEW_ALTITUDE_DEFAULT) {
//         zoomLevel =
//             Math.log2(VIEW_ALTITUDE_CONVERSION_RATIO / viewAltitude) + VIEW_ALTITUDE_ZOOM_ADJUST;
//     }

//     return zoomLevel;
// };

// const zoomMapToFitMarkers = function (viewAltitude: number): void {
//     if (mapMarkers.length > 0) {
//         if (mapMarkers.length === 1 && viewAltitude) {
//             const marker = mapMarkers[0];

//             zoomToOneMarker(marker, viewAltitude);
//         } else {
//             zoomToFitMarkerBounds();
//         }
//     }
// };

// const zoomToFitMarkerBounds = function (): void {
//     const bounds = boundsForCurrentMarkers();

//     window.map.panTo(bounds.getCenter());
//     window.map.fitBounds(bounds);
// };

// const zoomToOneMarker = function (
//     marker: google.maps.marker.AdvancedMarkerElement,
//     viewAltitude: number
// ): void {
//     if (marker.position) {
//         const lat =
//             typeof marker.position.lat === "number" ? marker.position.lat : marker.position.lat();
//         const lng =
//             typeof marker.position.lng === "number" ? marker.position.lng : marker.position.lng();

//         panAndZoom(lat, lng, viewAltitude);
//     }
// };

// export const showLocation = function (lat: number, lng: number, viewAltitude: number): void {
//     window.map.panTo({ lat, lng });
//     window.map.setZoom(zoomLevelForAltitude(viewAltitude));
// };
