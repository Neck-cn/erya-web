<template>
  <div style="margin: 0;padding: 0;width: 83%">
    <el-header class="head">
      <el-page-header @back="goBack" :content="name"/>
      <el-button type="primary" icon="el-icon-edit" circle @click="editCourse"/>
    </el-header>
    <div class="content">
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>

  import {reqgetCoursedetail} from "../api";
  import global from "../api/global";
  export default {
    name: "CourseDetail",
    data() {
      return {
        id: 0,
        name: "",
        content:""
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      async getData() {
        let result = await reqgetCoursedetail(this.id);
        if (result.code === 200) {
          this.content = result.data.content;
          global.course.id=this.id;
          global.course.name=this.name;
          global.course.content=this.content;
        } else {
          global.course={};
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }
      },editCourse(){
        this.$router.push({path: "/course/edit"});
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.name = this.$route.query.name;
      this.getData();
    }
  }
</script>

<style scoped>
  .content {
    border-radius: 0 0 8px 8px;
    background-color: white;
    margin: 0 2%;
    padding: 1%;
    height: 78vh;
    overflow: scroll;
    overflow-x: hidden;
    width: 95%;
  }

  .head {
    border-radius: 8px 8px 0 0;
    width: 97%;
    margin: 2% 1% 0 2%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

</style>
