# mysql-migrate

Tool that can be helpful if you would like to create the some environment anywhere. Developed with db-migrate nodes library and Percona tool as a combination go two tools on order to use the same code of migration

You will be able to use this documentation in order to manage migrations.
This is only tool that procvides interface to work with [db-migrate](https://db-migrate.readthedocs.io/en/latest/ "db-migrate nodejs library") and [percona-toolkit](https://www.percona.com/doc/percona-toolkit/LATEST/index.html "Percona Toolkit Documentation")

## Build docker image

docker build . -t mysql-migrate

## Create new migration

docker run --rm -v $(pwd):/code mysql-migrate npm run migrate -- -e local create some_migration_name

## Run migrations

docker run --rm -v $(pwd):/code mysql-migrate npm run migrate -- -e local up
docker run --rm -v $(pwd):/code mysql-migrate npm run migrate -- -e local down