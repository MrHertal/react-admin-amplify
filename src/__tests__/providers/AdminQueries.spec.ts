import { AdminQueries } from "../../providers/AdminQueries";

afterAll(() => {
  jest.restoreAllMocks();
});

test("list users", async () => {
  const mockGet = jest.fn(async () => ({
    Users: [
      {
        Username: "demo",
        Attributes: [
          { Name: "sub", Value: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900" },
          { Name: "email_verified", Value: "true" },
          { Name: "email", Value: "demo@example.com" },
        ],
        UserCreateDate: "2021-02-07T13:21:09.763Z",
        UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
        Enabled: true,
        UserStatus: "CONFIRMED",
      },
    ],
  }));

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoUsers({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });

  const calls = mockGet.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("/listUsers");
  expect(call[1]).toEqual({ limit: 10, token: null });

  expect(result).toEqual({
    data: [
      {
        id: "demo",
        Enabled: true,
        UserStatus: "CONFIRMED",
        sub: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900",
        email_verified: "true",
        email: "demo@example.com",
        UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
        UserCreateDate: "2021-02-07T13:21:09.763Z",
      },
    ],
    total: 1,
  });
});

test("list users filtered by username", async () => {
  const mockGet = jest.fn(async () => ({
    Username: "demo",
    UserAttributes: [
      { Name: "sub", Value: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900" },
      { Name: "email_verified", Value: "true" },
      { Name: "email", Value: "demo@example.com" },
    ],
    UserCreateDate: "2021-02-07T13:21:09.763Z",
    UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
    Enabled: true,
    UserStatus: "CONFIRMED",
  }));

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoUsers({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {
      getUser: {
        username: "demo",
      },
    },
  });

  const calls = mockGet.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("/getUser");
  expect(call[1]).toEqual({
    username: "demo",
  });

  expect(result).toEqual({
    data: [
      {
        id: "demo",
        Enabled: true,
        UserStatus: "CONFIRMED",
        sub: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900",
        email_verified: "true",
        email: "demo@example.com",
        UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
        UserCreateDate: "2021-02-07T13:21:09.763Z",
      },
    ],
    total: 1,
  });
});

test("list users filtered by username not found", async () => {
  const mockGet = jest.fn().mockRejectedValue({ response: { status: 400 } });

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoUsers({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {
      getUser: {
        username: "demo",
      },
    },
  });

  expect(result).toEqual({
    data: [],
    total: 0,
  });
});

test("list users filtered by group", async () => {
  const mockGet = jest.fn(async () => ({
    Users: [
      {
        Username: "demo",
        Attributes: [
          { Name: "sub", Value: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900" },
          { Name: "email_verified", Value: "true" },
          { Name: "email", Value: "demo@example.com" },
        ],
        UserCreateDate: "2021-02-07T13:21:09.763Z",
        UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
        Enabled: true,
        UserStatus: "CONFIRMED",
      },
    ],
  }));

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoUsers({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {
      listUsersInGroup: {
        groupname: "admin",
      },
    },
  });

  const calls = mockGet.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("/listUsersInGroup");
  expect(call[1]).toEqual({
    groupname: "admin",
    limit: 10,
    token: null,
  });

  expect(result).toEqual({
    data: [
      {
        id: "demo",
        Enabled: true,
        UserStatus: "CONFIRMED",
        sub: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900",
        email_verified: "true",
        email: "demo@example.com",
        UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
        UserCreateDate: "2021-02-07T13:21:09.763Z",
      },
    ],
    total: 1,
  });
});

test("list users filtered by group not found", async () => {
  const mockGet = jest.fn().mockRejectedValue({ response: { status: 400 } });

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoUsers({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {
      listUsersInGroup: {
        groupname: "admin",
      },
    },
  });

  expect(result).toEqual({
    data: [],
    total: 0,
  });
});

test("list groups", async () => {
  const mockGet = jest.fn(async () => ({
    Groups: [
      {
        GroupName: "admin",
        UserPoolId: "userPoolId",
        RoleArn: "roleArn",
        Precedence: 1,
        LastModifiedDate: "2021-02-07T13:18:12.790Z",
        CreationDate: "2021-02-07T13:18:12.790Z",
      },
    ],
  }));

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoGroups({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });

  const calls = mockGet.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("/listGroups");
  expect(call[1]).toEqual({ limit: 10, token: null });

  expect(result).toEqual({
    data: [
      {
        id: "admin",
        UserPoolId: "userPoolId",
        RoleArn: "roleArn",
        Precedence: 1,
        LastModifiedDate: "2021-02-07T13:18:12.790Z",
        CreationDate: "2021-02-07T13:18:12.790Z",
      },
    ],
    total: 1,
  });
});

test("list groups filtered by username", async () => {
  const mockGet = jest.fn(async () => ({ Groups: [{ GroupName: "admin" }] }));

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoGroups({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {
      listGroupsForUser: {
        username: "demo",
      },
    },
  });

  const calls = mockGet.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("/listGroupsForUser");
  expect(call[1]).toEqual({ username: "demo", limit: 10, token: null });

  expect(result).toEqual({
    data: [
      {
        id: "admin",
      },
    ],
    total: 1,
  });
});

test("list groups filtered by username not found", async () => {
  const mockGet = jest.fn().mockRejectedValue({ response: { status: 400 } });

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.listCognitoGroups({
    pagination: { page: 1, perPage: 10 },
    sort: { field: "id", order: "ASC" },
    filter: {
      listGroupsForUser: {
        username: "demo",
      },
    },
  });

  expect(result).toEqual({
    data: [],
    total: 0,
  });
});

test("get user", async () => {
  const mockGet = jest.fn(async () => ({
    Username: "demo",
    UserAttributes: [
      { Name: "sub", Value: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900" },
      { Name: "email_verified", Value: "true" },
      { Name: "email", Value: "demo@example.com" },
    ],
    UserCreateDate: "2021-02-07T13:21:09.763Z",
    UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
    Enabled: true,
    UserStatus: "CONFIRMED",
  }));

  jest.spyOn(AdminQueries, "get").mockImplementation(mockGet);

  const result = await AdminQueries.getCognitoUser({
    id: "demo",
  });

  const calls = mockGet.mock.calls;

  expect(calls.length).toBe(1);

  const call = <Array<unknown>>calls[0];

  expect(call[0]).toBe("/getUser");
  expect(call[1]).toEqual({
    username: "demo",
  });

  expect(result).toEqual({
    data: {
      id: "demo",
      Enabled: true,
      UserStatus: "CONFIRMED",
      sub: "356ccfa0-7bf1-4fc9-b0b3-f66254ba7900",
      email_verified: "true",
      email: "demo@example.com",
      UserLastModifiedDate: "2021-02-07T13:23:49.169Z",
      UserCreateDate: "2021-02-07T13:21:09.763Z",
    },
  });
});
