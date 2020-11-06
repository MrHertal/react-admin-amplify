import React from "react";
import { Admin } from "react-admin";
import { buildAuthProvider, buildDataProvider } from "../providers";
import { Operations } from "../providers/DataProvider";

export interface AmplifyAdminOptions {
  authGroups?: string[];
  storageBucket?: string;
  storageRegion?: string;
}

const defaultOptions: AmplifyAdminOptions = {
  authGroups: [],
};

export const AmplifyAdmin: React.FC<{
  operations: Operations;
  options?: AmplifyAdminOptions;
}> = ({ children, operations, options = defaultOptions, ...propsRest }) => {
  const optionsBag = { ...defaultOptions, ...options };
  const { authGroups, storageBucket, storageRegion } = optionsBag;

  return (
    <Admin
      {...propsRest}
      authProvider={buildAuthProvider({ authGroups })}
      dataProvider={buildDataProvider(operations, {
        storageBucket,
        storageRegion,
      })}
    >
      {children}
    </Admin>
  );
};
