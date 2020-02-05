<template>
  <el-container>

    <el-main>
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;border-radius: 8px"
          :height="height"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="problem">
            <template slot="header" slot-scope="scope">
              <el-input
                prefix-icon="el-icon-search"
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
                @keyup.native="getList()"/>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="time"
            label="时间">
          </el-table-column>
        </el-table>
        <div style="display: flex;align-items:center;">
          <el-button type="danger" @click="deleteProblem()" :disabled="disable">删除</el-button>
          <el-button type="success" @click="toggleSelection()" :disabled="disable">取消选择</el-button>
          <el-button type="danger" @click="clearItems()">清空</el-button>
          <div class="bottom">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="changeCurrent">
            </el-pagination>
            <el-select size="mini" v-model="pageSize" value="" @change="pageSizeChange">
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
  </el-container>

</template>

<script>
  import {reqAnswerList, reqdeleteProblem, reqProblemclear, reqProblemList} from "../api";

    export default {
        name: "problem",
        data() {
            return {
                search: "",
                total: 0,
                pageSize: 20,
                currentPage: 1,
                pageOption: [20, 30, 50, 100],
                disable: true,height: "500px",
                tableData: [],
                multipleSelection: []
            }
        },
        methods: {
            changeCurrent(res) {
                this.currentPage = res;
                this.getList();
            },
            pageSizeChange() {
                this.getList();
            },
            toggleSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            clearItems() {
                this.$confirm('此操作将删除所有数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                 let result =await  reqProblemclear();
                 if(result.code===200){
                   this.$message({
                     type: "success",
                     message: "清除了" + result.data + "条数据"
                   });
                   this.getList();
                 }else{
                   this.$message.error('出错了！'+result.code+":"+result.data);
                 }

                });
            },
            deleteProblem() {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let list = [];
                    this.multipleSelection.forEach((value, index) => list[index] = value.id);
                    list = JSON.stringify(list);
                  let result =await reqdeleteProblem(list);
                  if(result.code===200){
                    this.$message({
                      type: "success",
                      message: "删除了" + result.data + "条数据"
                    });
                    this.getList();
                  }else{
                    this.$message.error('出错了！'+result.code+":"+result.data);
                  }

                });
            },
            handleSelectionChange(val) {
                this.disable = val.length === 0;
                this.multipleSelection = val;
            },
          async getList() {
            let search=this.search;
            let result=await reqProblemList(this.currentPage,this.pageSize,{search});
            // console.log(result);
            if(result.code===200){
              this.total = result.data.total;
              this.tableData = result.data.records;

            }else{
              this.$message.error('出错了！'+result.code+":"+result.data);
            }
          },

        },
        created() {
            this.getList();
        }, beforeMount() {
            let h = document.documentElement.clientHeight || document.body.clientHeight;
            this.height = h - 120 + "px";
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
