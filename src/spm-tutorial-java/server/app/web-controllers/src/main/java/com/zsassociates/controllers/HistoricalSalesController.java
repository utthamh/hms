package com.zsassociates.controllers;

import com.zsassociates.services.SalesRepDaoService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("historicalsales")
public class HistoricalSalesController {
    private SalesRepDaoService salesRepDaoServices;
    @Inject
    public HistoricalSalesController(SalesRepDaoService salesRepDaoServices){
        this.salesRepDaoServices=salesRepDaoServices;
    }
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(String filePath){
        return  Response.ok().entity("").build();
    }
}
