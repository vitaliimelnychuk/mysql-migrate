const assert = require("chai").assert;
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const PerconaHelper = require("../src/percona-helper");

describe("percona-helper", () => {
    describe("#run()", () => {
        it("method execute should be called with string and return object", () => {
            const config = {
                host: "test_host",
                database: "test_database",
                user: "test_user",
                password: "test_password",
            };
            const helper = new PerconaHelper(config);
            const expected = { test: 1 };
            helper.execute = sinon.stub().returns(expected);

            assert.equal(helper.run("test_table", "alter", "some query"), expected);
            assert.isTrue(helper.execute.calledOnce);
            assert.equal(helper.execute.args[0][0], "pt-online-schema-change");
            assert.deepEqual(helper.execute.args[0][1], [
                "--execute",
                "--alter",
                "some query",
                "D=test_database,t=test_table,h=test_host",
                "--user",
                "test_user",
                "--password",
                "test_password",

            ]);
        });
        it("should throw error from execute method", () => {
            const helper = new PerconaHelper({});
            const expectedError = new Error("something went wrong");
            helper.execute = sinon.stub().throws(expectedError);

            assert.throws(() => helper.run("test_table", "alter", "some query"), expectedError);
        });
    });

    describe("#execute()", () => {
        it("should call child_process.spawn", () => {
            const expected = { test: 2 };
            const spawnMock = sinon.stub().returns({});
            const PerconaHelperMock = proxyquire("../src/percona-helper", {
                "child_process": {
                    spawn: spawnMock
                }
            });
            const helper = new PerconaHelperMock({});
            helper.attachLogs = sinon.stub().returns(expected);
            assert.equal(helper.execute("some command"), expected);
            assert.isTrue(spawnMock.calledOnce);
            assert.equal(spawnMock.args[0][0], "some command");
        });
        it("should return error from spawn", () => {
            const expectedError = new Error("somethin went wrong");
            const spawnMock = sinon.stub().throws(expectedError);
            const PerconaHelperMock = proxyquire("../src/percona-helper", {
                "child_process": {
                    spawn: spawnMock
                }
            });
            const helper = new PerconaHelperMock({});
            assert.throws(() => helper.execute("test"), expectedError);
        });
        it("method attachLogs should be called once", () => {
            const expected = { test: 2 };
            const childMock = { test: 3 }
            const spawnMock = sinon.stub().returns(childMock);
            const PerconaHelperMock = proxyquire("../src/percona-helper", {
                "child_process": {
                    spawn: spawnMock
                }
            });
            const helper = new PerconaHelperMock({});
            helper.attachLogs = sinon.stub().returns(expected);
            assert.equal(helper.execute("some command"), expected);
            assert.isTrue(helper.attachLogs.calledOnce);
            assert.equal(helper.attachLogs.args[0][0], childMock);
        })
        it("should return error from attachLogs method", () => {
            const expectedError = new Error("somethin went wrong");
            const spawnMock = sinon.stub().returns({});
            const PerconaHelperMock = proxyquire("../src/percona-helper", {
                "child_process": {
                    spawn: spawnMock
                }
            });
            const helper = new PerconaHelperMock({});
            helper.attachLogs = sinon.stub().throws(expectedError);
            assert.throws(() => helper.execute("test"), expectedError);
        });
    });

    describe("#attachLogs()", () => {
        it("should return passed object", () => {
            const helper = new PerconaHelper({});
            const expected = {
                stdout: {
                    on: sinon.spy()
                },
                stderr: {
                    on: sinon.spy()
                },
                on: sinon.spy()
            }
            assert.equal(helper.attachLogs(expected), expected);
        });
        it("should call method `on` twice", () => {
            const helper = new PerconaHelper({});
            const expected = {
                stdout: {
                    on: sinon.spy()
                },
                stderr: {
                    on: sinon.spy()
                },
                on: sinon.spy()
            }
            helper.attachLogs(expected);
            assert.isTrue(expected.stderr.on.calledOnce);
            assert.isTrue(expected.stderr.on.calledOnce);
            assert.isTrue(expected.on.calledOnce);

        });
    });
});