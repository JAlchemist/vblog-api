package com.seu;

import org.apache.shiro.crypto.hash.Sha256Hash;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author ethan
 * @date 2018/12/27
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class TestUser {

    @Test
    public void test(){
        String password = new Sha256Hash("123456", "JAlchemist").toHex();

        System.out.println(password);
    }
}
