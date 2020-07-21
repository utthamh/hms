package com.zsassociates.services;
import com.zsassociates.models.SalesRep;

import java.util.List;

public interface SalesRepDaoService {
  List<SalesRep> getAllSalesRep();
  Long addSalesRep(SalesRep salesRep);
  void updateSalesRep(SalesRep salesRep);
  void deleteSalesRep(Long id);
}
