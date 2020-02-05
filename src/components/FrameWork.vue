<template>
    <el-container>
      <el-aside  style="width: 230px">
        <el-menu
          class="menu"
          :style="menu"
          router
          default-active="1"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/framework/answer">
            <i class="el-icon-menu"></i>
            <span slot="title">网课答案</span>
          </el-menu-item>
          <el-menu-item index="/spider">
            <i class="el-icon-menu"></i>
            <span slot="title">爬虫数据</span>
          </el-menu-item>
          <el-menu-item index="/answerTemp">
            <i class="el-icon-menu"></i>
            <span slot="title">临时表数据</span>
          </el-menu-item>
          <el-menu-item index="/course">
            <i class="el-icon-menu"></i>
            <span slot="title">课程数据</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <i class="el-icon-menu"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/problem">
            <i class="el-icon-menu"></i>
            <span slot="title">用户反馈</span>
          </el-menu-item>
          <el-menu-item index="/AppError">
            <i class="el-icon-menu"></i>
            <span slot="title">客户端错误</span>
          </el-menu-item>
          <el-menu-item index="/ServerError">
            <i class="el-icon-menu"></i>
            <span slot="title">服务器错误</span>
          </el-menu-item>
          <el-menu-item @click="showDialog">
            <i class="el-icon-menu"></i>
            <span slot="title">通知管理</span>
          </el-menu-item>
          <el-menu-item @click="readyChange">
            <i class="el-icon-menu"></i>
            <span slot="title">更改客户端状态</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive>
          <!--          <router-view v-if="$route.meta.keepAlive"></router-view>-->
          <router-view/>
        </keep-alive>
        <!--        <router-view v-if="!$route.meta.keepAlive"></router-view>-->
      </el-main>
    </el-container>
</template>

<script>
  import {reqgetDeploy, reqgetNotice, reqsetDeploy} from "../api";

  export default {
    name: 'App',
    data() {
      return {
        dialogFormVisible: false,
        form: {
          content: null,
        },
        deploy: null,
        menu: "",
        token:''
      }
    },
    methods: {
      async showDialog() {
        if (this.form.content == null) {
          let result = await reqgetNotice();
          if(result.code===200){
            this.form.content = result.data;
            this.dialogFormVisible = true;
          }else{
            this.$message.error('出错了！'+result.code+":"+result.data);
          }

        } else {
          this.dialogFormVisible = true;
        }
      },
      async readyChange() {
        if (this.deploy == null) {
         let result = await reqgetDeploy();
         if(result.code===200){
           this.deploy = result.data;
           this.changeStatus();
         }else{
           this.$message.error('出错了！'+result.code+":"+result.data);
         }

        } else {
          this.changeStatus();
        }
      },
      changeStatus() {
        let temp = !this.deploy;
        this.$confirm('确定要更改状态为' + temp + '吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let deploy=temp;

          let result=await reqsetDeploy(deploy);
          if(result.code===200){
            this.$message({
              type: 'success',
              message: '更改成功!'
            });
            this.deploy = temp;
          }else{
            this.$message.error('出错了！'+result.code+":"+result.data);
          }

        })
      },
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
