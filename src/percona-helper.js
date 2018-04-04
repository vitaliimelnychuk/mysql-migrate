const spawn = require("child_process").spawn;

class PerconaHelper {

    constructor(config) {
        this.config = config;
    }

    execute(command, args) {

        const child = spawn(command, args);
        return this.attachLogs(child);
    }

    attachLogs(child) {
        child.stdout.on('data', this.printData);
        child.stderr.on('data', this.printData);
        child.on('exit', process.exit);
        
        return child;
    }

    printData(data) {
        console.log(data.toString());
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