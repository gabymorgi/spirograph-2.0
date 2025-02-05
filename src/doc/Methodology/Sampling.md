# Sampling

In simple mode you can see that you have only 3 options to choose from. This is made by evaluating the change between point and point, and trying to adjust the step to fit within some threshold.

![Sampling](https://upload.wikimedia.org/wikipedia/commons/2/2d/Tangent_function_animation.gif)

To do this, you start with an arbitrary step, and then you evaluate the change between point and point. If the change is too big, you reduce the step, and if the change is too small, you increase the step. This is done a few times. And finally take the average of the steps.

This result is taken as the middle option, being the other two options the half and double of the middle option.

---

Dado que nosotros usaremos SVG para representar la curva, y teniendo en cuenta que los path de un SVG estan basados en curvas de bezier, seria interesante encontrar la menor cantidad de puntos que representen la curva de bezier. Un hypocicloide esta muy relacionado a circulos, asi que como punto de partida, podemos pensar en la cantidad de curvas necesarias para representar un circulo.
Podemos dividir el circulo a la mitad, y pensar que los puntos de control deberian ser paralelos a la linea que une los puntos de inicio y fin de la curva.
Si expresamos la curva de Bezier cubica

$$
B(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3
$$

y determinamos que
X1 = X0
X2 = X3
Y1 = Y2

Con solo conocer un punto del circulo cada PI / 4
tomando P0 para theta = 0, P3 para theta = PI / 2, y B(1/2) para theta = PI / 4
facilmente podemos obtener Y1 = 4/3.

![Circulo](/src/doc/Images/circle-svg.svg)

Si miramos un hypocicloide notaremos un patron similar. Podemos usar una curva diferente cada theta = PI /2, donde en este caso, para despejar t deberiamos hacer
t = ((laps * Math.PI) / petals)
y con solo un punto intermedio, podriamos obtener los puntos de control. Tambien hay que notar que los puntos extremos estaran siempre a una distancia
max radius = fixed radius - movingRadius + pointDistance
y 
minRadius = fixed radius - movingRadius - pointDistance

![Hypocicloide](/src/doc/Images/CP-on-half-radius.svg)

Podemos observar en esta imagen, que la curva de bezier es siempre la misma, con lo que solo tendremos que calcular los puntos de control la primera vez, y luego simplemente replicarlos.

## finding parameters

Viendo la imagen vemos que la parte importante es encontrar la magnitud de los dos puntos de control, ya que el angulo sera siempre tangente al punto; y la velocidad de rotacion, o dicho de otra forma, cada cuantos grados alternamos entre max radius y min radius. Nos queda entender como afecta la variacion de p, l y s a estos valores

### p

p es la cantidad de petalos, y por lo tanto, nos ca a ayudar a calcular theta
los puntos estan distribuidos en 2 * Math.PI / p
sin embargo, el orden no es este. Para esto necesitamos el parametro l

![Petalos](/src/doc/Images/p5-l3-c50.svg)
![Petalos](/src/doc/Images/p7-l3-c50.svg)
![Petalos](/src/doc/Images/p8-l3-c50.svg)

### l

l es la cantidad de vueltas a lo largo del circulo externo, por lo tanto, lo vamos a multiplicar por el valor anterior para obtener el orden de los puntos. Podemos ver en la siguiente imagen, donde mantenemos fijo p, como varia este valor.

![Vueltas](/src/doc/Images/p5-l1-c50.svg)
![Vueltas](/src/doc/Images/p5-l2-c50.svg)
![Vueltas](/src/doc/Images/p5-l3-c50.svg)
![Vueltas](/src/doc/Images/p5-l4-c50.svg)

como vemos, el ultimo ejemplo tiene una particularidad, parece no respetar la regla establecida anteriormente. Esto se debe a como s, aunque lo mantengamos fijo, afecta a l. Cuando min radius queda del otro lado del centro, da la sensacion que la curva gira en el lado opuesto.
Tendremos que tener esto en cuenta, ya que afectara la direccion de los puntos de control.

### s

s modificara la distancia entre min radius y max radius, y es el parametro mas sensillo de entender.

![Distancia](/src/doc/Images/p5-l3-c20.svg)
![Distancia](/src/doc/Images/p5-l3-c60.svg)
![Distancia](/src/doc/Images/p5-l3-c80.svg)

### estimating parameters

Como quedo claro luego de esta explicacion. La unica incognita para dibujar la curva son las dos magnitudes de los puntos de control. En la explicacion de los parametros, vimos como cambiaban estos valores dejando dos fijos y modificando solo el otro.
Vamos a mostrar los valores en un grafico para ver si se pueden estimar.

![Estimacion](/src/doc/Images/point distance transition.svg)

Podemos ver que los valores se mueven de forma lineal, lo que es una buena noticia, pero para cada par p-l, tanto la pendiente como la ordenada al origen cambian. Por lo tanto, vamos a graficar ambas para ver si podemos encontrar una relacion entre ellas.

![Estimacion](/src/doc/Images/b vs 100m chart.svg)

multiplicando m por 100, podemos ver que tanto b y m son iguales pero opuestas, por lo que si encontramos una forma de calcular m, podremos calcular b.

## Calculating b

Por su forma, parecia que podiamos ajustar la curva a un polinomio de grado 2. Sin embargo, veremos que los factores armonicos, aunque lejanos, nos impediran hacerlo

### polinomio de grado 2

![Estimacion](/src/doc/Images/Poly 2 chart.svg)

### polinomio de grado 3

![Estimacion](/src/doc/Images/Poly 3 chart.svg)

### polinomio de grado 4

![Estimacion](/src/doc/Images/Poly 4 chart.svg)
![Estimacion](/src/doc/Images/Poly 4 error.svg)

### polinomio de grado n

![Estimacion](/src/doc/Images/Poly 30 chart.svg)
![Estimacion](/src/doc/Images/Poly 30 error.svg)

### Curva de bezier

Se dividio la curva en 2 partes, pero sin resultados satisfactorios

![Estimacion](/src/doc/Images/Bezier 2 chart.svg)
![Estimacion](/src/doc/Images/Bezier 2 error.svg)

### Extrapolacion

Si extrapolamos la curva a infinitos valores, vemos que la curva presenta tangentes cada fixedRadius, por lo que no podremos aproximar de forma exacta la curva.