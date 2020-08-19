package com.zsassociates.services;
import com.zsassociates.models.SalesRep;

import java.util.List;

public interface SalesRepDaoService {
  List<SalesRep> getAllSalesRep();

  List<SalesRep> getSalesRepPaginated(Long start,Long limit);

  void addSalesRep(SalesRep salesRep);
}
