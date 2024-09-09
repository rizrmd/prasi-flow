interface CaretPosition {
  start: number;
  end: number;
}

// Function to save caret position
export function saveCaretPosition(
  element: HTMLInputElement | HTMLTextAreaElement
): CaretPosition | null {
  const start = element.selectionStart;
  const end = element.selectionEnd;

  if (start !== null && end !== null) {
    return {
      start,
      end,
    };
  }
  return null;
}

// Function to restore caret position
export function restoreCaretPosition(
  element: HTMLInputElement | HTMLTextAreaElement,
  position: CaretPosition | null
): void {
  if (position && element.setSelectionRange) {
    element.focus();
    element.setSelectionRange(position.start, position.end);
  }
}

const focus = { caret: null as any, value: null as any, timeout: null as any };

export const restoreFocus = (value: any, ref?: { current: any }) => {
  return (el: any) => {
    if (!el) return;
    if (ref) ref.current = el;

    if (focus.caret && focus.value === value) {
      clearTimeout(focus.timeout);
      focus.timeout = setTimeout(() => {
        el.focus();
        restoreCaretPosition(el, focus.caret);
        focus.caret = null;
        focus.value = null;
      }, 100);
    }
  };
};
export const lockFocus = (value: null, ref: { current: any }) => {
  focus.caret = saveCaretPosition(ref.current);
  focus.value = value;
};
