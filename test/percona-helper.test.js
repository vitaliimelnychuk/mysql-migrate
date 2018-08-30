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
        it("should call child_process.spawnSync", () => {
            const expected = { test : 2};
            const spawnMock = sinon.stub().returns(expected);
            const PerconaHelperMock = proxyquire("../src/percona-helper", {
                "child_process": {
                    spawnSync: spawnMock
                }
            });

            const helper = new PerconaHelperMock({});

            assert.equal(helper.execute("some command", expected), expected);
            assert.isTrue(spawnMock.calledOnce);
            assert.equal(spawnMock.args[0][0], "some command");
            assert.equal(spawnMock.args[0][1], expected);
            assert.deepEqual(spawnMock.args[0][2], { stdio: 'inherit'})
        });
        it("should return error from spawnSync", () => {
            const expectedError = new Error("somethin went wrong");
            const spawnMock = sinon.stub().throws(expectedError);
            const PerconaHelperMock = proxyquire("../src/percona-helper", {
                "child_process": {
                    spawnSync: spawnMock
                }
            });
            const helper = new PerconaHelperMock({});
            assert.throws(() => helper.execute("test"), expectedError);
        });
    });

});