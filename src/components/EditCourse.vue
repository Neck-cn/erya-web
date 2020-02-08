<template>
  <div style="margin: 0;padding: 0;width: 83%">
    <el-header class="head">
      <el-button type="danger" @click="cancelCourse">取消</el-button>
      <span v-text="name"/>
      <el-button type="primary" @click="saveCourse">保存</el-button>
    </el-header>
    <div class="content">
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>
  import global from "../api/global";

  export default {
    name: "EditCourse",
    data() {
      return {
        id: 0,
        name: "",
        content: ""
      }
    }, methods: {
      cancelCourse() {
        this.$router.back();
      },
      saveCourse() {
      }
    }, created() {
      this.id = global.course.id;
      this.name = global.course.name;
      this.content = global.course.content;
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
