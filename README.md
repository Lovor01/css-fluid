# css-fluid README

A Visual Studio Code extension to facilitate easier calculating of some css fluid related values.

## Features

### Fluid size

`Fluid size`, and it's variant `Fluid size, ask for dimensions` creates formula for interpolating size based on screen width. It can be used to fluidly resize fonts, margins, paddings, etc.

When using `Fluid size`, first set settings of the plugin (desktop screen width and mobile screen width) and then type number with or without px as suffix. Position cursor at the end of the size and invoke command. You will be asked for mobile size. Formula will be automattically created.

In case of `Fluid size, ask for dimensions`, it will ask first for all settings, including desktop and mobile screen width.

### Desktop Percent, Mobile percent, Desktop percent of content

Invoke on last position of number, it calculates percentage of respective size.

### Division by divisor

First set number `Fluid: set divisor`.

Then type number and choose `Fluid: divide by divisor`
