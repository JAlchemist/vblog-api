package com.seu.config;

import com.seu.common.handler.TokenToUserMethodArgumentResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.List;

/**
 * @author ethan
 * @date 2018/12/14
 */
@Configuration
public class WebConfig extends WebMvcConfigurationSupport {

    @Autowired
    private TokenToUserMethodArgumentResolver tokenToUserMethodArgumentResolver;

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");

        registry.addResourceHandler("/**").addResourceLocations("classpath:/html/");

        registry.addResourceHandler("/").addResourceLocations("classpath:/html/index.html");

        super.addResourceHandlers(registry);
    }


    @Override
    protected void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(tokenToUserMethodArgumentResolver);
    }
}
