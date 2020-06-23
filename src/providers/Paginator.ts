// Stores next token of each query for pagination
// This is refreshed on each reload
interface Tokens {
  // Query name
  [index: string]: {
    // Query variables serialized
    [index: string]: Array<string | null | undefined>; // Array of next tokens by page
  };
}

export class Paginator {
  static tokens: Tokens = {};

  static getNextToken(
    queryName: string,
    queryVariables: Record<string, unknown>,
    page: number
  ): string | null | undefined {
    const queryIndex = JSON.stringify(queryVariables);

    if (!this.tokens[queryName]) {
      this.tokens[queryName] = {};
    }

    // Initialize the array of tokens
    if (!this.tokens[queryName][queryIndex]) {
      this.tokens[queryName][queryIndex] = [];
    }

    if (
      page !== 1 &&
      typeof this.tokens[queryName][queryIndex][page - 1] === "undefined"
    ) {
      return undefined;
    }

    return this.tokens[queryName][queryIndex][page - 1] ?? null;
  }

  static saveNextToken(
    nextToken: string | null,
    queryName: string,
    queryVariables: Record<string, unknown>,
    page: number
  ): void {
    const queryIndex = JSON.stringify(queryVariables);

    if (!this.tokens[queryName]) {
      this.tokens[queryName] = {};
    }

    // Initialize the array of tokens
    if (!this.tokens[queryName][queryIndex]) {
      this.tokens[queryName][queryIndex] = [];
    }

    this.tokens[queryName][queryIndex][page] = nextToken;
  }
}
