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
          prop="openid"
          label="openid">
        </el-table-column>
        <el-table-column
          prop="num"
          label="积分">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;align-items:center;">
        <el-button type="primary" @click="changeNum()" :disabled="disable">修改选中用户积分</el-button>
        <el-button type="primary" @click="changeAll()">修改所有用户积分</el-button>
        <el-button type="primary" @click="numFormVisible=true">修改指定积分</el-button>
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
      <el-dialog title="修改积分" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref='form' :rules="answerRules">
          <el-form-item label="openid" prop="openid">
            <el-input v-model="form.openid" disabled/>
          </el-form-item>
          <el-form-item label="积分" prop="num">
            <el-input v-model.number="form.num"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyUser('form')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改积分" :visible.sync="numFormVisible">
        <el-form :model="num" ref='num' :rules="numRules">
          <el-form-item label="要修改的积分" prop="old">
            <el-input v-model.number="num.old"/>
          </el-form-item>
          <el-form-item label="修改后的积分" prop="news">
            <el-input v-model.number="num.news"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="numFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeAtoB('num')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
  import {
    reqUserList,
    reqUsermodify,
    reqUsermodifyAllnum,
    reqUsermodifynum,
    reqUsermodifyoldnew
  } from "../api";

  export default {
    name: "User",
    data() {
      let checkNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('积分不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 0) {
              callback(new Error('必须是非负整数'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        loading: false,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tableData: [],
        pageOption: [20, 30, 50, 100],
        multipleSelection: [],
        height: "530px",
        dialogFormVisible: false,
        numFormVisible: false,
        disable: true,
        form: {
          openid: "",
          num: ""
        },
        num: {
          old: "",
          news: ""
        },
        answerRules: {
          num: [
            {validator: checkNum, trigger: 'blur'}
          ]
        },
        numRules: {
          old: [
            {validator: checkNum, trigger: 'blur'}
          ], news: [
            {validator: checkNum, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async getList() {
        let search = this.search;
        let result = await reqUserList(this.currentPage, this.pageSize, {search});
        // console.log(result);
        if (result.code === 200) {
          this.total = result.data.total;
          this.tableData = result.data.records;

        } else {
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }
      },
      changeNum() {
        this.$prompt('请输入修改后的积分', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]\d*$/,
          inputErrorMessage: '积分格式不正确'
        }).then(async ({value}) => {
          if (this.multipleSelection.length !== 0) {
            let list = [];
            this.multipleSelection.forEach((value, index) => list[index] = value.openid);
            list = JSON.stringify(list);
            let result = await reqUsermodifynum(value, {list});
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: "修改了" + result.data + "条数据"
              });
              this.getList()
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }

          }
        }).catch(() => {
        });
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
        this.form.disable = true;
        this.form.openid = row.openid;
        this.form.num = row.num;
        this.dialogFormVisible = true;
      }, modifyUser(form) {//修改 添加
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            let user = {
              openid: this.form.openid,
              num: this.form.num
            };
            let json = JSON.stringify(user);
            //let url = "user/modify";
            this.dialogFormVisible = false;
            let result = await reqUsermodify(json);
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
      }, changeAll() {
        this.$prompt('请输入修改后的积分', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]\d*$/,
          inputErrorMessage: '积分格式不正确'
        }).then(async ({value}) => {
          this.loading = true;
          let result = await reqUsermodifyAllnum(value);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "修改了" + result.data + "条数据"
            });
            this.getList()
          } else {
            this.$message.error('出错了！' + result.code + ":" + result.data);
          }
          this.loading = false;
        }).catch(() => {
        });
      }, changeAtoB(form) {
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            this.numFormVisible = false;
            let result = await reqUsermodifyoldnew(this.num.old, this.num.news);
            if (result.code === 200) {
              this.$message({
                type: "success",
                message: "修改了" + result.data + "条数据"
              });
              this.getList()
            } else {
              this.$message.error('出错了！' + result.code + ":" + result.data);
            }
          }
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
