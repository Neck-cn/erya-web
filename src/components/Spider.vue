<template>
    <el-main>
      <div>
        <el-table
          v-loading="loading"
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
          <el-button type="success" @click="toggleSelection()" :disabled="disable">取消选择</el-button>
          <el-button type="danger" @click="deleteSelection()" :disabled="disable">删除</el-button>
          <el-button type="primary" @click="spiderRun()">运行爬虫</el-button>
          <el-button type="primary" @click="dataMerge()">合并选中数据</el-button>
          <el-button type="primary" @click="dataMergeAll()">合并所有数据</el-button>
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
        <el-dialog title="运行爬虫" :visible.sync="dialogSpiderVisible">
          <el-form :model="spider" ref="form" :rules="spiderRules">
            <el-form-item label="请输入URL" prop="url">
              <el-input v-model="spider.url"/>
            </el-form-item>
            <el-form-item label="请输入线程数" prop="thread">
              <el-input type="number" v-model="spider.thread"/>
            </el-form-item>
            <el-form-item label="请输入间隔时间(毫秒)" prop="time">
              <el-input type="number" v-model="spider.time"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSpiderVisible = false">取 消</el-button>
            <el-button type="primary" @click="startSpider('form')">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改答案" :visible.sync="dialogFormVisible">
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
      </div>
    </el-main>
</template>

<script>
  import {
    reqspiderdelete,
    reqspiderList,
    reqspidermerge, reqspidermergeAll,
    reqspidermodify, reqstartSpider
  } from "../api";

  export default {
    name: "Spider",
    data() {
      return {
        spider: {
          url: "",
          thread: 0,
          time: 0
        },
        dialogTipsVisible: false,
        dialogSpiderVisible: false,
        search: "",
        spiderTitle: "查看爬虫数据",
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        pageOption: [20, 30, 50, 100],
        multipleSelection: [],
        dialogFormVisible: false,
        loading: false,
        form: {
          id: 0,
          question: "",
          answer: "",
          disable: true
        },
        disable: true,
        answerRules: {
          question: [
            {required: true, message: '问题不能为空'}
          ],
          answer: [
            {required: true, message: '密码不能为空'}
          ]
        }, spiderRules: {
          url: [{required: true, message: '请输入url'}, {type: 'url', message: '请输入正确的url'}],
          thread: [{required: true, message: '不能为空'}, {min: '1', message: '数值至少为1'}],
          time: [{required: true, message: '不能为空'}, {min: '1000', message: '数值至少为1000'}]
        }
      }
    },
    methods: {
      async getList() {
        let search = this.search;
        let result = await reqspiderList(this.currentPage, this.pageSize, {search});
        // console.log(result);
        if (result.code === 200) {
          this.total = result.data.total;
          this.tableData = result.data.records;

        } else {
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }
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
      },
      handleEdit(row) {
        this.form.id = row.id;
        this.form.question = row.question;
        this.form.answer = row.answer;
        this.dialogFormVisible = true;
      }, deleteSelection() {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let list = [];
          this.multipleSelection.forEach((value, index) => list[index] = value.id);
          list = JSON.stringify(list);
          if (this.multipleSelection.length !== 0) {

            let result = await reqspiderdelete(list);
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: "删除了" + result.data + "条数据"
              });
              this.getList();
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }


          }
        });
      }, answerChanged(form) {
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            let answer = {
              id: this.form.id,
              question: this.form.question,
              answer: this.form.answer
            };
            let json = JSON.stringify(answer);

            this.dialogFormVisible = false;
            let result = await reqspidermodify(json);
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
      }, spiderRun() {
        this.dialogSpiderVisible = true;
      }, dataMerge() {
        this.$confirm('确定要合并所选数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let list = [];
          this.multipleSelection.forEach((value, index) => list[index] = value.id);
          list = JSON.stringify(list);
          if (this.multipleSelection !== 0) {
            let result = await reqspidermerge(list);
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: "合并了" + result.data + "条数据"
              });
              this.getList();
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }

          }
        });
      },
      startSpider(form) {
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            let url = this.spider.url;
            this.dialogSpiderVisible = false;
            let result = await reqstartSpider(this.spider.thread, this.spider.time, {url});
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: "请求成功"
              });
              this.getList();
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }


          }
        })
      }, dataMergeAll() {
        this.$confirm('此操作将删除爬虫数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true;

          let result = await reqspidermergeAll();
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "合并了" + result.data + "条数据"
            });
            this.getList();
          } else {
            this.$message.error('出错了！' + result.code + ":" + result.data);
          }
          this.loading = false;
        });
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
