package com.zsassociates.controllers;

import com.zsassociates.aws.runtime.proxy.Transactional;
import com.zsassociates.models.RepMonth;
import com.zsassociates.models.SalesRep;
import com.zsassociates.services.RepMonthDaoService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.List;

@Path("rep")
public class RepMonthController {

    private RepMonthDaoService repMonthDaoService;
    @Inject
    public RepMonthController(RepMonthDaoService repMonthDaoService){
        this.repMonthDaoService = repMonthDaoService;
    }

    @GET
    @Path("/{product}/{month}")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getRepOfTheMonth(@PathParam("product") String product, @PathParam("month") String month){
        List<RepMonth> salesReps = repMonthDaoService.getRepOfTheMonth(product,month);
        return Response.ok().entity(salesReps).build();

    }
}
