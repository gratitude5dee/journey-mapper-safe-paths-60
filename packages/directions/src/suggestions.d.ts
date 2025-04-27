
declare module 'suggestions' {
  interface SuggestionsOptions {
    limit?: number;
    filter?: (suggestion: any) => boolean;
  }

  class Suggestions {
    constructor(input: HTMLInputElement, source: (query: string, callback: (results: any[]) => void) => void, options?: SuggestionsOptions);
    
    getItemValue(item: any): string;
    on(event: string, handler: (event: any) => void): void;
    off(event: string, handler?: (event: any) => void): void;
  }

  export = Suggestions;
}
