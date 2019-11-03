package com.seu.blog.controller.admin;

import cn.hutool.core.util.StrUtil;
import com.seu.blog.entity.ArticleEntity;
import com.seu.blog.entity.UserEntity;
import com.seu.blog.entity.UserTokenEntity;
import com.seu.blog.service.ArticleService;
import com.seu.blog.service.UserService;
import com.seu.common.annotation.TokenToUser;
import com.seu.common.component.R;
import com.seu.common.utils.PageUtils;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

/**
 * @author ethan
 * @date 2018/12/27
 */
@Slf4j
@RestController
@RequestMapping("/admin/article")
public class AdminArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private UserService userService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = articleService.queryPage2(params);
        return R.ok().put("page", page);
    }

    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
        ArticleEntity articleEntity = articleService.selectById(id);
        return R.ok(articleEntity);
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@RequestBody ArticleEntity articleEntity){
        boolean result = articleService.updateById(articleEntity);
        return R.ok(result);
    }

    @RequestMapping("/save")
    public R save(@RequestBody ArticleEntity articleEntity, @TokenToUser UserTokenEntity userTokenEntity){
        UserEntity userEntity = userService.queryByUserId(userTokenEntity.getUserId());
        articleEntity.setNickname(userEntity.getNickname());
        articleEntity.setUserId(userEntity.getId());
        articleEntity.setSummary("简介");
        Date date = new Date();
        articleEntity.setCreateTime(date);
        articleEntity.setUpdateTime(date);
        articleEntity.setWeight(0);
        boolean result = articleService.insert(articleEntity);
        return R.ok(result);
    }

    @RequestMapping("/delete/{id}")
    public R delete(@PathVariable("id") Long id){
        boolean result = articleService.deleteById(id);
        return R.ok(result);
    }

}
