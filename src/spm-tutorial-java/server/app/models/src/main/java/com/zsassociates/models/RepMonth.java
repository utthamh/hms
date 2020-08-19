package com.zsassociates.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
public class RepMonth extends BaseEntity{
    @JsonProperty("name")
    public String Name;
    @JsonProperty("product")
    public String Product;
    @JsonProperty("month")
    public String Month;

    public RepMonth(String name,String product,String month){
        super();
        this.Name = name;
        this.Product = product;
        this.Month = month;
    }

    public RepMonth(String name, String product) {
        super();
        this.Name = name;
        this.Product = product;
    }
}
