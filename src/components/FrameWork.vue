<template>
  <el-container>
    <el-aside style="width: 15%;margin-left: 1%;margin-top: 1%">
      <el-menu
        class="menu"
        :style="menu"
        router
        default-active="1"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/answer">
          <i class="el-icon-menu"/>
          <span slot="title">网课答案</span>
        </el-menu-item>
        <el-menu-item index="/spider">
          <i class="el-icon-menu"/>
          <span slot="title">爬虫数据</span>
        </el-menu-item>
        <el-menu-item index="/answerTemp">
          <i class="el-icon-menu"/>
          <span slot="title">临时表数据</span>
        </el-menu-item>
        <el-menu-item index="/course">
          <i class="el-icon-menu"/>
          <span slot="title">课程数据</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <i class="el-icon-menu"/>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/problem">
          <i class="el-icon-menu"/>
          <span slot="title">用户反馈</span>
        </el-menu-item>
        <el-menu-item index="/AppError">
          <i class="el-icon-menu"/>
          <span slot="title">客户端错误</span>
        </el-menu-item>
        <el-menu-item index="/ServerError">
          <i class="el-icon-menu"/>
          <span slot="title">服务器错误</span>
        </el-menu-item>
        <el-menu-item @click="showDialog">
          <i class="el-icon-menu"/>
          <span slot="title">通知管理</span>
        </el-menu-item>
        <el-menu-item @click="readyChange">
          <i class="el-icon-menu"/>
          <span slot="title">更改客户端状态</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
    <el-dialog title="修改通知" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="通知内容">
          <el-input v-model="form.content" type="textarea" :rows="5"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTips('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {reqgetDeploy, reqgetNotice, reqsetDeploy, reqsetNotice} from "../api";

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
      }
    },
    methods: {
      async showDialog() {
        if (this.form.content == null) {
          let result = await reqgetNotice();
          if (result.code === 200) {
            this.form.content = result.data;
            this.dialogFormVisible = true;
          } else {
            this.$message.error('出错了！' + result.code + ":" + result.data);
          }

        } else {
          this.dialogFormVisible = true;
        }
      },
      async readyChange() {
        if (this.deploy == null) {
          let result = await reqgetDeploy();
          if (result.code === 200) {
            this.deploy = result.data;
            this.changeStatus();
          } else {
            this.$message.error('出错了！' + result.code + ":" + result.data);
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
        }).then(async () => {
          let result = await reqsetDeploy(temp);
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '更改成功!'
            });
            this.deploy = temp;
          } else {
            this.$message.error('出错了！' + result.code + ":" + result.data);
          }
        })
      },
      async addTips() {
        let notice = this.form.content;
        let result = await reqsetNotice(notice);
        if (result.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.dialogFormVisible = false;
        } else {
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }
      },
    }
  }
</script>

<style scoped>

</style>
