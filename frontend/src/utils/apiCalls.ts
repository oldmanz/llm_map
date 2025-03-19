export class ApiCalls {
  static async fetchLLMQueryProperties(nlQuery: string) {
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

  static async fetchAllProperties() {
    const response = await fetch('http://127.0.0.1:8001/properties');
    return await response.json();
  }

  static async fetchAllParks() {
    const response = await fetch('http://127.0.0.1:8001/parks');
    return await response.json();
  }

  static async getParkPopupProperties(parkId: number) {
    const response = await fetch(
      `http://127.0.0.1:8001/get-park-popup-properties?park_id=${parkId}`,
    );
    return await response.json();
  }
}
