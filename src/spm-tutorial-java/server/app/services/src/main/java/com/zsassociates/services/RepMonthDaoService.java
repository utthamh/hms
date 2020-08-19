package com.zsassociates.services;
import com.zsassociates.models.RepMonth;

import java.util.List;

public interface RepMonthDaoService {

List<RepMonth> getRepOfTheMonth(String product,String month);
}
