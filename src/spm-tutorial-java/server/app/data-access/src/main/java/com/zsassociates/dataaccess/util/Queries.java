package com.zsassociates.dataaccess.util;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import com.typesafe.config.ConfigObject;
import com.typesafe.config.ConfigValue;

import java.util.Map;
import java.util.stream.Collectors;

public class Queries {

    private static final Map<String, Query> queries = createQueriesMap();

    private static Map<String, Query> createQueriesMap() {
        Config queriesFromConfig = ConfigFactory.load("app-queries/queries.conf");
        return queriesFromConfig.root().entrySet()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Queries::getQuery));
    }

    private static Query getQuery(Map.Entry<String, ConfigValue> query) {
        if (query.getKey().contains("-create")) {
            return createInsertQuery((ConfigObject) query.getValue());
        }
        return new Query(query.getValue().unwrapped().toString());
    }

    private static InsertQuery createInsertQuery(ConfigObject queryObject) {
        String insertSql = queryObject.get("sql").unwrapped().toString();
        String[] keyColumnNames = queryObject.toConfig().getStringList("keyColumnNames")
                .stream()
                .toArray(String[]::new);
        return new InsertQuery(insertSql, keyColumnNames);
    }

    public static Query getQuery(String queryName) {
        return queries.get(queryName);
    }

    public static InsertQuery getInsertQuery(String queryName) {
        return (InsertQuery) queries.get(queryName);
    }

    public static class Query {
        private final String sql;

        Query(final String sql) {
            this.sql = sql;
        }

        public String getSql() {
            return sql;
        }
    }

    public static class InsertQuery extends Query {

        private final String[] keyColumnNames;

        InsertQuery(String sql, String[] keyColumnNames) {
            super(sql);
            this.keyColumnNames = keyColumnNames;
        }

        public String[] getKeyColumnNames() {
            return keyColumnNames;
        }
    }
}

