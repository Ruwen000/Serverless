const { app } = require('@azure/functions');

app.http('dreiecken1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // Extract triangle vertices and point coordinates from the request
        const A = [parseFloat(request.query.get('Ax')), parseFloat(request.query.get('Ay'))];
        const B = [parseFloat(request.query.get('Bx')), parseFloat(request.query.get('By'))];
        const C = [parseFloat(request.query.get('Cx')), parseFloat(request.query.get('Cy'))];
        const point = [parseFloat(request.query.get('Px')), parseFloat(request.query.get('Py'))];

        // Calculate if the point is inside the triangle
        const isInside = pointInTriangle(point, A, B, C);

        return { body: `Point is inside triangle: ${isInside}` };
    }
});

function pointInTriangle(point, A, B, C) {
    // Calculate barycentric coordinates
    const denominator = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
    const alpha = ((B[1] - C[1]) * (point[0] - C[0]) + (C[0] - B[0]) * (point[1] - C[1])) / denominator;
    const beta = ((C[1] - A[1]) * (point[0] - C[0]) + (A[0] - C[0]) * (point[1] - C[1])) / denominator;
    const gamma = 1 - alpha - beta;

    // Check if point is inside the triangle
    return alpha > 0 && beta > 0 && gamma > 0;
}
