import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
chai.config.includeStack = true;

export var expect = global.expect = chai.expect;

export function sinonSetup() {
  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
  });
  afterEach(function () {
    this.sinon.restore();
  });
}
