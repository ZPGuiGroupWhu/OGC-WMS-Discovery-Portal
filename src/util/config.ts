// config leaflet map draw tool, the map component is in DataSearch.tsx
export const mapDrawConfig:object = {
    polyline: false,
    polygon: false,
    marker: false,
    circle: false,
    circlemarker: false,
    rectangle: {
        shapeOptions: {
            weight: 1
        },
        repeatMode: false
    }
}