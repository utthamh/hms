package com.zsassociates.services;

import com.zsassociates.dataaccess.Dao.SalesRepDao;
import com.zsassociates.models.SalesRep;

import javax.inject.Inject;
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
    public List<SalesRep> getSalesRepPaginated(Long start, Long limit) {
        return this.salesRepDao.getSalesRepPaginated(start,limit);
    }

    @Override
    public void addSalesRep(SalesRep salesRep){
        this.salesRepDao.addSalesRep(salesRep);
    }

}
