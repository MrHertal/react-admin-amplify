import { Amplify } from "@aws-amplify/core";
import { AmplifyAdmin } from "./components";
import { buildAuthProvider, buildDataProvider } from "./providers";

export function configureAmplify(config: Record<string, unknown>): void {
  Amplify.configure(config);
}

export { AmplifyAdmin, buildAuthProvider, buildDataProvider };
