declare namespace jest {
  interface Matchers<R> {
    toCompleteWithinTimeout(ms: number): Promise<R>
  }
}
