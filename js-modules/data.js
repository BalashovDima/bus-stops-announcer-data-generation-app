export default class Data {
    #_stops = [];
    #_routes = [];
    
    constructor() {
        
    }

    async readFromFile(file) {
        try {
            const response = await fetch(file);
            const data = await response.json();
            this.#_stops = data.stops || [];
            this.#_routes = data.routes || [];
        } catch (error) {
            return console.error("Error opening file:", error);
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

    get allStops() {
        return this.#_stops;
    }

    get allRoutes() {
        return this.#_routes;
    }

    getStopById(id) {
        return this.#_stops.find(stop => stop.id === id);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}