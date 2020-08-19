package com.zsassociates.dataaccess.Dao;

import com.zsassociates.dataaccess.util.Queries;
import com.zsassociates.dataaccess.util.Specs;
import com.zsassociates.models.BaseEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public abstract class BaseDAO<T extends BaseEntity> implements DAO<T> {

    protected final NamedParameterJdbcTemplate namedTemplate;
    protected final DataSource dataSource;
    protected final RowMapper<T> rowMapper;
    protected final JdbcTemplate template;
    protected final ResultSetExtractor<Boolean> resultSetExtractor;

    @Inject
    public BaseDAO(final DataSource ds, final RowMapper<T> rowMapper) {
        this.dataSource = ds;
        this.rowMapper = rowMapper;
        template = new JdbcTemplate(dataSource);
        namedTemplate = new NamedParameterJdbcTemplate(dataSource);
        this.resultSetExtractor = new ResultSetExtractor<Boolean>() {
            public Boolean extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                if (resultSet != null && resultSet.next()) return resultSet.getBoolean(0);
                return null;
            }
        };
    }

    @Override
    public long create(T entity) {
        String op = "create";
        return performOp(entity, op);
    }

    @Override
    public long create(Specs.BaseSpec spec, String idColumnName) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        namedTemplate.update(spec.getSql(), params, keyHolder);
        Object key = keyHolder.getKeys().get(idColumnName);
        if (key != null) {
            return (long) key;
        }
        return 0;
    }

    private long performOp(T entity, String op) {
        Queries.InsertQuery sqlQuery = getInsertQuery(entity, op);
        SqlParameterSource params = new BeanPropertySqlParameterSource(entity);
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        namedTemplate.update(sqlQuery.getSql(), params, keyHolder, sqlQuery.getKeyColumnNames());
        Number key = keyHolder.getKey();
        if (key != null) {
            return key.longValue();
        }
        return 0;
    }

    @Override
    public int update(T entity) {
        if (entity.getId() <= 0)
            throw new IllegalArgumentException("Only an existing entity in the DB can be updated. Entity being updated had an non-positive id");
        String entityName = entity.getClass().getSimpleName();
        String queryKey = String.format("%s-update", entityName);
        Queries.Query query = Queries.getQuery(queryKey);
        SqlParameterSource params = new BeanPropertySqlParameterSource(entity);
        return namedTemplate.update(query.getSql(), params);
    }

    @Override
    public long createOrUpdate(T entity) {
        String op = "create-update";
        return performOp(entity, op);
    }

    public long getTotalCount(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return namedTemplate.queryForList(spec.getCountSql(), params, Long.class).get(0);
    }

    private Queries.InsertQuery getInsertQuery(T entity, String op) {
        String entityName = entity.getClass().getSimpleName();
        String queryKey = String.format("%s-%s", entityName, op);
        return Queries.getInsertQuery(queryKey);
    }

    @Override
    public List<T> getAll() {
        return null;
    }

    @Override
    public List<T> getSalesRepPaginated(Long start,Long limit) { return null; }

    public boolean executeBooleanFunc(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return namedTemplate.queryForObject(spec.getSql(), params, boolean.class);
    }

    public List<T> getMany(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return namedTemplate.query(spec.getSql(), params, rowMapper);
    }

    public List<T> getMany(Specs.BaseSpec spec, long salesforceId) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return namedTemplate.query(spec.getSql(), params, rowMapper);
    }


    public List<Map<String, Object>> executeSql(String sqlQuery, Map<String, Object> params) {
        // return namedTemplate.query(sqlQuery, params,new MetricDao.MetricRowMapperV2());
        return null;
    }

    public long[] getIds(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return convertIntoArray(namedTemplate.queryForList(spec.getSql(), params, Long.class));
    }

    public List<String> getSingleColumnValues(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return namedTemplate.queryForList(spec.getSql(), params, String.class);
    }

    private long[] convertIntoArray(List<Long> list) {
        int size = list.size();
        long[] arr = new long[size];
        for (int i = 0; i < size; i++) {
            arr[i] = list.get(i);
        }
        return arr;
    }

    public T get(Specs.BaseSpec spec) {
        //TODO : This needs to change when multiple orgunit assigned to the user
        return getMany(spec).stream().findFirst().orElse(null);
    }

    public boolean isExists(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        Boolean returnValue = namedTemplate.query(spec.getSql(), params, new ResultSetExtractor<Boolean>() {
            public Boolean extractData(ResultSet resultSet) throws SQLException {
                if (resultSet != null && resultSet.next()) {
                    return resultSet.getBoolean(1);
                }
                return false;
            }
        });

        return returnValue.booleanValue();
    }

    @Override
    public int update(Specs.BaseSpec spec) {
        SqlParameterSource params = new BeanPropertySqlParameterSource(spec);
        return namedTemplate.update(spec.getSql(), params);
    }
}
