export PGPASSWORD="postgres"
cp -r "localdev-SdTutorialConfig" "c:\localdev-SdTutorialConfig"

echo "Execution started..."

/c/Program\ Files/PostgreSQL/12/bin/psql.exe -U postgres --command "CREATE ROLE spmuser PASSWORD 'spmuser' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;

create schema tutorial;
 set search_path to tutorial;
"

echo "Execution completed"

\n