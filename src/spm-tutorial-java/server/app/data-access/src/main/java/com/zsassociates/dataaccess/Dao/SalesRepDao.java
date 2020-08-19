package com.zsassociates.dataaccess.Dao;

import com.zsassociates.dataaccess.Specs.SalesRepSpec;
import com.zsassociates.dataaccess.util.Specs;
import com.zsassociates.models.SalesRep;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.AbstractDataSource;

import javax.inject.Inject;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class SalesRepDao extends BaseDAO<SalesRep> {
    @Inject
    public SalesRepDao(final AbstractDataSource ds, final SalesRepRowMapper rowMapper) {
        super(ds, rowMapper);
    }

    @Override
    public List<SalesRep> getAll() {
        Specs.BaseSpec spec = new SalesRepSpec.GetAllSalesRep();
        return this.getMany(spec);
    }

    @Override
    public List<SalesRep> getSalesRepPaginated(Long start,Long limit){
        Specs.BaseSpec spec = new SalesRepSpec.GetSalesRepPaginated(start,limit);
        return this.getMany(spec);
    }

    @Override
    public List<SalesRep> getRepOfTheMonth(String product, String month) {
        return null;
    }

    @Override
    public void addSalesRep(SalesRep salesRep){

    }


    @Override
    public SalesRep getById(long id) {
        return null;
    }

    public static class SalesRepRowMapper implements RowMapper<SalesRep> {
        @Override
        public SalesRep mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            return new SalesRep(
                    resultSet.getLong("id"),
                    resultSet.getString("name"),
                    resultSet.getString("country"),
                    resultSet.getString("city"),
                    resultSet.getString("zipcode"),
                    resultSet.getString("gender"));
        }
    }

}
