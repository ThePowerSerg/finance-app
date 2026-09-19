# Animated Hero: Code Guide

This guide explains the sections of [App.tsx](../../../financeApp/src/App.tsx) and how they work with [animation1.svg](../../../financeApp/src/assets/images/animation1.svg) to produce the final **FinApp.** heading.

## 1. The complete sequence

1. The component creates a new playback identifier and loads the SVG.
2. The SVG plays its staggered circle animation once. Each shape animates for four seconds; the last finishes at approximately 5.73 seconds.
3. The blue **FinApp** name fades and grows into view at the center over 0.9 seconds.
4. When the name's entrance finishes, React measures the space reserved for its period.
5. The circle moves and shrinks into that space over 0.8 seconds, leaving **FinApp.** visible.

The sequence takes approximately 7.43 seconds after image loading. The heading uses a delay based on the SVG's known timing; it does not directly listen for the SVG's completion.

## 2. Imports

```tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Container, CssBaseline, Typography, keyframes } from "@mui/material";
import animation from "./assets/images/animation1.svg";
```

| Import | Purpose |
|---|---|
| `useState` | Stores values that affect what React renders. |
| `useEffect` | Initializes a fresh playback when the component mounts. |
| `useLayoutEffect` | Measures the period's destination and updates positioning before the browser paints. |
| `useRef` | Holds references to actual HTML elements for measurement. |
| `Box` | Provides a configurable element with MUI styling. It is used as a section, image, and span. |
| `Container` | Centers the main content and limits its width. |
| `CssBaseline` | Applies consistent baseline browser styles. |
| `Typography` | Renders and styles the heading. |
| `keyframes` | Defines the CSS animation for revealing the name. |
| `animation` | The asset URL Vite generates for the SVG file. |

## 3. Animation timing and name reveal

```tsx
const loopEnd = 5.733332;
const revealName = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;
```

`loopEnd` is the latest SVG start time, `1.733332` seconds, plus its four-second duration. The heading waits this long after the image's load event before appearing.

`revealName` begins with transparent text at 85% of its final size. It ends with fully visible text at its normal size. Scaling around the default center makes the name appear in place rather than slide in from another side.

## 4. State and element references

| Value | Purpose |
|---|---|
| `animationLoaded` | Becomes `true` when the image loads, enabling the heading's delayed animation. |
| `nameVisible` | Becomes `true` when the heading finishes its entrance, allowing period positioning to begin. |
| `playbackId` | Identifies the current playback. It starts as `null`, so the image waits until initialization. |
| `heroRef` | References the hero section to measure its position and border. |
| `periodRef` | References the empty span that reserves the period's final position. |
| `periodPosition` | Stores the image's destination `left`, `top`, and `width` in pixels. It remains `null` until the name is ready. |

The TypeScript type `{ left: number; top: number; width: number } | null` means the destination is either a complete set of measurements or not yet available.

## 5. Starting a fresh playback

```tsx
useEffect(() => {
  setAnimationLoaded(false);
  setNameVisible(false);
  setPeriodPosition(null);
  setPlaybackId(crypto.randomUUID());
}, []);
```

This resets the sequence and creates a unique identifier. The empty dependency array means ordinary state updates do not rerun this effect. During development, React Fast Refresh can rerun effects after edits, restarting the sequence.

The identifier is used in two places:

- React `key` values cause the image and heading elements to be recreated for a fresh playback.
- The image URL's `?playback=...` query distinguishes the new SVG load from an earlier one whose one-time animation may already have finished.

## 6. Measuring where the period belongs

The `useLayoutEffect` depends on `nameVisible`. It exits early until the name has finished appearing and both element references exist.

Inside it, `positionCircle` measures the hero and the period placeholder with `getBoundingClientRect()`. These measurements are relative to the browser viewport.

```tsx
left: dotBounds.left - heroBounds.left - hero.clientLeft + dotBounds.width / 2,
top: dotBounds.top - heroBounds.top - hero.clientTop + dotBounds.height / 2,
width: dotBounds.width * 1080 / 198.6,
```

The first two calculations convert the placeholder's center into coordinates inside the hero. `clientLeft` and `clientTop` account for the hero's border.

The width calculation scales the **entire SVG image**, not just its visible circle. The SVG has a 1080-unit-wide viewBox, while its final circle is 198.6 units wide. Multiplying the desired period width by `1080 / 198.6` gives the image width needed to make that circle fit the placeholder.

### Keeping the destination responsive

`ResizeObserver` watches the hero, the placeholder, and the heading containing it. When their sizes change, the code measures the destination again. This allows the period to follow responsive font and layout changes.

The effect's cleanup calls `observer.disconnect()` so the observer is released when the effect is replaced or the component unmounts.

## 7. Page and hero layout

The React Fragment (`<>...</>`) groups the baseline styles and main container without adding another HTML element.

```tsx
<CssBaseline />
<Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
```

The container renders as `<main>`, centers the content, and uses MUI's large maximum width. Vertical padding increases on medium screens and larger.

