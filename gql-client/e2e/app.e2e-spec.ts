import { GqlClientPage } from './app.po';

describe('gql-client App', () => {
  let page: GqlClientPage;

  beforeEach(() => {
    page = new GqlClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
