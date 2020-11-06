import { Auth, CognitoUser } from "@aws-amplify/auth";
import { ClientMetaData } from "@aws-amplify/auth/lib-esm/types";

export interface AuthProviderOptions {
  authGroups?: string[];
}

const defaultOptions: AuthProviderOptions = {
  authGroups: [],
};

export class AuthProvider {
  public authGroups: string[];

  public constructor(options: AuthProviderOptions = defaultOptions) {
    const optionsBag = { ...defaultOptions, ...options };

    this.authGroups = <string[]>optionsBag.authGroups;
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

  public checkError = (error: Record<string, unknown>): Promise<void> => {
    if (error === null || typeof error !== "object") {
      return Promise.resolve();
    }

    const errors = error.errors;

    if (!errors || !Array.isArray(errors)) {
      return Promise.resolve();
    }

    for (const e of errors) {
      if (e === null || typeof e !== "object") {
        continue;
      }

      if (e.errorType === "Unauthorized") {
        return Promise.reject();
      }
    }

    return Promise.resolve();
  };

  public getPermissions = async (): Promise<string[]> => {
    const session = await Auth.currentSession();

    const groups = session.getAccessToken().decodePayload()["cognito:groups"];

    return groups ? Promise.resolve(groups) : Promise.reject();
  };
}
