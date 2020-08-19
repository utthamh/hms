package com.zsassociates.dataaccess.Specs;

import com.zsassociates.dataaccess.util.Specs;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class RepMonthSpec extends Specs.BaseSpec {

    //@AllArgsConstructor
    public static class GetRepOfTheMonth extends Specs.BaseSpec {

        String product;
        String month;

        public GetRepOfTheMonth(String product,String month){
            this.product = product;
            this.month = month;
        }


        public String getProduct(){
            return product;
        }

        public String getMonth(){
            return month;
        }

    }

}
