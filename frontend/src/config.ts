const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY || '';

if (!MAPTILER_API_KEY) {
    console.warn('Warning: MAPTILER_API_KEY is not defined in environment variables');
}

export default MAPTILER_API_KEY;
