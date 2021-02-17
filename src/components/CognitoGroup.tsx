import React from "react";
import { Datagrid, DateField, List, NumberField, TextField } from "react-admin";

export const CognitoGroupList = (props: any) => (
  <List {...props} title="Cognito Groups" bulkActionButtons={false}>
    <Datagrid>
      <TextField source="id" label="Group name" sortable={false} />
      <TextField source="UserPoolId" sortable={false} />
      <TextField source="Description" sortable={false} />
      <TextField source="RoleArn" label="Role ARN" sortable={false} />
      <NumberField source="Precedence" sortable={false} />
      <DateField source="LastModifiedDate" sortable={false} />
      <DateField source="CreationDate" sortable={false} />
    </Datagrid>
  </List>
);
