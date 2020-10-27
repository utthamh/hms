package com.zsassociates.controllers;


import com.zsassociates.spm.alignment.web.utils.ApiConstants;
import com.zsassociates.spm.common.providers.Compress;
import io.swagger.v3.oas.annotations.Operation;

import javax.annotation.security.PermitAll;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("assets")
public class AssetController extends BaseResourceController {
    @GET
    @Path("{path:.*}")
    @PermitAll
    //@Compress
    @Operation(summary = "Get UI assets", tags = {"assets"},
            description = "Get UI assets")
    public Response Get(@PathParam("path") String path) {
        path = "ui/assets/" + path;
        return super.Get((path));
    }
}