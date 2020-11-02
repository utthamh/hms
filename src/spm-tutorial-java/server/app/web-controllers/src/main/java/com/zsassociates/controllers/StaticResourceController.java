package com.zsassociates.controllers;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import javax.annotation.security.PermitAll;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("ui")
public class StaticResourceController extends BaseResourceController {

    @GET
    @Path("{path:.*}")
    @PermitAll
    //@Compress
    @Operation(summary = "Get static UI resources", tags = {"assets"},
            description = "Get static UI resources",
            responses= {@ApiResponse(responseCode = "200", description = "Successful")})
    public Response Get(@PathParam("path") String path) {
        path = "ui/" + path;
        return super.Get((path));
    }
}
