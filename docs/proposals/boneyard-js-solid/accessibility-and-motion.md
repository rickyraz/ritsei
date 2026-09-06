# Accessibility and Motion Specification

## 1. Accessibility ownership

The Solid adapter owns semantic loading behavior; Boneyard geometry does not define accessibility.

Required behavior:

- set `aria-busy="true"` on the meaningful loading container;
- remove `aria-busy` when real content is ready;
- mark the visual bone overlay and every bone `aria-hidden="true"`;
- keep the overlay out of hit testing with `pointer-events: none`;
- do not add a live-region announcement for every bone;
- preserve the real content's accessible name and relationships; and
- do not make visual placeholder geometry the only representation of a critical value or action.

The adapter must not steal focus, trap keyboard input, or make loading state an authorization
signal. If a feature needs a status announcement, the feature owns its localized message.

## 2. Content and fallback semantics

Skeleton, empty, error, and disabled states are distinct:

```text
initial pending     -> Skeleton
success + data     -> real content
success + empty    -> empty state
failure             -> error state
background refresh  -> existing content plus optional quiet indicator
```

The adapter must not infer these states from children, Query, or Effect. It receives explicit
`loading` and renders the visual projection.

## 3. Motion ownership

The adapter may expose animation configuration, but it must not own a second motion runtime. The
RITSEI integration uses the RITSEI Motion wrapper for temporal behavior and PandaCSS for CSS states.
The upstream adapter may provide neutral bone animation classes or CSS variables, but it must not
import `motion`, `framer-motion`, or a React motion package.

The default behavior must be quiet and deterministic:

```text
pulse      default optional loading feedback
shimmer    opt-in expressive feedback
solid      reduced-motion and explicit low-distraction mode
stagger    off by default
```

Motion must not determine whether a command, transaction, authorization decision, or workflow step
succeeds.

## 4. Reduced motion

The adapter must honor the user preference:

```css
@media (prefers-reduced-motion: reduce) {
  .boneyard-bone,
  .boneyard-overlay {
    animation: none;
    transition: none;
  }
}
```

The runtime must also support an explicit `solid` mode so a consuming design system can apply its
own reduced-motion policy. Reduced motion preserves loading feedback but removes shimmer, pulse,
stagger, and spatial traversal.

## 5. Theme and color

Boneyard geometry must remain theme-agnostic. The adapter may accept semantic color values or CSS
custom properties:

```text
--boneyard-color
--boneyard-dark-color
--boneyard-highlight
--boneyard-dark-highlight
```

The default colors are fallback values only. RITSEI maps these values to PandaCSS semantic tokens and
must not expose hard-coded vendor colors in product feature code.

## 6. Keyboard and zoom behavior

Skeleton is not an interactive control. The adapter must pass evidence for:

- keyboard traversal of the real content before and after loading;
- no focusable bone nodes;
- 200% and 400% zoom without overlay clipping that hides real content semantics;
- localization strings in fallback/status content; and
- responsive selection when the container changes independently of viewport width.

## 7. Motion interruption and cleanup

When loading changes from `true` to `false` or the component unmounts:

- pending transition work is stopped or canceled;
- no timer or observer remains active;
- the real content becomes available according to the requested transition policy; and
- repeated loading toggles do not accumulate DOM nodes or event listeners.

The adapter must remain correct when loading changes faster than a transition duration.
