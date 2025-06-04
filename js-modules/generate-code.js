export default function generateCode(stops, routes) {
   const structs = `#ifndef COORDINATES_H
#define COORDINATES_H

#include <Arduino.h>
#include <EEPROM.h>

struct Stop {
    float lat;
    float lon;
    uint8_t audioNum;
    uint8_t radius;
};

struct Route {
    uint8_t dispNum;
    uint8_t stopsNum;
    uint16_t* steStops;
    uint16_t* etsStops;
};\n\n`;

    const {r: stopsArrCode, i: stopIndexes} = generateStopsArr(stops);
    const routesCode = generateRoutesCode(routes, stopIndexes);
    const classCode = generateClassCode();

    return structs + stopsArrCode + routesCode + classCode;
}

function generateStopsArr(stops) {
    let resultText = `const Stop stops[] PROGMEM = {
    {0, 0, 0, 0}, // 0 - empty stop (no stop)\n`;
    const indexes = {};

    stops.forEach((stop, index) => {
        resultText += `    {${stop.lat}, ${stop.lon}, ${stop.audioTrackNumber}, ${stop.radius}}, // ${index+1} - ${stop.name}\n`;
        indexes[stop.id] = index;
    });
    resultText += "};\n\n"

    return {r: resultText, i: indexes};
}

function generateRoutesCode(routes, stopIndexes) {
    let maxStops = 0;
    let progmemArrsText = '';

    let routesArrText = `#define ROUTES_NUM ${routes.length}
const Route routes[] PROGMEM = {\n`;

    routes.forEach((route, index) => {
        if(route.stops.length > maxStops) maxStops = route.stops.length;

        progmemArrsText += `// (${route.displayNumber}) ${route.name}\n`;
        let steArrText = `const uint16_t route${index}_ste[] PROGMEM = {`;
        let etsArrText = `const uint16_t route${index}_ets[] PROGMEM = {`;

        route.stops.forEach(stopRow => {
            if(stopRow[0] === '0') {
                steArrText += `0, `;
            } else {
                steArrText += `${stopIndexes[stopRow[0]]+1}, `;
            }

            if(stopRow[1] === '0') {
                etsArrText += `0, `;
            } else {
                etsArrText += `${stopIndexes[stopRow[1]]+1}, `;
            }
        });

        progmemArrsText += steArrText.slice(0, -2) + '};\n'
        progmemArrsText += etsArrText.slice(0, -2) + '};\n\n'
        
        routesArrText += `    {${route.displayNumber}, ${route.stops.length}, route${index}_ste, route${index}_ets}, // ${index} - (${route.displayNumber}) ${route.name}\n`;
        
    });
    routesArrText += "};\n\n"
    
    const maxStopsDefine = `#define STOPS_MAX ${maxStops}\n`;

    return maxStopsDefine + progmemArrsText + routesArrText;
}

function generateClassCode() {
    let resultText = `class Coordinates {
    private:
        uint8_t currentRouteIndex = 0;
        Route currentRoute;

        double getCoord(uint16_t stopId, uint8_t latORlong) {
            Stop temp;
            memcpy_P(&temp, &stops[stopId], sizeof(Stop));

            if(latORlong == 0) {
                return temp.lat;
            } else {
                return temp.lon;
            }
        }

    public:
        Coordinates() {
            currentRouteIndex = EEPROM.read(0); // read saved index
            if(currentRouteIndex > ROUTES_NUM) { // check if saved index exist
                currentRouteIndex = 0; // if it doesn't, then use first route in the list
            }

            memcpy_P(&currentRoute, &routes[currentRouteIndex], sizeof(Route));
        }

        void nextLine() {
            currentRouteIndex == ROUTES_NUM-1 ? currentRouteIndex = 0 : currentRouteIndex++;
            memcpy_P(&currentRoute, &routes[currentRouteIndex], sizeof(Route));
        }

        void prevLine() {
            currentRouteIndex == 0 ? currentRouteIndex = ROUTES_NUM-1 : currentRouteIndex--;
            memcpy_P(&currentRoute, &routes[currentRouteIndex], sizeof(Route));
        }

        void rememberRoute() {
            EEPROM.update(0, currentRouteIndex);
        }

        uint8_t currentRouteDispNum() {
            return currentRoute.dispNum;
        }

        double getLat(uint8_t routeStopIndex, bool startToEnd) {
            uint16_t stopId;
            if(startToEnd) {
                stopId = pgm_read_word(&currentRoute.steStops[routeStopIndex]);  
            } else {
                stopId = pgm_read_word(&currentRoute.etsStops[routeStopIndex]);  
            }

            return getCoord(stopId, 0);
        }

        double getLng(uint8_t routeStopIndex, bool startToEnd) {
            uint16_t stopId;
            if(startToEnd) {
                stopId = pgm_read_word(&currentRoute.steStops[routeStopIndex]);  
            } else {
                stopId = pgm_read_word(&currentRoute.etsStops[routeStopIndex]);  
            }

            return getCoord(stopId, 1);
        }

        uint8_t getStopAudio(uint8_t routeStopIndex, bool startToEnd) {
            if(routeStopIndex >= getStopsNum()) return 0;

            uint16_t stopId;
            if(startToEnd) {
                stopId = pgm_read_word(&currentRoute.steStops[routeStopIndex]);  
            } else {
                stopId = pgm_read_word(&currentRoute.etsStops[routeStopIndex]);  
            }

            Stop temp;
            memcpy_P(&temp, &stops[stopId], sizeof(Stop));

            return temp.audioNum;
        }

        uint8_t getStopRadius(uint8_t routeStopIndex, bool startToEnd) {
            if(routeStopIndex >= getStopsNum()) return 0;
            
            uint16_t stopId;
            if(startToEnd) {
                stopId = pgm_read_word(&currentRoute.steStops[routeStopIndex]);  
            } else {
                stopId = pgm_read_word(&currentRoute.etsStops[routeStopIndex]);  
            }

            Stop temp;
            memcpy_P(&temp, &stops[stopId], sizeof(Stop));

            return temp.radius;
        }

        uint8_t getStopsNum() {
            return currentRoute.stopsNum;
        }

};


#endif // COORDINATES_H`;

    return resultText;
}