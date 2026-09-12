import { css } from "../generated/css/index.js"

// Approved shell/workspace layouts. Features consume names, not arbitrary style properties.
export const layout = {
  page: css({ minHeight: "screen", bg: "canvas", color: "text" }),
  header: css({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6",
    px: "6",
    py: "4",
    borderBottomWidth: "1px",
    borderColor: "boundary",
  }),
  wordmark: css({
    textStyle: "label",
    letterSpacing: "label",
    textDecoration: "none",
    color: "text",
  }),
  main: css({
    maxWidth: "6xl",
    mx: "auto",
    px: { base: "4", md: "8" },
    py: "8",
    minHeight: "96",
  }),
  notice: css({
    bg: "content",
    color: "muted",
    textStyle: "metadata",
    px: "6",
    py: "2",
    borderBottomWidth: "1px",
    borderColor: "boundary",
  }),
  stack: css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    minWidth: "0",
  }),
  row: css({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "3",
  }),
  footer: css({
    px: "6",
    py: "4",
    color: "muted",
    textStyle: "metadata",
    borderTopWidth: "1px",
    borderColor: "boundary",
  }),
  scroll: css({ overflowX: "auto" }),
  skip: css({
    position: "absolute",
    top: "2",
    left: "2",
    zIndex: "skipLink",
    p: "3",
    bg: "content",
    transform: "translateY(-200%)",
    _focus: { transform: "none" },
  }),
}
