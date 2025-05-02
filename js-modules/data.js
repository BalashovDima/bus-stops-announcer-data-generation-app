export default class Data {
    #_stops = [];
    #_routes = [];
    
    constructor() {
        
    }

    async readFromFile(file) {
        try {
            let data;
    
            if (typeof file === "string") {
                // Fetch JSON from a URL
                const response = await fetch(file);
                data = await response.json();
            } else if (file instanceof File) {
                // Read JSON from a local file
                const text = await file.text();
                data = JSON.parse(text);
            } else {
                throw new Error("Invalid file input");
            }
    
            this.#_stops = data.stops || [];
            this.#_routes = data.routes || [];
        } catch (error) {
            alert("Error reading file: " + error.message);
            console.error("Error opening file:", error);
        }
    }

    saveToFile(filename) {
        const data = {
            stops: this.#_stops,
            routes: this.#_routes
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        if(!filename.endsWith(".json")) filename += ".json";
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    addNewStop(name, lat, lon, audio, radius) {
        const id = this.generateId();
        const stop = {
            "id": id,
            "name": name,
            "lat": lat,
            "lon": lon,
            "audioTrackNumber": audio,
            "radius": radius,
            "routes": []
        }

        this.#_stops.push(stop);
        return id; 
    }

    addNewRoute(displayNumber, name) {
        const id = this.generateId();
        const route = {
            "id": id,
            "displayNumber": displayNumber,
            "name": name,
            "stops": []
        }

        this.#_routes.push(route);
        return id; 
    }

    editStop(stopId, newName = '', newLat = '', newLon = '', newAudio = '', newRadius = '') {
        const index = this.#_stops.findIndex(stop => stop.id === stopId);

        if(newName !== '') {
            this.#_stops[index].name = newName;
        }
        if(newLat !== '') {
            this.#_stops[index].lat = newLat;
        }
        if(newLon !== '') {
            this.#_stops[index].lon = newLon;
        }
        if(newAudio !== '') {
            this.#_stops[index].audioTrackNumber = newAudio;
        }
        if(newRadius !== '') {
            this.#_stops[index].radius = newRadius;
        }
    }

    updateRouteStops(routeId, stopsArr) {
        this.#_routes.find(route => route.id === routeId).stops = stopsArr;
    }

    /**
     * Deletes stop from the data and returns restoreData object that should be used with restoreStop to restore the stop if needed
     */
    deleteStop(stopId) {
        const index = this.#_stops.findIndex(stop => stop.id === stopId);

        const restoreToRoutes = [];

        this.#_stops[index].routes.forEach((routeId) => { // for each route the deleted stop is in
            const restoreObject = {id: routeId, rows: []};
            const route = this.#_routes.find(route => route.id === routeId);

            for(let i = route.stops.length -1; i >= 0 ; i--) { // for each row (going backwards because of possible deletion of array items)
                const row = {};

                let rowHadTheStop = false;

                if(route.stops[i][0] === stopId) { // if deleted stop was used as 'start-to-end' stop
                    row.ste = true; // mark it
                    route.stops[i][0] = '0'; // and "remove" it by marking it as empty stop
                    if(route.stops[i][1] === stopId) { // if it was also used as 'end-to-start' stop
                        row.ets = true; // mark it
                        route.stops[i][1] = '0'; // and "remove" it by marking it as empty stop
                    } else {
                        row.neighbor = route.stops[i][1]; // if only ste, then remember neighboring (same row) stop id
                    }

                    rowHadTheStop = true; // mark that the row had the deleted stop
                } else if(route.stops[i][1] === stopId) { // else if only ets
                    row.ets = true; // mark it
                    route.stops[i][1] = '0'; // and "remove" it by marking it as empty stop
                    row.neighbor = route.stops[i][0]; // remember neighbor
                    
                    rowHadTheStop = true;
                }

                if(route.stops[i][0] === '0' && route.stops[i][1] === '0') { // if row has two empty stops
                    route.stops.splice(i, 1); // then remove the whole row
                }

                if(rowHadTheStop) { // if row had the stop then add the row with its info to the restore object
                    row.index = i;
                    restoreObject.rows.push(row);
                }
            }
            
            restoreToRoutes.push(restoreObject);
        });

        const restoreData = this.#_stops.splice(index, 1)[0];
        restoreData.routes = restoreToRoutes;

        return restoreData;
    }

    restoreStop(restoreData) {
        restoreData.routes.forEach((restoreObject) => {
            const route = this.#_routes.find(route => route.id === restoreObject.id);
    
            restoreObject.rows.forEach((row) => {
                if(row.ste) {
                    if(row.ets) {
                        const newRouteRow = [restoreData.id, restoreData.id];
                        route.stops.splice(row.index, 0, newRouteRow);
                    } else {
                        if(route.stops[row.index][1] === row.neighbor) {
                            route.stops[row.index][0] = restoreData.id;
                        } else {
                            route.stops.splice(row.index, 0, [restoreData.id, '0']);
                        }
                    }
                } else if(row.ets) {
                    if(route.stops[row.index][0] === row.neighbor) {
                        route.stops[row.index][1] = restoreData.id;
                    } else {
                        route.stops.splice(row.index, 0, ['0', restoreData.id]);
                    }
                }
            });
        });

        restoreData.routes = restoreData.routes.map(route => route.id);
        this.#_stops.push(restoreData);
    }

    get stops() {
        return this.#_stops;
    }

    get routes() {
        return this.#_routes;
    }

    getStopById(id) {
        return this.#_stops.find(stop => stop.id === id);
    }

    getRouteById(id) {
        return this.#_routes.find(route => route.id === id);
    }

    /**
     * Add given route to stop's "used in routes" list
     */
    addRouteToStop(stopId, routeId) {
        const stop = this.getStopById(stopId);

        stop.routes.push(routeId);
    }

    removeRouteFromStop(stopId, routeId) {
        const stop = this.getStopById(stopId);

        stop.routes.splice(stop.routes.indexOf(routeId), 1);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}