package com.zsassociates.services;

import com.zsassociates.dataaccess.Dao.SalesRepDao;
import com.zsassociates.models.SalesRep;

import javax.inject.Inject;
import java.sql.SQLException;
import java.util.List;

public class SalesRepService implements SalesRepDaoService {

    private SalesRepDao salesRepDao;

    @Inject
    public SalesRepService(SalesRepDao salesRepDao) {
        this.salesRepDao = salesRepDao;
    }

    @Override
    public List<SalesRep> getAllSalesRep() {
      return this.salesRepDao.getAll();
    }

    @Override
    public SalesRep save(SalesRep s) {
        long id= 0;
        try {
            id = this.salesRepDao.save(s);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
       // s.Id=id;
        return s;
    }

    @Override
    public SalesRep update(SalesRep s) throws Exception {

        int i=this.salesRepDao.updates(s);
       // s.Id=id;
        if(i>0){
            return s;
        }else{
            throw new Exception("Not Updated");
        }


    }

    @Override
    public Integer delete(Long id) {
        //SalesRep s=this.salesRepDao.getById(id);
       this.salesRepDao.deletes(id);
        return 1;
    }

    @Override
    public SalesRep getById(Long id) {

        return this.salesRepDao.fetchById(id);
    }
}
