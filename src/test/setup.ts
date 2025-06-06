import '@testing-library/jest-dom'

// DOMのmocking
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// crypto.randomUUIDのmock
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substr(2, 9),
  },
});

// ResizeObserverのmock
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};