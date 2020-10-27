package com.zsassociates.controllers;

import com.zsassociates.spm.alignment.web.utils.StaticResourceHelper;
import com.zsassociates.utils.StaticResourceHelper;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;
import java.io.File;
import java.net.URL;

public class BaseResourceController {

    public Response Get(String path) {
        File file = getResourceFile(path);
        String contentType = StaticResourceHelper.getContentType(file.getName())
                .orElseThrow(() -> new NotFoundException("File extension not supported " + file.getName()));
        Response.ResponseBuilder builder = Response.ok(file).type(contentType);
        StaticResourceHelper.setCacheHeader(builder);
        return builder.build();
    }

    private File getResourceFile(String path) {
        ClassLoader classLoader = getClass().getClassLoader();
        final URL pathResource = classLoader.getResource(path);
        if(pathResource == null) {
            throw new NotFoundException(path + " file not found");
        }
        return new File(pathResource.getFile());
    }

}
