# Interpolation

Interpolation refer to the process of finding a value between two points on a line or curve. In this project we use it as the way that we connect the points of the path.

Imagine the following path:

![Path](/src/doc/Images/original.svg)

where the red line is the path and the cyan dots are the points taken as samples.

You can find three different interpolation methods in this project:

## Linear interpolation

This is the simplest interpolation method. It simply connects the points with straight lines. So you'll need a dense set of samples to get a good result.

![Linear interpolation](/src/doc/Images/linear.svg)

## Bezier interpolation

This is a more complex interpolation method. It uses a quadratic bezier curve to connect the points. For this method you need a third point to define the curve. This point is the next point in the list. With this method you can get a good result with a sparse sampling, but sometimes you can see rough edges.

![Bezier interpolation](/src/doc/Images/bezier.svg)

## Derivative interpolation

This is the most complex interpolation method. It uses the derivative of the curve to get the bezier curve that connect the points. For this method you need four points to define the curve. In this case you take the previous and the next point. This method tries to ensure that the curve is tangent to the points, so you won't see rough edges. But when the curve is too spiky, you can see some artifacts.

![Derivative interpolation artifacts](/src/doc/Images/derivative-artifacts.svg)

To avoid this, we limit the control point to be inside the square defined by the involved points.

![Derivative interpolation](/src/doc/Images/derivative-good.svg)

As you can see, every spiky part of the curve now is curled.
