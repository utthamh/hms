package com.zsassociates.controllers;


import com.zsassociates.aws.runtime.proxy.Transactional;
import com.zsassociates.models.SalesRep;
import com.zsassociates.services.SalesRepDaoService;


import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.List;

@Path("salesrep")
public class SalesRepController {

    private SalesRepDaoService salesRepDaoServices;
    @Inject
    public SalesRepController(SalesRepDaoService salesRepDaoServices){
    this.salesRepDaoServices=salesRepDaoServices;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        List<SalesRep> salesReps = salesRepDaoServices.getAllSalesRep();
        return Response.ok().entity(salesReps).build();
    }

    @GET
    @Path("/{start}/{limit}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getSalesRepPaginated(@PathParam("start") Long start, @PathParam("limit") Long limit){
        List<SalesRep> salesReps = salesRepDaoServices.getSalesRepPaginated(start,limit);
        return Response.ok().entity(salesReps).build();
    }

}
