package com.zsassociates.dataaccess.Dao;

import com.zsassociates.dataaccess.util.Specs;
import com.zsassociates.models.BaseEntity;

import com.zsassociates.models.SalesRep;


import java.util.List;
import java.util.Map;

public interface DAO<T extends BaseEntity> {

    long create(T entity);

    int update(T entity);

    long create(Specs.BaseSpec spec, String idColumnName);

    int update(Specs.BaseSpec spec);

    long createOrUpdate(T entity);

    List<T> getAll();

    List<T> getMany(Specs.BaseSpec spec);

    List<T> getSalesRepPaginated(Long start,Long limit);

    List<T> getRepOfTheMonth(String product , String city);

    void addSalesRep(SalesRep salesRep);

    T get(Specs.BaseSpec spec);

    long getTotalCount(Specs.BaseSpec spec);

    long[] getIds(Specs.BaseSpec spec);

    List<String> getSingleColumnValues(Specs.BaseSpec spec);

    boolean isExists(Specs.BaseSpec spec);

    List<Map<String, Object>> executeSql(String sqlQuery, Map<String, Object> params);

    T getById(long id);
}
