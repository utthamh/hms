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

    public SalesRep fetchById(long id)
    {

        try {
            this.template.getDataSource().getConnection().setReadOnly(false);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        String sql="SELECT * from salesrep where id=?";
        return template.queryForObject(sql, new Object[]{id},(rs,i)->this.rowMapper.mapRow(rs,i));


    }

    public long save(SalesRep salesrep) throws SQLException {
        this.template.getDataSource().getConnection().setReadOnly(false);
        String sql="INSERT INTO salesrep(name,country,city,zipcode,gender) values(?,?,?,?,?)";
        template.update(sql, new Object[]{salesrep.getName(),salesrep.getCountry(),salesrep.getCity(),salesrep.getZipcode(),salesrep.getGender()});
        return 1;
    }

    public int updates(SalesRep salesrep)
    {
        try {
            this.template.getDataSource().getConnection().setReadOnly(false);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        String sql="UPDATE salesrep set name=?,country=?,city=?,zipcode=?,gender=? where id=?";
      return  template.update(sql, new Object[]{salesrep.getName(),salesrep.getCountry(),salesrep.getCity(),salesrep.getZipcode(),salesrep.getGender(),salesrep.getId()});


    }

    public int deletes(Long salesrep)
    {

        try {
            this.template.getDataSource().getConnection().setReadOnly(false);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        String sql="DELETE FROM salesrep where id=?";
        template.update(sql, new Object[]{salesrep});
        return 1;
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
