import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import React from "react";
import { Admin, AdminProps } from "react-admin";
import { buildAuthProvider, buildDataProvider } from "../providers";
import { Operations } from "../providers/DataProvider";

export interface AmplifyAdminOptions {
  authGroups?: string[];
  authMode?: GRAPHQL_AUTH_MODE;
  storageBucket?: string;
  storageRegion?: string;
  enableAdminQueries?: boolean;
}

type Props = {
  operations: Operations;
  options?: AmplifyAdminOptions;
} & Omit<AdminProps, "authProvider" | "dataProvider">;

export const AmplifyAdmin: React.FC<Props> = ({
  children,
  operations,
  options,
  ...propsRest
}) => {
  const {
    authGroups,
    authMode,
    storageBucket,
    storageRegion,
    enableAdminQueries,
  } = options || {};

  return (
    <Admin
      {...propsRest}
      authProvider={buildAuthProvider({ authGroups })}
      dataProvider={buildDataProvider(operations, {
        authMode,
        storageBucket,
        storageRegion,
        enableAdminQueries,
      })}
    >
      {children}
    </Admin>
  );
};
