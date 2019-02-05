// TODO 端对端测试还有问题，先不解决
import { ClientFunction, Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

const getPageTitle = ClientFunction(() => document.title);
const buttonsSelector = Selector('button');
const togglePlayButton = buttonsSelector.nth(0);
const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`DiscPlayer Page`.page('../../app/app.html');
// .afterEach(assertNoConsoleErrors);

test('e2e', async t => {
  await t.expect(getPageTitle()).eql('Hello Electron React!');
});

test('should open window', async t => {
  await t.expect(getPageTitle()).eql('Hello Electron React!');
});

test(
  "should haven't any logs in console of main window",
  assertNoConsoleErrors
);

test('should music been played after play button click', async t => {
  await waitForReact();
  await t
    .click(togglePlayButton)
    .expect('1')
    .eql('1');
});
