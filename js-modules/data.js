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

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}