import React from "react";
import {
  BooleanField,
  ChipField,
  Datagrid,
  DateField,
  List,
  ReferenceManyField,
  Show,
  ShowButton,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TextInput,
  useShowController,
} from "react-admin";
import { AmplifyFilter } from "./AmplifyFilter";

export const CognitoUserFilter = (props: any) => (
  <AmplifyFilter {...props}>
    <TextInput source="getUser.username" label="Username" alwaysOn resettable />
    <TextInput
      source="listUsersInGroup.groupname"
      label="Group"
      alwaysOn
      resettable
    />
  </AmplifyFilter>
);

export const CognitoUserList = (props: any) => (
  <List
    title="Cognito Users"
    filters={<CognitoUserFilter />}
    bulkActionButtons={false}
    {...props}
  >
    <Datagrid>
      <TextField source="id" label="Username" sortable={false} />
      <BooleanField source="Enabled" sortable={false} />
      <TextField source="UserStatus" sortable={false} />
      <TextField source="email_verified" sortable={false} />
      <TextField source="phone_number_verified" sortable={false} />
      <DateField source="UserLastModifiedDate" sortable={false} />
      <DateField source="UserCreateDate" sortable={false} />
      <ShowButton />
    </Datagrid>
  </List>
);

export const CognitoUserShowTitle = ({ record }: any) => (
  <span>Cognito User{record ? ` #${record.id}` : ""}</span>
);

export const CognitoUserShow = (props: any) => {
  const { record } = useShowController(props);

  if (!record) {
    return null;
  }

  const {
    id,
    Enabled,
    UserStatus,
    UserLastModifiedDate,
    UserCreateDate,
    ...attributes
  } = record;

  return (
    <Show title={<CognitoUserShowTitle />} {...props}>
      <SimpleShowLayout>
        <TextField source="id" label="Username" />
        <ReferenceManyField
          reference="cognitoGroups"
          target="listGroupsForUser.username"
          label="Groups"
        >
          <SingleFieldList linkType={false}>
            <ChipField source="id" />
          </SingleFieldList>
        </ReferenceManyField>
        <BooleanField source="Enabled" />
        <TextField source="UserStatus" />
        {Object.keys(attributes).map((attribute) => (
          <TextField key={attribute} record={record} source={attribute} />
        ))}
        <DateField source="UserLastModifiedDate" />
        <DateField source="UserCreateDate" />
      </SimpleShowLayout>
    </Show>
  );
};
