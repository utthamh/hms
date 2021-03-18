package com.zsassociates.services;
import com.zsassociates.models.SalesRep;

import java.util.List;

public interface SalesRepDaoService {
  List<SalesRep> getAllSalesRep();
  SalesRep save(SalesRep s);
  SalesRep update(SalesRep s,Integer id) throws Exception;
  Integer delete(Long id);
  SalesRep getById(Long id);
}
