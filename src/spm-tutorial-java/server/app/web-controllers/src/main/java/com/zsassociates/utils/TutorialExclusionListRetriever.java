package com.zsassociates.utils;

import com.zsassociates.aws.runtime.proxy.JWTRequestFilter;

import java.util.ArrayList;

public class TutorialExclusionListRetriever implements JWTRequestFilter.IExclusionListRetriever {
    @Override
    public ArrayList<String> getExcludedBasePaths() {
        ArrayList<String> excludedPaths = new ArrayList<>();
        excludedPaths.add("hello");
        excludedPaths.add("salesrep");
        excludedPaths.add("historicalsales");
        excludedPaths.add("assets");
        excludedPaths.add("ui");
        return excludedPaths;
    }
}