package com.zsassociates.dataaccess.Specs;

import com.zsassociates.dataaccess.util.Specs;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class SalesRepSpec extends Specs.BaseSpec {
    @NoArgsConstructor
    public static class GetAllSalesRep extends Specs.BaseSpec {
    }
    @Getter
    @AllArgsConstructor
    public static class SalesRep extends Specs.BaseSpec {
        private String name;
        private String country;
        private  String city;
        private String gender;
        private  String zipCode;
    }
    @Getter
    @AllArgsConstructor
    public static class SalesRepUpdate extends Specs.BaseSpec {
        private String name;
        private String country;
        private  String city;
        private String gender;
        private  String zipCode;
        private Long id;
    }
    @Getter
    @AllArgsConstructor
    public static class SalesRepDelete extends Specs.BaseSpec {
        private Long id;
    }
}
