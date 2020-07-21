cp -r "localdev-SdTutorialConfig" "c:\localdev-SdTutorialConfig"

echo "Execution started..."

/c/Program\ Files/PostgreSQL/11/bin/psql.exe -U postgres --command "CREATE ROLE spmuser PASSWORD 'spmuser' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;

create schema tutorial;
 set search_path to tutorial;
create table salesrep(id bigint,name varchar,city varchar,country varchar,pincode varchar,gender varchar)"

echo "Execution completed"

\n