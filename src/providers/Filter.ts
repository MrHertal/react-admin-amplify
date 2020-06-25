const sortOperators = ["eq", "le", "lt", "ge", "gt", "beginsWith"];
const bannedKeyNames = ["sortDirection", "limit", "nextIndex"];

export class Filter {
  static getQueryName(
    queries: Record<string, string>,
    filter: Record<string, unknown>
  ): string | null {
    if (!this.isObjectOfLength(filter, 1)) {
      return null;
    }

    // The filter unique field is the query name
    const queryName = Object.keys(filter)[0];

    if (!queries[queryName]) {
      console.log(`Could not find query ${queryName}`);
      throw new Error("Data provider error");
    }

    return queryName;
  }

  static getQueryVariables(
    filter: Record<string, unknown>
  ): Record<string, unknown> | null {
    if (!this.isObjectOfLength(filter, 1)) {
      return null;
    }

    const queryParams = Object.values(filter)[0] as Record<string, unknown>;

    for (const bannedKeyName of bannedKeyNames) {
      delete queryParams[bannedKeyName];
    }

    // Case when there is only the partition key
    if (this.isObjectOfLength(queryParams, 1)) {
      const onlyParam = Object.values(queryParams)[0];

      if (this.isPartitionKey(onlyParam)) {
        return queryParams;
      }

      return null;
    }

    // Case when there are the partition key and the sort key
    if (this.isObjectOfLength(queryParams, 2)) {
      const firstParam = Object.values(queryParams)[0];
      const secondParam = Object.values(queryParams)[1];

      if (this.isPartitionKey(firstParam)) {
        if (this.isSortKey(secondParam)) {
          return queryParams;
        }

        return {
          [Object.keys(queryParams)[0]]: firstParam,
        };
      }

      if (this.isPartitionKey(secondParam)) {
        if (this.isSortKey(firstParam)) {
          return queryParams;
        }

        return {
          [Object.keys(queryParams)[1]]: secondParam,
        };
      }
    }

    return null;
  }

  static isObject(obj: unknown): boolean {
    return obj !== null && typeof obj === "object";
  }

  static isObjectOfLength(obj: unknown, length = 0): boolean {
    if (!this.isObject(obj)) {
      return false;
    }

    return Object.keys(obj as Record<string, unknown>).length === length;
  }

  static isString(str: unknown): boolean {
    return typeof str === "string" && str !== "";
  }

  static isPartitionKey(str: unknown): boolean {
    return this.isString(str);
  }

  static isSortKey(obj: unknown): boolean {
    if (!this.isObjectOfLength(obj, 1)) {
      return false;
    }

    const key = obj as Record<string, unknown>;

    if (!sortOperators.includes(Object.keys(key)[0])) {
      return false;
    }

    const keyInput = Object.values(key)[0] as Record<string, unknown>;

    if (this.isString(keyInput)) {
      return true;
    }

    if (this.isObject(keyInput) && Object.keys(keyInput).length > 0) {
      for (const sortField in keyInput) {
        if (!this.isString(keyInput[sortField])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }
}
