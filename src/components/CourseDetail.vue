<template>
  <el-container>

    <el-header class="head" style="margin-bottom: 0px">
      <el-page-header @back="goBack" :content="name">
      </el-page-header>
    </el-header>

    <el-main class="content" style="margin-top: 0px">
      <el-card shadow="never" style="margin-bottom: 30px;">
        <div class="det" >
        <div v-html="content" ></div>
       </div>
      </el-card>


    </el-main>
  </el-container>
</template>

<script>

    import {reqgetCoursedetail} from "../api";

    export default {
      name: "CourseDetail",
      data() {
        return {
          id: 0,
          name: "",
          content: "空空如也",
          height: "500px",

        }
      },
      methods: {
        goBack() {
          this.$router.back();
        },
        async getData() {
          console.log("11111")
          let result = await reqgetCoursedetail(this.id);
          console.log(result)
          if (result.code === 200) {
            this.content = result.data.content;

          } else {
            this.$message.error('出错了！' + result.code + ":" + result.data);
          }
        },



      },
      created() {
        console.log("222")
        this.id = this.$route.query.id;
        this.name = this.$route.query.name;
        this.getData();

      },
      beforeMount() {
        let h = document.documentElement.clientHeight || document.body.clientHeight;
        this.height = h - 190 + "px";
      }
    }
</script>

<style scoped>
  .det{
    height: 570px;
    overflow:scroll;
    overflow-x:hidden;
  }
  .head {
    height: 30px;
    background-color: white;
    width: 100%;
    margin-bottom: 0;
  }
.content{
  margin-top: 0;
}

</style>
