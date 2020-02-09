<template>
  <div style="margin: 0;padding: 0;width: 83%">
    <el-header class="head">
      <el-button type="danger" @click="cancelCourse">取消</el-button>
      <span v-text="name"/>
      <el-button type="primary" @click="saveCoursecontent">保存</el-button>
    </el-header>

    <div class="content">

        <!-- 图片上传组件辅助-->
        <el-upload
          :with-credentials='true'
          id="quill-upload"
          :action="url"
          name="img"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload">
        </el-upload>
        <!--富文本编辑器组件-->
        <el-row v-loading="quillUpdateImg">
          <quillEditor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quillEditor>
        </el-row>


    </div>
  </div>
</template>

<script>
  import global from "../api/global";
  import {quillEditor} from 'vue-quill-editor';

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {reqCoursemodify, reqgetCoursedetail} from "../api";

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction
    [{'color': []}, {'background': []}],
    [{'align': []}],
    ['link', 'image', 'video'],// dropdown with defaults from theme
    [{'font': []}],
    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    ['clean']                                         // remove formatting button
  ];
  export default {
    name: "EditCourse",
    data() {
      return {
        quillUpdateImg: false,
        id: 0,
        name: "",
        content: "",
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('#quill-upload input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        },

      }
    }, components:{
      quillEditor
    },
    methods: {
      cancelCourse() {
        this.$router.back();
      },
      async saveCoursecontent() {
        global.course.content = this.content;
        //封装成对象
        let course = {
          id: global.course.id,
          name: global.course.name,
          content: global.course.content,
        };
        //转json
       let json=JSON.stringify(course);
        let result=await reqCoursemodify(json);
        if(result.code===200){
          this.$message.success('保存成功！');
          this.$router.push({path: "/course/detail", query: {id: this.id, name: this.name}});
        }else{
          this.$message.error('出错了！' + result.code + ":" + result.data);
        }




      },
      beforeUpload() {
        // 显示loading动画
        this.quillUpdateImg = true
      },

      uploadSuccess(res) {
        // res为图片服务器返回的数据
        // 获取富文本组件实例
        let quill = this.$refs.myQuillEditor.quill;
        // 如果上传成功
        if (res.url !== null) {
          this.json_img.push(res.url);
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', res.url);
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
        // loading动画消失
        this.quillUpdateImg = false
      },

      // 富文本图片上传失败
      uploadError() {
        // loading动画消失
        this.quillUpdateImg = false;
        this.$message.error('图片插入失败')
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
