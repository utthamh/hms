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
    @Transactional
    public Response addSalesRep(SalesRep rep){
        try{
        Long id=salesRepDaoServices.addSalesRep(rep);
        rep.setId(id);
        }
        catch (Exception ex){
            return Response.notModified().entity(rep).build();
        }
        return Response.ok().entity(rep).build();
    }
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
     @Transactional
    public Response updateSalesRep(SalesRep rep){

        try{
            salesRepDaoServices.updateSalesRep(rep);
        }
        catch (Exception ex){
            return Response.notModified().entity(rep).build();
        }
        return Response.ok().entity(rep).build();
    }
    @Path("{entity_id}")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deleteSalesRep(@PathParam("entity_id") long id){

        try{
            salesRepDaoServices.deleteSalesRep(id);
        }
        catch (Exception ex){
            return Response.noContent().entity(id).build();
        }
        return Response.ok().entity(id).build();
    }
}
