export function gaussianElimination(matrix: number[][]) {
  const n = matrix.length;

  for (let i = 0; i < n; i++) {
    let maxEl = Math.abs(matrix[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > maxEl) {
        maxEl = Math.abs(matrix[k][i]);
        maxRow = k;
      }
    }

    for (let k = i; k < n + 1; k++) {
      const tmp = matrix[maxRow][k];
      matrix[maxRow][k] = matrix[i][k];
      matrix[i][k] = tmp;
    }

    for (let k = i + 1; k < n; k++) {
      const c = -matrix[k][i] / matrix[i][i];
      for (let j = i; j < n + 1; j++) {
        if (i === j) {
          matrix[k][j] = 0;
        } else {
          matrix[k][j] += c * matrix[i][j];
        }
      }
    }
  }

  const x = new Array(n);
  for (let i = n - 1; i > -1; i--) {
    x[i] = matrix[i][n] / matrix[i][i];
    for (let k = i - 1; k > -1; k--) {
      matrix[k][n] -= matrix[k][i] * x[i];
    }
  }

  return x;
}