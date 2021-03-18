package com.zsassociates.server;

import com.zsassociates.aws.runtime.local.ZSHttpServer;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LocalServer extends ZSHttpServer {
    public static void main(String[] args) {
        System.setProperty("guiceModuleClassCanonicalName", "com.zsassociates.utils.InjectorModule");
        System.setProperty("environmentCode", "localenv");
        System.setProperty("configBucket", "localdev-SdTutorialConfig");
        System.setProperty("allowedOrigin", "*");
        System.setProperty("packageName", "com.zsassociates.controllers");
        System.setProperty("appCode", "sd-tutorial");
        //System.setProperty("additionalApplicationComponents",getAdditionalComponents());

        LocalServer localServer = new LocalServer();
        localServer.init();
    }
    private static String getAdditionalComponents() {
        List<String> additionalComponents = new ArrayList<>();
        additionalComponents.add("com.zsassociates.spm.common.providers.filters.PreRequestFilter");
        additionalComponents.add("com.zsassociates.spm.common.providers.SPMParamConverterProvider");
        additionalComponents.add("com.zsassociates.spm.common.providers.ApiRequestInterceptor");
        additionalComponents.add("com.zsassociates.spm.common.providers.ApiResponseInterceptor");
        String additionalComponentsString = String.join(",", additionalComponents);
        return additionalComponentsString;
    }
    @Override
    public int getPort() {
        return 9097;

    }
}
