# App.tsx: Trade.ai Animated Hero

Updated September 19, 2026. This guide describes the current [App.tsx](../../../financeApp/src/App.tsx) and its use of [animation1.svg](../../../financeApp/src/assets/images/animation1.svg).

## What the component does

`App` renders a white hero section with a light gray border and soft shadow. Its animation ends with the blue name **Trade.ai** centered inside the section. The period is the original animated circle, moved and resized into position; it is not a text character.

This component currently handles presentation and animation. It does not implement trading, market data, or AI services.

## Sequence and timing

| Stage | Trigger | Behavior | Duration |
|---|---|---|---|
| Initialize | Component mounts | Reset state and create a unique playback identifier. | Immediate effect |
| Play SVG | Image loads | SVG shapes perform their staggered, one-time loops. | Each loop is 2.5 seconds; latest completion is about 3.58 seconds |
| Reveal name | Image loaded, followed by `loopEnd` delay | `Trade` fades in and grows from 85% to full size. | 0.9 seconds |
| Form period | Heading animation ends | Measure the period placeholder, then move and shrink the circle to it. | 0.8 seconds |
| Reveal suffix | Image transform transition ends | `ai` fades in and grows into place. | 0.5 seconds |

The intended sequence takes approximately **5.78 seconds after image loading**. The name uses a fixed delay matching the SVG timing; the following stages use browser completion events. The SVG and CSS have separate timelines, so their initial synchronization is approximate rather than a direct SVG completion callback.

## Imports and shared animation definitions

React provides `useState`, `useRef`, `useEffect`, and `useLayoutEffect`. Material UI provides layout components, typography, baseline styles, and the `keyframes` helper. Importing the SVG supplies its Vite-managed asset URL.

```tsx
const loopEnd = 3.583332;
const revealName = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;
```

`loopEnd` equals the latest SVG start time (`1.083332` seconds) plus its 2.5-second duration. If the SVG timing changes, update this value too.

`revealName` is reused by the main heading and the `ai` suffix, with different durations. Scaling uses the default center origin, so each element grows in place.

## useState: tracking the animation stages

Calling a state setter requests a React render with the updated value.

| State | Initial value | Purpose |
|---|---|---|
| `animationLoaded` | `false` | Enables the delayed heading animation after the image fires `onLoad`. |
| `nameVisible` | `false` | Records that the heading entrance has completed and allows period measurements. |
| `periodSettled` | `false` | Starts the suffix animation after the image finishes its transform transition. |
| `playbackId` | `null` | Identifies a fresh playback and controls whether the image is rendered. |
| `periodPosition` | `null` | Holds the final image position and width in pixels: `{ left, top, width }`. |

`nameVisible` describes completion of the entrance, not its first visible frame. Similarly, `periodSettled` is set by a specific transition event rather than by checking pixel coordinates.

The type `string | null` permits an identifier or an uninitialized value. The position object also uses `| null` because no destination is known before measurement.

## useRef: accessing the rendered elements

```tsx
const heroRef = useRef<HTMLElement>(null);
const periodRef = useRef<HTMLSpanElement>(null);
```

- `heroRef` points to the hero section. It supplies the origin for the image coordinates.
- `periodRef` points to an empty inline span beside `Trade`. It supplies the desired position and size of the period.

React fills each ref's `.current` property when the element is attached. Updating a ref does not cause a render. Refs allow measurement without searching the document for elements.

## useEffect: initializing and restarting playback

```tsx
useEffect(() => {
  setAnimationLoaded(false);
  setNameVisible(false);
  setPeriodSettled(false);
  setPeriodPosition(null);
  setPlaybackId(crypto.randomUUID());
}, []);
```

This clears the previous animation stages and creates a new playback identifier. The empty dependency array prevents normal state updates from rerunning initialization. Development Strict Mode may run effect setup more than once, and Vite Fast Refresh can rerun effects after edits.

The identifier is used in both React `key` values and the image URL:

```tsx
key={`circle-${playbackId}`}
src={`${animation}?playback=${playbackId}`}
```

Changing the key recreates the element. Changing the URL gives the SVG a distinct resource identity so a previously finished one-time animation is not intentionally reused. The heading key also changes to restart its CSS animation.

## useLayoutEffect: measuring the circle's destination

This effect depends on `[nameVisible]`. It returns early until the heading entrance has completed and both referenced elements exist.

Unlike `useEffect`, `useLayoutEffect` runs after React updates the DOM but before the browser paints. That lets the component measure the finished heading and apply its destination without first painting an intermediate layout.

The nested `positionCircle` function reads:

```tsx
const heroBounds = hero.getBoundingClientRect();
const dotBounds = period.getBoundingClientRect();
```

These rectangles use viewport coordinates. The calculation converts the placeholder's center to the hero's local positioning coordinates:

```tsx
left: dotBounds.left - heroBounds.left - hero.clientLeft + dotBounds.width / 2,
top: dotBounds.top - heroBounds.top - hero.clientTop + dotBounds.height / 2,
width: dotBounds.width * 1080 / 198.6,
```

Subtracting the hero position and border widths (`clientLeft` and `clientTop`) aligns the coordinates with the absolute image's containing block. Adding half the placeholder dimensions targets its center.

The width formula accounts for empty space around the SVG artwork: its viewBox is 1080 units wide, while the final visible circle is 198.6 units wide. The whole image must therefore be wider than the desired visible period.

### ResizeObserver and cleanup

