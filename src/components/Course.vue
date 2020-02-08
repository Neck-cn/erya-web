<template>
  <el-main>
    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;border-radius: 8px"
        height="82vh"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          sortable
          prop="name"
          label="课程名">
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input
              prefix-icon="el-icon-search"
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
              @keyup.native="getList()"/>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showDetail(scope.row)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;align-items:center;">
        <el-button type="primary" @click="addAnswer()">添加</el-button>
        <el-button type="success" @click="toggleSelection()" :disabled="disable">取消选择</el-button>
        <el-button type="danger" @click="deleteSelection()" :disabled="disable">删除所选</el-button>
        <div class="bottom">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="changeCurrent">
          </el-pagination>
          <el-select size="mini" v-model="pageSize" value="" @change="pageSizeChange()">
            <el-option
              v-for="item in pageOption"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
  import {reqCourse, reqCourselistdelete} from "../api";

  export default {
    name: "Course",
    data() {
      return {
        dialogFormVisible: false,
        search: "",
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        pageOption: [20, 30, 50, 100],
        multipleSelection: [],
        disable: true,
        height: "500px",

      }
    },
    methods: {
      async getList() {
        let search = this.search;
        let result = await reqCourse(this.currentPage, this.pageSize, {search});
        // console.log(result);
        if (result.code === 200) {
          this.total = result.data.total;
          this.tableData = result.data.records;

        } else {
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }
      },
      addAnswer() {
      },
      toggleSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.disable = val.length === 0;
        this.multipleSelection = val;
      },
      changeCurrent(res) {
        this.currentPage = res;
        this.getList();
      },
      pageSizeChange() {
        this.getList();
      }, deleteSelection() {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let list = [];
          this.multipleSelection.forEach((value, index) => list[index] = value.question);
          list = JSON.stringify(list);
          if (this.multipleSelection.length !== 0) {
            let result = await reqCourselistdelete(list);
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: "删除" + result.data + "条数据"
              });
              this.getList()
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }
          }
        });
      }, showDetail(row) {
        this.$router.push({path: "/course/detail", query: {id: row.id, name: row.name}});
      }
    },
    created() {
      this.getList();
    }
  }
</script>

<style scoped>
  .bottom {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
  }
</style>
