<template>
  <el-main>
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
        prop="question"
        label="问题">
      </el-table-column>
      <el-table-column
        prop="answer"
        label="答案">
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
            @click="handleEdit(scope.row)">编辑
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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref='form' :rules="answerRules">
        <el-form-item label="问题" prop="question">
          <el-input v-model="form.question"/>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="answerChanged('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
  import {reqAnswerAdd, reqAnswerDelete, reqAnswerList, reqAnswerModify} from "../api";

  export default {
    name: "Answer",
    data() {
      return {
        dialogTipsVisible: false,
        dialogSpiderVisible: false,
        search: "",
        spiderTitle: "查看爬虫数据",
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        pageOption: [20, 30, 50, 100],
        category: "answers",
        dialog: "modify",
        multipleSelection: [],
        dialogFormVisible: false,
        title: "修改答案",
        form: {
          id: 0,
          question: "",
          answer: ""
        },
        disable: true,
        answerRules: {
          question: [
            {required: true, message: '问题不能为空'}
          ],
          answer: [
            {required: true, message: '密码不能为空'}
          ]
        }
      }
    },
    methods: {
      async getList() {
        let search = this.search;
        let result = await reqAnswerList(this.currentPage, this.pageSize, {search});
        // console.log(result);
        if (result.code === 200) {
          this.total = result.data.total;
          this.tableData = result.data.records;

        } else {
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }
      },
      addAnswer() {
        this.title = "添加答案";
        this.dialog = "add";
        this.form.question = "";
        this.form.answer = "";
        this.dialogFormVisible = true;
        this.form.disable = false;
      },
      toggleSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.disable = val.length === 0;
        this.multipleSelection = val;//记录已选中的元素
      },
      changeCurrent(res) {
        this.currentPage = res;
        this.getList();
      },
      pageSizeChange() {
        this.getList();
      },
      handleEdit(row) {
        this.title = "修改答案";
        this.form.disable = true;
        this.form.id = row.id;
        this.form.question = row.question;
        this.form.answer = row.answer;
        this.dialogFormVisible = true;
        this.dialog = "modify";
      }, deleteSelection() {//删除
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let list = [];
          this.multipleSelection.forEach((value, index) => list[index] = value.id);
          list = JSON.stringify(list);
          if (this.multipleSelection.length !== 0) {
            let result = await reqAnswerDelete(list);
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
      },
      answerChanged(form) {//修改 添加
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            let answer = {
              id: this.form.id,
              question: this.form.question,
              answer: this.form.answer
            };
            // let json = JSON.stringify(answer);
            //let url = "answer/" + this.dialog;
            this.dialogFormVisible = false;
            let result;
            if (this.dialog === 'modify') {
              result = await reqAnswerModify(answer);
            }
            if (this.dialog === 'add') {
              result = await reqAnswerAdd(answer);
            }
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: result.data + "条数据被改变"
              });
              this.getList();
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }
          }
        })
      }
    },
    created() {
      this.getList();
    },
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
