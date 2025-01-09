import { Point } from "chart.js";
import { gaussianElimination } from "./gauss";

export function findPolinomicCoefficients(points: Point[]) {
  const matrix = points.map(p => Array.from({ length: points.length }, (_, i) => Math.pow(p.x, i)));
  const vector = points.map((p) => p.y);
  return gaussianElimination(matrix, vector);
}

export function polinomicFunction(coefficients: number[], x: number): number {
  return coefficients.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
}

export function findRationalCoefficients(points: Point[], degreeP: number, degreeQ: number) {
  const totalCoefficients = degreeP + degreeQ + 2; // Incluye a_0...a_m y b_0...b_n
  if (points.length < totalCoefficients) {
    throw new Error("Se necesitan al menos " + totalCoefficients + " puntos para ajustar el polinomio racional");
  }
  const matrix: number[][] = [];
  const vector: number[] = [];

  for (const { x, y } of points) {
    const row: number[] = [];

    // Coeficientes de p(x)
    for (let i = 0; i <= degreeP; i++) {
      row.push(Math.pow(x, i));
    }

    // Coeficientes de q(x)
    for (let i = 0; i <= degreeQ; i++) {
      row.push(-y * Math.pow(x, i));
    }

    matrix.push(row);
    vector.push(0); // Ecuación p(x) - y * q(x) = 0
  }

  // Resuelve el sistema lineal
  return gaussianElimination(matrix, vector);
}