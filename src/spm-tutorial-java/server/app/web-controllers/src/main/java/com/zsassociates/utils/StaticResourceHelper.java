package com.zsassociates.utils;

import com.zsassociates.aws.configuration.ConfigurationManager;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StaticResourceHelper {

    public static Map<String, String> ExtensionsContentTypeMap = new HashMap<>();

    static {
        ExtensionsContentTypeMap.put("js", "application/javascript");
        ExtensionsContentTypeMap.put("html", "text/html");
        ExtensionsContentTypeMap.put("htm", "text/html");
        ExtensionsContentTypeMap.put("css", "text/css");
        ExtensionsContentTypeMap.put("png", "image/png");
        ExtensionsContentTypeMap.put("jpeg", "image/jpeg");
        ExtensionsContentTypeMap.put("jpg", "image/jpeg");
        ExtensionsContentTypeMap.put("jpe", "image/jpeg");
        ExtensionsContentTypeMap.put("xml", "text/xml");
        ExtensionsContentTypeMap.put("otf", "application/x-font-opentype");
        ExtensionsContentTypeMap.put("eot", "application/vnd.ms-fontobject");
        ExtensionsContentTypeMap.put("svg", "image/svg+xml");
        ExtensionsContentTypeMap.put("woff", "application/font-woff");
        ExtensionsContentTypeMap.put("woff2", "application/font-woff2");
        ExtensionsContentTypeMap.put("ttf", "application/x-font-ttf");
        ExtensionsContentTypeMap.put("sfnt", "application/font-sfnt");
        ExtensionsContentTypeMap.put("json", "application/json");
    }

    public static String getFileExtension(final String fileName) {
        if (fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0) {
            return fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        return null;
    }

    public static Optional<String> getContentType(String fileName) {
        return Optional.ofNullable(getFileExtension(fileName))
                .map(ExtensionsContentTypeMap::get);
    }

    public static void setCacheHeader(Response.ResponseBuilder builder) {
        String cacheConfigString = ConfigurationManager.getStringOrElse("appConfig.staticContentCacheInHours", "0");

        if (isNotBlank(cacheConfigString)) {
            CacheControl cache = new CacheControl();
            cache.setPrivate(true);
            int cachingNumberOfHours = Integer.parseInt(cacheConfigString);
            cache.setMaxAge(cachingNumberOfHours * 3600);
            builder.cacheControl(cache);
        }
    }
}
