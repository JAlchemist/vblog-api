package com.seu.common.handler;

import com.google.common.base.Strings;
import com.seu.blog.entity.UserTokenEntity;
import com.seu.blog.service.ShiroService;
import com.seu.common.annotation.TokenToUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * @author ethan
 * @date 2018/12/27
 */
@Service
public class TokenToUserMethodArgumentResolver implements HandlerMethodArgumentResolver {
    @Autowired
    private ShiroService shiroService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        TokenToUser.class.isAssignableFrom(parameter.getParameterType());

        if(parameter.hasParameterAnnotation(TokenToUser.class)){
            return true;
        }
        return false;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        if(parameter.getParameterAnnotation(TokenToUser.class) instanceof TokenToUser){
            String accessToken = webRequest.getHeader("Oauth-Token");
            UserTokenEntity token = null;
            //根据accessToken，查询用户信息
            if(!Strings.isNullOrEmpty(accessToken) && accessToken.length() == 32){
                token = shiroService.queryByToken(accessToken);
            }
            return token;
        }
        return null;
    }
}
