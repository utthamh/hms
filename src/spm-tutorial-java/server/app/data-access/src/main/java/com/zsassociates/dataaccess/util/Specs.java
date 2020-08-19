package com.zsassociates.dataaccess.util;

public class Specs {

    public static abstract class BaseSpec {


        public String getSql() {
            return Queries.getQuery(this.getClass().getSimpleName()).getSql();
        }

        public String getCountSql() {
            return String.format("Select count(1) from (%s) as totalCount", String.format(Queries.getQuery(this.getClass().getSimpleName()).getSql()));
        }
    }
}
