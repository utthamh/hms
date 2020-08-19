package com.zsassociates.services;

import com.zsassociates.dataaccess.Dao.RepMonthDao;
import com.zsassociates.models.RepMonth;

import javax.inject.Inject;
import java.util.List;

public class RepMonthService implements RepMonthDaoService{

    private RepMonthDao repMonthDao;

    @Inject
    public RepMonthService(RepMonthDao repMonthDao){
        this.repMonthDao = repMonthDao;
    }

    @Override
    public List<RepMonth> getRepOfTheMonth(String product, String month) {
        return this.repMonthDao.getRepOfTheMonth(product,month);
    }
}
