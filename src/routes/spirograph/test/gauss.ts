export function gaussianElimination(A: number[][], B: number[]): number[] {
    const n = A.length;

    for (let i = 0; i < n; i++) {
        // Encontrar el pivote
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }

        // Intercambiar filas
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [B[i], B[maxRow]] = [B[maxRow], B[i]];

        // Hacer ceros debajo del pivote
        for (let k = i + 1; k < n; k++) {
            const factor = A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }
            B[k] -= factor * B[i];
        }
    }

    // Resolver el sistema triangular superior
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = B[i] / A[i][i];
        for (let k = i - 1; k >= 0; k--) {
            B[k] -= A[k][i] * x[i];
        }
    }

    return x;
}