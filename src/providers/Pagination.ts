// Stores next token of each query for pagination
// This is refreshed on each reload
interface Tokens {
  // Query signature
  [index: string]: Array<string | null | undefined>; // Array of next tokens by page
}

export class Pagination {
  static tokens: Tokens = {};

  static getNextToken(
    querySignature: string,
    page: number
  ): string | null | undefined {
    // Initialize the array of tokens
    if (!this.tokens[querySignature]) {
      this.tokens[querySignature] = [];
    }

    if (
      page !== 1 &&
      typeof this.tokens[querySignature][page - 1] === "undefined"
    ) {
      return undefined;
    }

    return this.tokens[querySignature][page - 1] ?? null;
  }

  static saveNextToken(
    nextToken: string | null,
    querySignature: string,
    page: number
  ): void {
    // Initialize the array of tokens
    if (!this.tokens[querySignature]) {
      this.tokens[querySignature] = [];
    }

    this.tokens[querySignature][page] = nextToken;
  }
}
