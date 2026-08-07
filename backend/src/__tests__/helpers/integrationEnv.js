import { getIntegrationContext, teardownIntegrationOnce } from './integrationSetup.js';

export const integrationEnv = await getIntegrationContext();
export const describeIntegration = integrationEnv.ready ? describe : describe.skip;

export { teardownIntegrationOnce };
