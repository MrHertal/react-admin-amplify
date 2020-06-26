import { AuthProvider, DataProvider } from "ra-core";
import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Admin } from "react-admin";
import { buildAuthProvider, buildDataProvider } from "../providers";
import { Operations } from "../providers/DataProvider";

export interface AmplifyAdminOptions {
  adminGroups?: string[];
}

const defaultOptions: AmplifyAdminOptions = {
  adminGroups: ["admin"],
};

export const AmplifyAdmin: React.FC<{
  operations: Operations;
  options?: AmplifyAdminOptions;
}> = ({ children, operations, options = defaultOptions, ...propsRest }) => {
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);

  const optionsBag = { ...defaultOptions, ...options };
  const adminGroups = optionsBag.adminGroups as string[];

  useEffect(() => {
    const provider = buildAuthProvider({ adminGroups });

    setAuthProvider(() => provider);
  }, []);

  useEffect(() => {
    const provider = buildDataProvider(operations);

    setDataProvider(() => provider);
  }, []);

  if (!authProvider || !dataProvider) {
    return <div>Loading</div>;
  }

  return (
    <Admin
      {...propsRest}
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      {children}
    </Admin>
  );
};
