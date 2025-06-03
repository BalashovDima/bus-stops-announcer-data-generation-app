export default function generateCode(stops, routes) {
   const stopStruct = `struct Stop {
    float lat;
    float lon;
    uint8_t audioNum;
    uint8_t radius;
};\n\n`;

    const {r: stopsArrCode, i: stopIndexes} = generateStopsArr(stops);

    return stopStruct + stopsArrCode;
}

function generateStopsArr(stops) {
    let resultText = 'const Stop stops[] PROGMEM = {\n';
    const indexes = {};

    stops.forEach((stop, index) => {
        resultText += `    {${stop.lat}, ${stop.lon}, ${stop.audioTrackNumber}, ${stop.radius}}, // ${stop.name}\n`;
        indexes[stop.id] = index;
    });
    resultText += "}\n\n"

    return {r: resultText, i: indexes};
}

function generateRoutesCode(routes, stopIndexes) {

}