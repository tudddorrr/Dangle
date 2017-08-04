import { DanglePage } from './app.po';

describe('dangle App', () => {
  let page: DanglePage;

  beforeEach(() => {
    page = new DanglePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
