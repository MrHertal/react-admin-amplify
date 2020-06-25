import { Amplify } from "@aws-amplify/core";
import { AmplifyAdmin, AmplifyFilter } from "./components";
import { buildAuthProvider, buildDataProvider } from "./providers";

export function configureAmplify(config: Record<string, unknown>): void {
  Amplify.configure(config);
}

export { AmplifyAdmin, AmplifyFilter, buildAuthProvider, buildDataProvider };
