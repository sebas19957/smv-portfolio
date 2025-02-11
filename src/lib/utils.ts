import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const customCursor = (): void => {
  const e = document.querySelector(".cursor-inner");
  const t = document.querySelector(".cursor-outer");

  if (!e || !t) {
    console.warn("Cursor elements not found");
    return;
  }

  const interactiveSelectors = [
    "a",
    "button",
    '[role="button"]',
    "input",
    "select",
    "textarea",
    "[onclick]",
    ".cursor-pointer",
    '[data-clickable="true"]',
  ].join(", ");

  const handleMouseMove = (event: MouseEvent) => {
    requestAnimationFrame(() => {
      (
        e as HTMLElement
      ).style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      (
        t as HTMLElement
      ).style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });
  };

  const handleInteraction = (element: Element) => {
    element.addEventListener("mouseenter", () => {
      e.classList.add("cursor-hover");
      t.classList.add("cursor-hover");
    });
    element.addEventListener("mouseleave", () => {
      e.classList.remove("cursor-hover");
      t.classList.remove("cursor-hover");
    });
  };

  window.addEventListener("mousemove", handleMouseMove);

  const interactiveElements = document.querySelectorAll(interactiveSelectors);
  interactiveElements.forEach(handleInteraction);

  // Make cursors visible
  (e as HTMLElement).style.visibility = "visible";
  (t as HTMLElement).style.visibility = "visible";
};