After the first measurement, a `ResizeObserver` watches the hero, the period placeholder, and its parent heading. Size changes trigger another measurement so the period remains aligned across responsive layouts.

```tsx
return () => observer.disconnect();
```

The cleanup releases the observer when the effect is replaced or the component unmounts. `ResizeObserver` is a browser API, not a React hook.

## Page and hero layout

The fragment (`<>...</>`) groups the elements without adding an HTML wrapper. `CssBaseline` provides consistent baseline styling. `Container` renders a centered `<main>` with `maxWidth="lg"` and responsive vertical padding.

The hero `Box` renders a `<section>`:

| Style | Purpose |
|---|---|
| `position: "relative"` | Establishes the containing block for the absolute image. |
| `overflow: "hidden"` | Clips artwork outside the hero. |
| `minHeight: "50svh"` | Uses at least half the small viewport height. |
| Flex column with centered alignment | Centers the heading horizontally and vertically. |
| `p: { xs: 3, md: 4 }` | Adds responsive padding, 24px or 32px under the default theme. |
| White background and light gray border | Defines the section's surface. |
| Rounded corners and two soft shadows | Creates the raised appearance. |

MUI's `sx` prop accepts CSS styles and theme-aware shortcuts. `xs` supplies the base responsive value; `md` overrides it on medium screens and larger. Spacing numbers normally use the default 8px theme unit.

## SVG placement and movement

The SVG is rendered only after `playbackId` exists. It remains mounted when the sequence finishes because its final circle becomes the period.

Before measurement, the image uses `left: 50%`, `top: 50%`, and `translate(-50%, -50%)`. These center the SVG canvas in the hero. Its width is the smaller of the containing width and `36svh`, capped at 400px; automatic height preserves its proportions.

After measurement, `periodPosition` supplies the position and width. Expressions such as:

```tsx
periodPosition?.left ?? "50%"
```

use optional chaining (`?.`) to safely read an object that might be null, then nullish coalescing (`??`) to supply the initial position if no measurement exists.

The final transform is:

```tsx
translate(-50%, -79.907407%)
```

The final circle's center is `(540, 863)` within the SVG's 1080-by-1080 viewBox. These percentages align that visible circle, rather than the full image canvas, with the placeholder's center.

The `left`, `top`, `width`, and `transform` properties each transition over 0.8 seconds using `ease-in-out`. Updating the measured state starts that movement and resizing. `pointerEvents: "none"` keeps the decorative image from intercepting pointer input.

## Event handlers: connecting the stages

| Handler | What it checks | State update |
|---|---|---|
| Image `onLoad` | Image resource has loaded. | `animationLoaded = true` |
| Heading `onAnimationEnd` | Event belongs to the heading itself and matches `revealName`. | `nameVisible = true` |
| Image `onTransitionEnd` | Destination exists and the completed property is `transform`. | `periodSettled = true` |

The heading checks `event.target === event.currentTarget` because animation events from child elements can bubble upward. Without that guard, the suffix's animation could also be handled as a heading completion.

The image filters on `transform` because all four transitioning properties can emit completion events. They share the same duration, so this event serves as the signal to reveal the suffix.

## Heading and reserved period space

`Typography` renders an `<h1>` containing `Trade`, an empty period placeholder, and the `ai` span.

The heading uses blue `#206aff`, a weight of 700, and a line height of 1.1. On smaller screens, `clamp(1.75rem, 8vw, 3.5rem)` scales the font with viewport width while imposing a minimum and maximum. At the medium breakpoint, it becomes `5rem`. `whiteSpace: "nowrap"` keeps the brand together.

Its CSS animation waits for `loopEnd`, runs for 0.9 seconds with `ease-out`, and uses `forwards` to retain the final visible state.

The empty period span is `0.14em` square, with a `0.04em` left margin and baseline alignment. Because `em` follows the heading's font size, the target period scales with the text. The span has no painted background; the SVG supplies the visible dot.

## Revealing the ai suffix

The `ai` span is present from the beginning but initially transparent:

```tsx
animation: periodSettled ? `${revealName} 0.5s ease-out forwards` : "none"
```

When the circle's transition finishes, it fades and grows into view over half a second. Its reserved width ensures that the complete **Trade.ai** layout is centered from the start, avoiding a final width jump when the suffix appears.

## Accessibility

- The section's `aria-labelledby="hero-title"` links it to the heading.
- The heading's `aria-label="Trade.ai"` provides the complete name, including the graphical period.
- The image has an empty `alt`, marking it as decorative.
- The placeholder uses `aria-hidden="true"` because it has no standalone meaning.

The current code does not include a reduced-motion alternative or a recovery path for an image load failure. Since the name waits for the image's load event, a failed image load would leave the heading visually hidden.

## Export and maintenance notes

`export default App` allows the entry file to import and render the component.

When changing the sequence, keep these dependencies in mind:

| Change | Related values to review |
|---|---|
| SVG speed or stagger | Update `loopEnd` to match the latest SVG completion. |
| Replacement artwork | Recalculate the final circle center, diameter, and viewBox assumptions. |
| Period size | Adjust the placeholder dimensions and spacing. |
| Movement duration | Keep all four CSS transition durations consistent. |
| Brand name | Update visible text and the heading's accessible label. |
| Brand color | Update both the heading color and SVG fills. |

The React state coordinates the stages, the SVG supplies the initial motion, CSS animates the reveal and movement, and DOM measurements make the final period placement responsive.
