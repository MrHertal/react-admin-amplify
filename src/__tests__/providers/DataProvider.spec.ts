import { DataProvider } from "../../providers/DataProvider";

const queries = {
  listResources: "listResourcesQuery",
  resourcesByField: "resourcesByFieldQuery",
  getResource: "getResourceQuery",
  referencesByResourceId: "referencesByResourceIdQuery",
};

const mutations = {
  createResource: "createResourceQuery",
  updateResource: "updateResourceQuery",
  deleteResource: "deleteResourceQuery",
};

afterAll(() => {
  jest.restoreAllMocks();
});

test("get list", async () => {
  const mockGraphql = jest.fn(async () => ({
    listResources: {
      items: [],
      nextToken: null,
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.getList("resources", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("listResourcesQuery");
  expect(call[1]).toEqual({ limit: 10, nextToken: null });

  expect(result).toEqual({ data: [], total: 0 });
});

test("get list with more than one page", async () => {
  const mockGraphql = jest.fn(async () => ({
    listResources: {
      items: [],
      nextToken: "token1",
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.getList("resources", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("listResourcesQuery");
  expect(call[1]).toEqual({ limit: 10, nextToken: null });

  expect(result).toEqual({ data: [], total: 1 });
});

test("get list with filter and sortering", async () => {
  const mockGraphql = jest.fn(async () => ({
    resourcesByField: {
      items: [],
      nextToken: null,
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.getList("resources", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "resourcesByField", order: "DESC" },
    filter: {
      resourcesByField: {
        field: "fieldValue",
        sortField: {
          eq: "sortFieldValue",
        },
      },
    },
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("resourcesByFieldQuery");
  expect(call[1]).toEqual({
    field: "fieldValue",
    sortField: {
      eq: "sortFieldValue",
    },
    sortDirection: "DESC",
    limit: 10,
    nextToken: null,
  });

  expect(result).toEqual({ data: [], total: 0 });
});

test("get one", async () => {
  const mockGraphql = jest.fn(async () => ({
    getResource: { id: "resource1", field: "fieldValue" },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.getOne("resources", { id: "resource1" });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("getResourceQuery");
  expect(call[1]).toEqual({ id: "resource1" });

  expect(result).toEqual({ data: { id: "resource1", field: "fieldValue" } });
});

test("get many", async () => {
  const mockGraphql = jest.fn(async () => ({
    getResource: { id: "resource12", field: "fieldValue" },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.getMany("resources", {
    ids: ["resource1", "resource2"],
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(2);

  const firstCall = <Array<unknown>>calls[0];

  expect(firstCall[0]).toBe("getResourceQuery");
  expect(firstCall[1]).toEqual({ id: "resource1" });

  const secondCall = <Array<unknown>>calls[1];

  expect(secondCall[0]).toBe("getResourceQuery");
  expect(secondCall[1]).toEqual({ id: "resource2" });

  expect(result).toEqual({
    data: [
      { id: "resource12", field: "fieldValue" },
      { id: "resource12", field: "fieldValue" },
    ],
  });
});

test("get many reference", async () => {
  const mockGraphql = jest.fn(async () => ({
    referencesByResourceId: {
      items: [],
      nextToken: null,
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.getManyReference("references", {
    target: "referencesByResourceId.resourceId",
    id: "resource1",
    pagination: { page: 1, perPage: 10 },
    sort: { field: "referencesByResourceId", order: "DESC" },
    filter: {},
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("referencesByResourceIdQuery");
  expect(call[1]).toEqual({
    resourceId: "resource1",
    sortDirection: "DESC",
    limit: 10,
    nextToken: null,
  });

  expect(result).toEqual({ data: [], total: 0 });
});

test("create", async () => {
  const mockGraphql = jest.fn(async () => ({
    createResource: { id: "resource1", field: "fieldValue", _version: 1 },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.create("resources", {
    data: { field: "fieldValue" },
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("createResourceQuery");
  expect(call[1]).toEqual({
    input: { field: "fieldValue" },
  });

  expect(result).toEqual({
    data: { id: "resource1", field: "fieldValue", _version: 1 },
  });
});

test("update", async () => {
  const mockGraphql = jest.fn(async () => ({
    updateResource: {
      id: "resource1",
      field: "newFieldValue",
      _version: 2,
      _deleted: false,
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.update("resources", {
    id: "resource1",
    data: {
      id: "resource1",
      field: "newFieldValue",
      _version: 1,
      _deleted: false,
    },
    previousData: {
      id: "resource1",
      field: "oldFieldValue",
      _version: 1,
      _deleted: false,
    },
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("updateResourceQuery");
  expect(call[1]).toEqual({
    input: { id: "resource1", field: "newFieldValue", _version: 1 },
  });

  expect(result).toEqual({
    data: {
      id: "resource1",
      field: "newFieldValue",
      _version: 2,
      _deleted: false,
    },
  });
});

test("update many", async () => {
  const mockGraphql = jest.fn(async () => ({
    updateResource: {
      id: "resource12",
      field: "newFieldValue",
      updatedAt: "2020-06-17T14:05:44.598Z",
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.updateMany("resources", {
    ids: ["resource1", "resource2"],
    data: {
      id: "resource12",
      field: "newFieldValue",
      updatedAt: "2020-06-17T14:05:44.598Z",
    },
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(2);

  const firstCall = <Array<unknown>>calls[0];

  expect(firstCall[0]).toBe("updateResourceQuery");
  expect(firstCall[1]).toEqual({
    input: { id: "resource1", field: "newFieldValue" },
  });

  const secondCall = <Array<unknown>>calls[1];

  expect(secondCall[0]).toBe("updateResourceQuery");
  expect(secondCall[1]).toEqual({
    input: { id: "resource2", field: "newFieldValue" },
  });

  expect(result).toEqual({
    data: ["resource1", "resource2"],
  });
});

test("delete", async () => {
  const mockGraphql = jest.fn(async () => ({
    deleteResource: {
      id: "resource1",
      field: "fieldValue",
      _version: 2,
      _deleted: true,
    },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.delete("resources", {
    id: "resource1",
    previousData: {
      id: "resource1",
      field: "fieldValue",
      _version: 1,
      _deleted: false,
    },
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("deleteResourceQuery");
  expect(call[1]).toEqual({
    input: { id: "resource1", _version: 1 },
  });

  expect(result).toEqual({
    data: {
      id: "resource1",
      field: "fieldValue",
      _version: 2,
      _deleted: true,
    },
  });
});

test("delete many", async () => {
  const mockGraphql = jest.fn(async () => ({
    deleteResource: { id: "resource12", field: "fieldValue" },
  }));

  jest.spyOn(DataProvider.prototype, "graphql").mockImplementation(mockGraphql);

  const dataProvider = new DataProvider({ queries, mutations });

  const result = await dataProvider.deleteMany("resources", {
    ids: ["resource1", "resource2"],
  });

  const calls = mockGraphql.mock.calls;

  expect(calls.length).toBe(2);

  const firstCall = <Array<unknown>>calls[0];

  expect(firstCall[0]).toBe("deleteResourceQuery");
  expect(firstCall[1]).toEqual({
    input: { id: "resource1" },
  });

  const secondCall = <Array<unknown>>calls[1];

  expect(secondCall[0]).toBe("deleteResourceQuery");
  expect(secondCall[1]).toEqual({
    input: { id: "resource2" },
  });

  expect(result).toEqual({
    data: ["resource1", "resource2"],
  });
});

test("get unknown query", () => {
  const dataProvider = new DataProvider({ queries, mutations });

  expect(() => {
    dataProvider.getQuery("unknownQuery");
  }).toThrow();
});
