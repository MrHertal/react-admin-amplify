import {
  AuthProvider as AuthProviderInterface,
  DataProvider as DataProviderInterface,
} from "ra-core";
import { AuthProvider, AuthProviderOptions } from "./AuthProvider";
import { DataProvider, DataProviderOptions, Operations } from "./DataProvider";

export function buildAuthProvider(
  options?: AuthProviderOptions
): AuthProviderInterface {
  const authProvider = new AuthProvider(options);

  return {
    login: authProvider.login,
    logout: authProvider.logout,
    checkAuth: authProvider.checkAuth,
    checkError: authProvider.checkError,
    getPermissions: authProvider.getPermissions,
  };
}

export function buildDataProvider(
  operations: Operations,
  options?: DataProviderOptions
): DataProviderInterface {
  const dataProvider = new DataProvider(operations, options);

  return {
    getList: dataProvider.getList,
    getOne: dataProvider.getOne,
    getMany: dataProvider.getMany,
    getManyReference: dataProvider.getManyReference,
    create: dataProvider.create,
    update: dataProvider.update,
    updateMany: dataProvider.updateMany,
    delete: dataProvider.delete,
    deleteMany: dataProvider.deleteMany,
  };
}
