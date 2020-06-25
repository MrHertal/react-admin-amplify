import { Pagination } from "../../providers/Pagination";

test("go from page 1 to page 4", () => {
  const querySignature = JSON.stringify({
    queryName: "listEmployees",
    queryVariables: {},
    perPage: 10,
  });

  let page = 1;
  let nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBeNull();

  // query
  nextToken = "token1";

  Pagination.saveNextToken(nextToken, querySignature, page);

  page = 2;
  nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBe("token1");

  // query
  nextToken = "token2";

  Pagination.saveNextToken(nextToken, querySignature, page);

  page = 3;
  nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBe("token2");

  // query
  nextToken = null;

  Pagination.saveNextToken(nextToken, querySignature, page);

  page = 4;
  nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBeNull;
});

test("go to a page that is out of range", () => {
  const querySignature = JSON.stringify({
    queryName: "listEmployees",
    queryVariables: {},
    perPage: 10,
  });
  const page = 6;

  const nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBeUndefined();
});

test("go from page 1 to page 3 with filter", () => {
  const querySignature = JSON.stringify({
    queryName: "employeeByName",
    queryVariables: {
      name: "Amanda",
    },
    perPage: 10,
  });

  let page = 1;
  let nextToken;

  Pagination.saveNextToken("next1", querySignature, page);

  page = 2;
  nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBe("next1");

  // query
  nextToken = null;

  Pagination.saveNextToken(nextToken, querySignature, page);

  page = 3;
  nextToken = Pagination.getNextToken(querySignature, page);

  expect(nextToken).toBeNull();
});
