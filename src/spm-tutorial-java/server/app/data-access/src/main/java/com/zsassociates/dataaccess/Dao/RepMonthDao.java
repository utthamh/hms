package com.zsassociates.dataaccess.Dao;

import com.zsassociates.dataaccess.Specs.RepMonthSpec;
import com.zsassociates.dataaccess.util.Specs;
import com.zsassociates.models.RepMonth;
import com.zsassociates.models.SalesRep;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.AbstractDataSource;

import javax.inject.Inject;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;


public class RepMonthDao extends BaseDAO<RepMonth>{

    @Inject
    public RepMonthDao(final AbstractDataSource ds, final RepMonthDao.RepMonthRowMapper rowMapper) {
        super(ds , rowMapper);
    }

    @Override
    public List<RepMonth> getRepOfTheMonth(String product, String month) {
        Specs.BaseSpec spec = new RepMonthSpec.GetRepOfTheMonth(product,month);
        return this.getMany(spec);
    }

    @Override
    public void addSalesRep(SalesRep salesRep) {

    }

    @Override
    public RepMonth getById(long id) {
        return null;
    }

    public static class RepMonthRowMapper implements RowMapper<RepMonth> {
        @Override
        public RepMonth mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            return new RepMonth(

                    resultSet.getString("name"),
                    resultSet.getString("product")
                    //resultSet.getString("month")
                    );

        }
    }

}
