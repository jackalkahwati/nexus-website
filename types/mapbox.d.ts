declare module '@mapbox/mapbox-gl-draw' {
  import { Map } from 'mapbox-gl'

  interface MapboxDrawControls {
    point?: boolean
    line_string?: boolean
    polygon?: boolean
    trash?: boolean
    combine_features?: boolean
    uncombine_features?: boolean
  }

  interface MapboxDrawStyles {
    id: string
    type: string
    filter: any[]
    paint: Record<string, any>
  }

  interface MapboxDrawOptions {
    displayControlsDefault?: boolean
    controls?: MapboxDrawControls
    styles?: MapboxDrawStyles[]
    defaultMode?: string
  }

  interface DrawCreateEvent {
    features: Array<{
      id: string
      type: string
      properties: Record<string, any>
      geometry: {
        type: string
        coordinates: number[][][]
      }
    }>
  }

  class MapboxDraw {
    constructor(options?: MapboxDrawOptions)
    add: (feature: any) => void
    get: (id: string) => any
    getAll: () => any
    delete: (id: string) => void
    deleteAll: () => void
    trash: () => void
    changeMode: (mode: string) => void
    setFeatureProperty: (id: string, property: string, value: any) => void
    onAdd: (map: Map) => HTMLElement
    onRemove: (map: Map) => any
  }

  export = MapboxDraw
} 