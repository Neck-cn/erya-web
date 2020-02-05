<template>
  <div id="app">



  <keep-alive>
    <!--          <router-view v-if="$route.meta.keepAlive"></router-view>-->
    <router-view/>
  </keep-alive>
  <!--        <router-view v-if="!$route.meta.keepAlive"></router-view>-->



    <el-dialog title="修改通知" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="通知内容">
          <el-input v-model="form.content" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTips('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {reqsetNotice} from "./api";

    export default {
        name: 'App',
        data() {
            return {
                dialogFormVisible: false,
                form: {
                    content: null,
                }, deploy: null,
                menu: "",
                token:''
            }
        },
        methods: {
            async addTips() {
              let notice=this.form.content;

              let result = await reqsetNotice(notice);
              if(result.code===200){
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.dialogFormVisible = false;
              }else{
                this.$message.error('出错了！'+result.code+":"+result.data);
              }

            },
          beforeMount() {
            let h = document.documentElement.clientHeight || document.body.clientHeight;
            this.menu = "padding-bottom:" + (h - 625) + "px";
            console.log(this.menu);
        }
    }}
</script>

<style>
  #app {
    min-width: 1200px;
    background: url('./assets/background.jpg') no-repeat;
    background-size: 100%;
    height: 100vh;


  }


</style>
