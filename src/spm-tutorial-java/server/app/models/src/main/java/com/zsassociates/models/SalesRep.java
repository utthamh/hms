package com.zsassociates.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SalesRep extends BaseEntity{
    @JsonProperty("name")
private String Name;
    @JsonProperty("country")
private String Country;
    @JsonProperty("city")
private String City;
    @JsonProperty("zipcode")
private String Zipcode;
    @JsonProperty("gender")
private String Gender;
public SalesRep(long id,String salesRepName,String country,String city,String pincode,String gender){
    super(id);
    this.Name=salesRepName;
    this.Country=country;
    this.City=city;
    this.Zipcode=pincode;
    this.Gender=gender;
}
}
