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

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(SalesRep rep) {
     try{   SalesRep salesReps = salesRepDaoServices.save(rep);
        return Response.ok().entity(rep).build();
    }catch(Exception e){
            return  Response.status(500,e.getMessage()).build();
        }
    }
    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(SalesRep rep,@PathParam("id")Integer id) {
      try{  SalesRep salesReps = salesRepDaoServices.update(rep, id);
        return Response.ok().entity(rep).build();
    } catch(Exception e){
        return  Response.status(404,"Not Found").build();
    }
    }
    @DELETE
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id")Long id) {
        //List<SalesRep> salesReps = salesRepDaoServices.getAllSalesRep();
        try {
            salesRepDaoServices.delete(id);
            return Response.ok().entity(id).build();
        }catch(Exception e){
            return  Response.status(404,"Not Found").build();
        }
    }
    @GET
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id")Long id) {
        try{
        SalesRep salesReps = salesRepDaoServices.getById(id);
        return Response.ok().entity(salesReps).build();}
        catch(Exception e){
            return  Response.status(404,"Not Found").build();
        }
    }

}
