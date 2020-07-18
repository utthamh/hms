http://www.liquibase.org/quickstart.html
https://www.liquibase.org/
-------------------------------------------------------------
1.Download Liquibase(http://download.liquibase.org/)
2.Download PostgreSql driver(https://jdbc.postgresql.org/download.html) and copy to your root liquibase extracted folder
3.Run liquibase update() ---- changelog.xml committed with code
4.If there is an error of classdef not found then copy all jar files from "sdk\lib-sdk" to "lib" folder.
5.

liquibase --changeLogFile=ChangeLog.xml --classpath=postgresql-42.2.2.jar --driver=org.postgresql.Driver --url="jdbc:postgresql://localhost:5432/VersoDb" --username=postgres --password=system update