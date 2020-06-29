import { Filter } from "../../providers/Filter";

const queries = {
  ordersByProduct: "ordersByProductQuery",
};

test("get query name with empty filter", () => {
  const filter = {};

  const queryName = Filter.getQueryName(queries, filter);

  expect(queryName).toBeNull();
});

test("get query name with invalid filter", () => {
  const filter = {
    unknownQuery: {
      field: "value",
    },
  };

  expect(() => {
    Filter.getQueryName(queries, filter);
  }).toThrow();
});

test("get query name with valid filter", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
    },
  };

  const queryName = Filter.getQueryName(queries, filter);

  expect(queryName).toBe("ordersByProduct");
});

test("get query variables with empty filter", () => {
  const filter = {};

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toBeNull();
});

test("get query variables with incomplete filter", () => {
  const filter = {
    ordersByProduct: {},
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toBeNull();
});

test("get query variables with invalid hash key", () => {
  const filter = {
    ordersByProduct: {
      productId: null,
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toBeNull();
});

test("get query variables with valid hash key", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
  });
});

test("get query variables with too many keys", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
      date: "2020-06-24",
      id: "abc123",
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toBeNull();
});

test("get query variables with empty sort key", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
      id: {},
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
  });
});

test("get query variables with unknown operator", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
      id: {
        unknownOperator: "abc123",
      },
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
  });
});

test("get query variables with invalid sort key", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
      id: {
        eq: undefined,
      },
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
  });
});

test("get query variables with incomplete composite sort key", () => {
  const filter = {
    ordersByProduct: {
      statusDate: {
        eq: {
          status: "pending",
        },
      },
      productId: "product1",
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
  });
});

test("get query variables with invalid sort key inputs", () => {
  const filter = {
    ordersByProduct: {
      statusDate: {
        eq: {
          status: "pending",
          date: null,
        },
      },
      productId: "product1",
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
  });
});

test("get query variables with valid sort key", () => {
  const filter = {
    ordersByProduct: {
      id: {
        eq: "abc123",
      },
      productId: "product1",
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
    id: {
      eq: "abc123",
    },
  });
});

test("get query variables with valid sort key inputs", () => {
  const filter = {
    ordersByProduct: {
      productId: "product1",
      statusDate: {
        eq: {
          status: "pending",
          date: "2020-06-24",
        },
      },
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
    statusDate: {
      eq: {
        status: "pending",
        date: "2020-06-24",
      },
    },
  });
});

test("get query variables with integer hash key", () => {
  const filter = {
    productsByAmount: {
      amount: 200,
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    amount: 200,
  });
});

test("get query variables with integer sort key", () => {
  const filter = {
    productsByAmount: {
      amount: {
        gt: 100,
      },
      productId: "product1",
    },
  };

  const queryVariables = Filter.getQueryVariables(filter);

  expect(queryVariables).toEqual({
    productId: "product1",
    amount: {
      gt: 100,
    },
  });
});
