export function haversineDistanceKM(...args: [lat1Deg: number, lon1Deg: number, lat2Deg: number, lon2Deg: number]) {
    const { sin, cos, sqrt, atan2, PI } = Math;
    const [lat1, lon1, lat2, lon2] = args.map(value => (value * PI) / 180);

    const R = 6371;
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = sin(dLat / 2) * sin(dLat / 2) + cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
}
