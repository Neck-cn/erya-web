<template>
  <div id="container">
    <div id="back">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
               class="demo-ruleForm">
        <div id="title1"><span id="title">账号登录</span></div>

        <el-form-item label="用户名" prop="name">
          <el-input type="text" v-model="ruleForm.name" autocomplete="off" class="in"/>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" class="in"/>
        </el-form-item>


        <el-form-item id="foot">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
  import {reqPwdLogin} from "../api";
  import global from "../api/global";

  export default {
    data() {
      const checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('用户名不能为空'));
        }
        callback();
      };

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        callback();
      };

      return {
        ruleForm: {
          name: '',
          pass: '',
        },
        rules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      async submitForm(formName) {
        let result;
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // alert("登录成功");
            //发送请求
            let username = this.ruleForm.name;
            let password = this.ruleForm.pass;
            let time = new Date().getTime();
            // console.log(time);
            const fun_aes = require("../api/aes.js");
            let srcs = fun_aes.CryptoJS.enc.Utf8.parse(password);
            const key = fun_aes.CryptoJS.enc.Utf8.parse(require("../api/md5.js").hex_md5(time.toString()));
            const encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
              mode: fun_aes.CryptoJS.mode.ECB,
              padding: fun_aes.CryptoJS.pad.Pkcs7
            });
            password = require("../api/base64.js").Base64.encode(encrypted.toString());
            result = await reqPwdLogin({username, password, time});
            if (result.code !== 200) {
              this.$message.error('登录失败！' + result.code + ":" + result.data);
              return;
            }
            if (result.code === 200) {
              if (result.data === '') {
                this.$message.error('登录失败！' + result.code + ":" + result.data);
              } else {
                global.token = result.data.token;

                this.$cookies.set("token",global.token,result.data.expiretime);
               //localStorage.setItem("token",global.token);
                this.$message.success("登录成功！");
                await this.$router.replace('/answer');
              }
            }
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  #title1 {
    color: #666;
    font-size: 14px;
    font-style: normal;
    padding: 24px 30px 10px;
    text-align: center;
  }

  #title {
    display: inline-block;
    width: 100%;
    line-height: 18px;
    font-size: 18px;
    font-family: PingFangSC-Medium, serif;
    color: #252B3A;
  }

  #back {
    width: 380px;
    display: flex;
    background-color: #fff;
    color: #C1C1C1;
    font-size: 14px;
    border-color: rgba(228, 228, 228, 1);
    border-radius: 0;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, .1);

  }

  #foot {
    text-align: center;
  }

  #container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
</style>
