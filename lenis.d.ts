// lenis.d.ts
declare module '@studio-freight/lenis' {
    class Lenis {
      constructor(options?: any);
      stop(): void;
      start(): void;
      raf(time: number): void;
    }
    export = Lenis;
  }
  