import { API } from "@aws-amplify/api";
import { Auth } from "@aws-amplify/auth";
import {
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyResult,
  GetOneParams,
  GetOneResult,
} from "ra-core";
import { Pagination } from "./Pagination";

export class AdminQueries {
  static async listCognitoUsers(params: GetListParams): Promise<GetListResult> {
    // Only 2 filters are available with Cognito users
    const { getUser, listUsersInGroup } = params.filter;

    // First filter getUser
    // Returns one Cognito user by username
    if (getUser) {
      try {
        const userData = await AdminQueries.get("/getUser", {
          username: getUser.username,
        });

        const user = AdminQueries.parseUser(userData);

        return {
          data: [user],
          total: 1,
        };
      } catch (e) {
        // Returns 400 when user not found
        if (e.response?.status !== 400) {
          throw e;
        }

        return {
          data: [],
          total: 0,
        };
      }
    }

    let queryName = "listUsers";
    let queryVariables = {};

    // Second filter listUsersInGroup
    // Returns Cognito users by group
    if (listUsersInGroup) {
      queryName = "listUsersInGroup";
      queryVariables = {
        groupname: listUsersInGroup.groupname,
      };
    }

    const { page, perPage } = params.pagination;

    // Defines a unique identifier of the query
    const querySignature = JSON.stringify({
      queryName,
      queryVariables,
      perPage,
    });

    const token = Pagination.getNextToken(querySignature, page);

    // Checks if page requested is out of range
    if (typeof token === "undefined") {
      return {
        data: [],
        total: 0,
      }; // React admin will redirect to page 1
    }

    let queryResult = { Users: [], NextToken: undefined };

    // Executes the query
    try {
      queryResult = await AdminQueries.get(`/${queryName}`, {
        ...queryVariables,
        limit: perPage,
        token,
      });
    } catch (e) {
      // Returns 400 when group not found
      if (!listUsersInGroup || e.response?.status !== 400) {
        throw e;
      }
    }

    const users = queryResult.Users.map(AdminQueries.parseUser);
    const nextToken = queryResult.NextToken || null;

    // Saves next token
    Pagination.saveNextToken(nextToken, querySignature, page);

    // Computes total
    let total = (page - 1) * perPage + users.length;
    if (nextToken) {
      total++; // Tells react admin that there is at least one more page
    }

    return {
      data: users,
      total,
    };
  }

  static async listCognitoGroups(
    params: GetListParams
  ): Promise<GetListResult> {
    // Only 1 filter is available with Cognito groups
    const { listGroupsForUser } = params.filter;

    let queryName = "listGroups";
    let queryVariables = {};

    // Filter listGroupsForUser
    // Returns Cognito groups by user
    if (listGroupsForUser) {
      queryName = "listGroupsForUser";
      queryVariables = {
        username: listGroupsForUser.username,
      };
    }

    const { page, perPage } = params.pagination;

    // Defines a unique identifier of the query
    const querySignature = JSON.stringify({
      queryName,
      queryVariables,
      perPage,
    });

    const token = Pagination.getNextToken(querySignature, page);

    // Checks if page requested is out of range
    if (typeof token === "undefined") {
      return {
        data: [],
        total: 0,
      }; // React admin will redirect to page 1
    }

    let queryResult = { Groups: [], NextToken: undefined };

    // Executes the query
    try {
      queryResult = await AdminQueries.get(`/${queryName}`, {
        ...queryVariables,
        limit: perPage,
        token,
      });
    } catch (e) {
      // Returns 400 when user not found
      if (!listGroupsForUser || e.response?.status !== 400) {
        throw e;
      }
    }

    const groups = queryResult.Groups.map(AdminQueries.parseGroup);
    const nextToken = queryResult.NextToken || null;

    // Saves next token
    Pagination.saveNextToken(nextToken, querySignature, page);

    // Computes total
    let total = (page - 1) * perPage + groups.length;
    if (nextToken) {
      total++; // Tells react admin that there is at least one more page
    }

    return {
      data: groups,
      total,
    };
  }

  static async getCognitoUser(params: GetOneParams): Promise<GetOneResult> {
    // Executes the query
    const userData = await AdminQueries.get("/getUser", {
      username: params.id,
    });

    const user = AdminQueries.parseUser(userData);

    return {
      data: user,
    };
  }

  static async getManyCognitoUsers(
    params: GetManyParams
  ): Promise<GetManyResult> {
    const users = [];

    // Executes the queries
    for (const id of params.ids) {
      try {
        const userData = await AdminQueries.get("/getUser", {
          username: id,
        });

        const user = AdminQueries.parseUser(userData);

        users.push(user);
      } catch (e) {
        console.log(e);
      }
    }

    return {
      data: users,
    };
  }

  static parseUser(user: any) {
    const { Username, Attributes, UserAttributes, ...fields } = user;

    const attributes = AdminQueries.parseAttributes(
      Attributes || UserAttributes
    );

    return { ...fields, ...attributes, id: Username };
  }

  static parseGroup(group: any) {
    const { GroupName, ...fields } = group;

    return { ...fields, id: GroupName };
  }

  static parseAttributes(attributes: { Name: string; Value: unknown }[]) {
    return attributes.reduce((attributes: any, attribute) => {
      const { Name, Value } = attribute;

      return {
        ...attributes,
        [Name]: Value,
      };
    }, {});
  }

  static async get(path: string, params: Record<string, unknown>) {
    const init = {
      queryStringParameters: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };

    return await API.get("AdminQueries", path, init);
  }
}
