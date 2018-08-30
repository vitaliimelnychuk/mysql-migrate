const { spawnSync } = require("child_process");

class PerconaHelper {

    constructor(config) {
        this.config = config;
    }

    execute(command, args) {
        return spawnSync(command, args, { stdio: 'inherit'});
    }

    run(table, type, query) {

        const args = [
            "--execute",
            `--${type}`,
            query,
            `D=${this.config.database},t=${table},h=${this.config.host}`,
            "--user",
            this.config.user,
            "--password",
            this.config.password
        ]

        return this.execute("pt-online-schema-change", args);
    }
}

module.exports = PerconaHelper;