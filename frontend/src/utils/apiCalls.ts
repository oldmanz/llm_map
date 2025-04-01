export class ApiCalls {
  static async fetchNLQueryIds(nlQuery: string) {
    const urlSafeMessage = encodeURIComponent(nlQuery);
    const response = await fetch(
      `http://127.0.0.1:8001/query?nl_query=${urlSafeMessage}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  static async fetchGeoJson(layerName: string) {
    const response = await fetch(
      `http://127.0.0.1:8001/get-layer-geojson?layer=${layerName}`,
    );
    return await response.json();
  }

  static async getLayerPopupProperties(layerId: string, parkId: number) {
    const response = await fetch(
      `http://127.0.0.1:8001/get-layer-popup-properties?layer=${layerId}&park_id=${parkId}`,
    );
    return await response.json();
  }

  static async saveQuery(nlQuery: string, sqlQuery: string) {
    const response = await fetch(
      `http://127.0.0.1:8001/save-query?nl_query=${nlQuery}&sql_query=${sqlQuery}`,
    );
    return await response.json();
  }
}
