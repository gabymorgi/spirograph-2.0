# Sampling

In simple mode you can see that you have only 3 options to choose from. This is made by evaluating the change between point and point, and trying to adjust the step to fit within some threshold.

![Sampling](https://upload.wikimedia.org/wikipedia/commons/2/2d/Tangent_function_animation.gif)

To do this, you start with an arbitrary step, and then you evaluate the change between point and point. If the change is too big, you reduce the step, and if the change is too small, you increase the step. This is done a few times. And finally take the average of the steps.

This result is taken as the middle option, being the other two options the half and double of the middle option.