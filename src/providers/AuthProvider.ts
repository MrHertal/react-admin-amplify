import { Auth, CognitoUser } from "@aws-amplify/auth";

export interface AuthProviderOptions {
  adminGroups?: string[];
}

const defaultOptions: AuthProviderOptions = {
  adminGroups: ["admin"],
};

export class AuthProvider {
  public adminGroups: string[];

  public constructor(options: AuthProviderOptions = defaultOptions) {
    const optionsBag = { ...defaultOptions, ...options };

    this.adminGroups = <string[]>optionsBag.adminGroups;
  }

  public login = ({
    username,
    password,
  }: Record<string, string>): Promise<CognitoUser | unknown> => {
    return Auth.signIn(username, password);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public logout = (): Promise<any> => {
    return Auth.signOut();
  };

  public checkAuth = (): Promise<void> => {
    return Auth.currentAuthenticatedUser();
  };

  public checkError = async (error: Record<string, unknown>): Promise<void> => {
    const status = error.status;

    if (status === 401 || status === 403) {
      await Auth.signOut();
      return Promise.reject();
    }

    return Promise.resolve();
  };

  public getPermissions = async (): Promise<string[]> => {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user);

    return Promise.resolve(this.adminGroups);
  };
}
