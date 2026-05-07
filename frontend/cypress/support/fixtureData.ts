export type ApiEnvelope = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: {
    message: string;
  } | null;
};

export const fixtureData = (fixtureName: string) =>
  cy.fixture<ApiEnvelope>(fixtureName).then((response) => response.data);
