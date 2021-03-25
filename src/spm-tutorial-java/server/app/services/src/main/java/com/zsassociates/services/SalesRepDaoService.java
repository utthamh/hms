package com.zsassociates.services;
import com.zsassociates.models.SalesRep;

import java.util.List;

public interface SalesRepDaoService {
  List<SalesRep> getAllSalesRep();
  SalesRep save(SalesRep s);
  SalesRep update(SalesRep s1) throws Exception;
  Integer delete(Long id);
  SalesRep getById(Long id);
}