The hero Box renders as `<section>` and connects to the heading through `aria-labelledby="hero-title"`.

| Hero style | Purpose |
|---|---|
| `position: "relative"` | Makes the hero the positioning reference for the absolute image. |
| `overflow: "hidden"` | Clips content that moves outside the section. |
| `minHeight: "50svh"` | Gives the hero a minimum height equal to half the small viewport height. |
| `display: "flex"`, `flexDirection: "column"` | Creates a vertical flex layout. |
| `justifyContent: "center"`, `alignItems: "center"` | Centers the heading vertically and horizontally. |
| `p: { xs: 3, md: 4 }` | Applies responsive padding: 24px and 32px with the default theme. |
| `bgcolor: "common.white"` | Sets a white background. |
| `border: "1px solid"`, `borderColor: "grey.200"` | Adds a light gray outline. |
| `borderRadius: 3` | Rounds the corners using the theme's radius scale. |
| `boxShadow` | Combines two soft shadows for a slightly raised appearance. |

In MUI styles, `xs` supplies the value from the smallest breakpoint, and `md` overrides it on medium screens and larger. Default spacing units are 8px each.

## 8. The animated SVG image

The image renders once `playbackId` exists. Its empty `alt` marks it as decorative, while the heading provides the accessible name.

```tsx
src={`${animation}?playback=${playbackId}`}
onLoad={() => setAnimationLoaded(true)}
```

The SVG's own animation controls its circles. The surrounding React component controls when the name appears and where the image moves afterward.

### Initial placement

Before destination measurements exist, the image uses:

```tsx
left: "50%"
top: "50%"
transform: "translate(-50%, -50%)"
```

This centers the image's rectangular canvas inside the hero. The visible circle moves within that canvas as the SVG plays.

Its initial width is `min(100%, 36svh)`, capped at 400px, and `height: "auto"` preserves its aspect ratio.

### Final placement

Expressions such as `periodPosition?.left ?? "50%"` use the measured value when available, falling back to the initial value otherwise. `?.` safely accesses a property when the object might be `null`; `??` supplies the fallback.

The final transform is:

```tsx
transform: "translate(-50%, -79.907407%)"
```

The final circle is centered at `(540, 863)` within the 1080-by-1080 SVG. Those coordinates correspond to 50% of its width and approximately 79.907407% of its height. This transform aligns the **visible circle's center** with the measured period destination.

The CSS transition animates `left`, `top`, `width`, and `transform` over 0.8 seconds. Updating `periodPosition` therefore moves and shrinks the image smoothly. `pointerEvents: "none"` prevents the decorative image from intercepting pointer interaction.

## 9. The FinApp heading

`Typography` renders as an `<h1>` with blue text (`#206aff`), bold weight, and responsive font sizes of `3.5rem` and `5rem`. A `rem` is relative to the root HTML font size.

```tsx
animation: animationLoaded
  ? `${revealName} 0.9s ease-out ${loopEnd}s forwards`
  : "none"
```

| Animation part | Meaning |
|---|---|
| `revealName` | The fade-and-scale keyframes. |
| `0.9s` | Duration of the entrance. |
| `ease-out` | Slows the motion toward the end. |
| `${loopEnd}s` | Delay before the entrance begins. |
| `forwards` | Retains the final visible state after completion. |

The heading initially has `opacity: 0`, keeping it hidden during the SVG loop and the delay.

Its `onAnimationEnd` handler checks that the completed animation is `revealName`, then sets `nameVisible` to `true`. This triggers the measurement effect and starts the circle's move to the period position.

The accessible label `FinApp.` includes the final punctuation because the visible period is an image rather than a text character.

## 10. The period placeholder

An empty inline span follows `FinApp` inside the heading:

```tsx
width: "0.14em",
height: "0.14em",
ml: "0.04em",
verticalAlign: "baseline",
```

The span reserves a small square at the text baseline plus a little space after the name. It has no painted background; the moving SVG circle becomes the visible period.

An `em` is relative to this element's font size, so the period's target size scales with the heading. Reserving this space from the beginning keeps the completed word and period centered without a final layout jump.

`aria-hidden="true"` keeps this empty, decorative placeholder out of the accessibility tree.

## 11. Component export

```tsx
export default App;
```

This allows the application's entry file to import and render `App`.

## 12. Values to adjust together

| Desired change | Relevant code |
|---|---|
| Change the SVG speed or stagger | Edit timing in `animation1.svg`, then update `loopEnd` to the latest start time plus duration. |
| Change how the name appears | Edit `revealName` and its `0.9s` duration. |
| Change the circle's travel speed | Edit all four `0.8s` transition durations. |
| Resize or space the period | Edit the placeholder's `0.14em` dimensions or `0.04em` margin. |
| Change the brand color | Update the heading color and the SVG's fill colors. |
| Replace the SVG artwork | Recalculate its final circle diameter and center used in the width formula and transform. |

The SVG geometry and `loopEnd` are explicit assumptions about the current asset. Keeping those values synchronized with asset changes preserves the sequence and alignment.
