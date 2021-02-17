import { Auth, CognitoUser } from "@aws-amplify/auth";
import { ClientMetaData } from "@aws-amplify/auth/lib-esm/types";

export interface AuthProviderOptions {
  authGroups?: string[];
}

const defaultOptions = {
  authGroups: [],
};

export class AuthProvider {
  public authGroups: string[];

  public constructor(options?: AuthProviderOptions) {
    this.authGroups = options?.authGroups || defaultOptions.authGroups;
  }

  public login = ({
    username,
    password,
    clientMetadata,
  }: Record<string, unknown>): Promise<CognitoUser | unknown> => {
    return Auth.signIn(
      <string>username,
      <string>password,
      <ClientMetaData>clientMetadata
    );
  };

  public logout = (): Promise<any> => {
    return Auth.signOut();
  };

  public checkAuth = async (): Promise<void> => {
    const session = await Auth.currentSession();

    if (this.authGroups.length === 0) {
      return;
    }

    const userGroups = session.getAccessToken().decodePayload()[
      "cognito:groups"
    ];

    if (!userGroups) {
      throw new Error("Unauthorized");
    }

    for (const group of userGroups) {
      if (this.authGroups.includes(group)) {
        return;
      }
    }

    throw new Error("Unauthorized");
  };

  public checkError = (): Promise<void> => {
    return Promise.resolve();
  };

  public getPermissions = async (): Promise<string[]> => {
    const session = await Auth.currentSession();

    const groups = session.getAccessToken().decodePayload()["cognito:groups"];

    return groups ? Promise.resolve(groups) : Promise.reject();
  };
}
