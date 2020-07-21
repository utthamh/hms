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
    public Long addSalesRep(SalesRep salesRep){
        Specs.BaseSpec addSpec=new SalesRepSpec.SalesRep(salesRep.getName(),salesRep.getCountry(),salesRep.getCity(),salesRep.getGender(),salesRep.getZipcode());

        return this.create(addSpec,"id");
    }
    public void updateSalesRep(SalesRep salesRep){
        Specs.BaseSpec updateSpec=new SalesRepSpec.SalesRepUpdate(salesRep.getName(),salesRep.getCountry(),salesRep.getCity(),salesRep.getGender(),salesRep.getZipcode(),salesRep.getId());
        this.update(updateSpec);
    }
    public void deleteSalesRep(Long id){
        Specs.BaseSpec deleteSpec=new SalesRepSpec.SalesRepDelete(id);
        this.update(deleteSpec);
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
