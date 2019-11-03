package com.seu.common.annotation;

import java.lang.annotation.*;

/**
 * @author ethan
 * @date 2018/12/27
 */
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TokenToUser {
    /**
     * 当前用户在request中的名字
     * @return
     */
    String value() default "user";
}
