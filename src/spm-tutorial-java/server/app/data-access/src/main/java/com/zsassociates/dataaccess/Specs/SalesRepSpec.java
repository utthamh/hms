package com.zsassociates.dataaccess.Specs;

import com.zsassociates.dataaccess.util.Specs;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.inject.Inject;

public class SalesRepSpec extends Specs.BaseSpec {
    @NoArgsConstructor
    public static class GetAllSalesRep extends Specs.BaseSpec {
    }

    @AllArgsConstructor
    public static class GetSalesRepPaginated extends Specs.BaseSpec{

        Long start;
        Long limit;
        Long offset;

        public GetSalesRepPaginated(Long start, Long limit) {
            super();
            this.start = start;
            this.limit = limit;
            Long t = limit * (start - 1);
            this.offset = t;
        }
        public Long getOffset(){
            return offset;
        }


        public Long getLimit() {
            return limit;
        }


    }
}
