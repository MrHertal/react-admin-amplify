import { Paginator } from "../../providers/Paginator";

test("go from page 1 to page 4", () => {
  const queryName = "listEmployees";
  const queryVariables = {};

  let page = 1;
  let nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBeNull();

  // query
  nextToken = "token1";

  Paginator.saveNextToken(nextToken, queryName, queryVariables, page);

  page = 2;
  nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBe("token1");

  // query
  nextToken = "token2";

  Paginator.saveNextToken(nextToken, queryName, queryVariables, page);

  page = 3;
  nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBe("token2");

  // query
  nextToken = null;

  Paginator.saveNextToken(nextToken, queryName, queryVariables, page);

  page = 4;
  nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBeNull;
});

test("go to a page that is out of range", () => {
  const queryName = "listEmployees";
  const queryVariables = {};
  const page = 6;

  const nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBeUndefined();
});

test("go from page 1 to page 3 with filter", () => {
  const queryName = "employeeByName";
  const queryVariables = {
    name: "Amanda",
  };

  let page = 1;
  let nextToken;

  Paginator.saveNextToken("next1", queryName, queryVariables, page);

  page = 2;
  nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBe("next1");

  // query
  nextToken = null;

  Paginator.saveNextToken(nextToken, queryName, queryVariables, page);

  page = 3;
  nextToken = Paginator.getNextToken(queryName, queryVariables, page);

  expect(nextToken).toBeNull();
});
