# CSS Fluid

A Visual Studio Code extension that helps you quickly generate common fluid CSS values directly in the editor.

The extension is designed for everyday front-end work such as converting fixed font sizes into fluid `clamp(...)` expressions, calculating percentages from desktop/mobile widths, and converting pixel font sizes to `rem`.

## Features

### 1. Fluid size

Command: `Fluid: Fluid size`

Use this command when you already have your default viewport settings configured in VS Code.

How it works:
- Type a numeric value such as `48`, `48px`, or `3rem`.
- Place the cursor on the value.
- Run `Fluid: Fluid size` from the Command Palette.
- Enter the minimum size when prompted.
- The value is replaced with a fluid `clamp(...)` expression.

The command uses these settings:
- `css-fluid.desktopWidth`
- `css-fluid.mobileWidth`
- `css-fluid.minValue`

If the selected value is written in `rem`, the extension converts it to pixels internally and still outputs a `clamp(...)` expression in `rem`.

Example input:

```css
font-size: 48px;
```

Example output:

```css
font-size: clamp(1.125rem, calc(1.125rem + 2.0000vw - 0.4875rem), 3rem);
```

### 2. Fluid size, ask for dimensions

Command: `Fluid: Fluid size, ask for dimensions`

Use this version when you want to override the configured values for a single calculation.

How it works:
- Type a numeric value such as `48`, `48px`, or `3rem`.
- Place the cursor on the value.
- Run `Fluid: Fluid size, ask for dimensions`.
- Enter:
  - desktop width
  - mobile width
  - minimum value
- The value is replaced with a fluid `clamp(...)` expression.

This is useful when switching between projects or design systems with different breakpoints.

### 3. Desktop Percent

Command: `Fluid: Desktop Percent`

Calculates what percentage a number represents relative to `css-fluid.desktopWidth`.

Example with `desktopWidth = 1920`:

```css
width: 384px;
```

becomes:

```css
width: 20.000%;
```

### 4. Desktop Percent of content

Command: `Fluid: Desktop Percent of content`

Calculates what percentage a number represents relative to `css-fluid.desktopContent`.

This is useful when your layout is based on a centered content container rather than the full desktop viewport.

Example with `desktopContent = 1400`:

```css
max-width: 350px;
```

becomes:

```css
max-width: 25.000%;
```

### 5. Mobile Percent

Command: `Fluid: Mobile Percent`

Calculates what percentage a number represents relative to `css-fluid.mobileWidth`.

Example with `mobileWidth = 390`:

```css
width: 39px;
```

becomes:

```css
width: 10.000%;
```

### 6. Percentage by divisor

Commands:
- `Fluid: Set Divisor`
- `Fluid: Percentage by divisor`

Use this when you want to calculate a percentage against a custom base value.

How it works:
1. Run `Fluid: Set Divisor` and enter a number.
2. Type a value in your code.
3. Place the cursor on that value.
4. Run `Fluid: Percentage by divisor`.

Example with divisor `12`:

```css
width: 3;
```

becomes:

```css
width: 25.000%;
```

### 7. Font pixel to rem

Command: `Fluid: Font pixel to rem (1rem=16px)`

Converts the number under the cursor from pixels to `rem` using a fixed base of `16px = 1rem`.

Example:

```css
font-size: 24px;
```

becomes:

```css
font-size: 1.5rem;
```

## Supported input formats

The extension works with the number under the cursor and supports values such as:
- `24`
- `24px`
- `1.5rem`

If the text under the cursor is not numeric, the extension shows an error message.

## Supported languages

The commands are available in these editors:
- CSS
- SCSS
- Sass
- HTML
- JSON

## Extension Settings

This extension contributes the following settings:

- `css-fluid.desktopWidth` — desktop viewport width used for desktop percentage calculations and default fluid size calculations. Default: `1920`
- `css-fluid.mobileWidth` — mobile viewport width used for mobile percentage calculations and default fluid size calculations. Default: `390`
- `css-fluid.minValue` — default minimum value used by the fluid size command. Default: `18`
- `css-fluid.desktopContent` — content/container width used by `Fluid: Desktop Percent of content`. Default: `1400`

You can change them in VS Code Settings by searching for `css-fluid`.

## Usage tips

- Place the cursor directly on the numeric token you want to transform.
- You do not need to manually select the value first.
- Values with `px` and `rem` suffixes are supported.
- The extension replaces the original value in place.

## Requirements

No additional dependencies or external services are required.

## Known limitations

- The extension works on the word/range under the cursor, so the cursor must be placed on the target numeric value.
- The `Font pixel to rem` command always uses `16px = 1rem`.
- The divisor used by `Percentage by divisor` must be set manually before running the command.

## Development

Repository: `Lovor01/css-fluid`

Main implementation files:
- `extension.js`
- `package.json`

## License

MIT
