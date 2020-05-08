<template>
  <div class="blog-add">
    <el-row :gutter="20">
      <el-col :span="12">
        <h3>{{ genTitle }}</h3>
        <el-form class="pt-30">
          <el-form-item label="博客内容">
            <quill-editor v-model="formData.content"></quill-editor>
          </el-form-item>
          <el-form-item label="博客分类">
            <el-select v-model="formData.category" placeholder="请选择">
              <el-option
                v-for="item in categoryList"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="博客标题">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="博客简介">
            <el-input
              type="textarea"
              show-word-limit
              maxlength="200"
              :rows="4"
              v-model="formData.introduction"
            ></el-input>
          </el-form-item>
          <el-form-item label="博客图片">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:3000/admin/upload"
              :on-success="uploadSuccess"
              :show-file-list="false"
            >
              <img
                v-if="formData.imgUrl"
                :src="formData.imgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormData">{{
              genButtonText
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="12" v-if="formData.content">
        <h3 class="pb-20">博客预览</h3>
        <div class="ql-container ql-bubble">
          <div class="ql-editor" v-html="formData.content"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      formData: {},
      categoryList: [],
    }
  },
  computed: {
    genTitle() {
      return this.id ? '编辑博客' : '添加博客'
    },
    genButtonText() {
      return this.id ? '编辑' : '添加'
    },
  },
  created() {
    this.fetchCategoryList()
    this.id && this.fetchEditBlog()
  },
  methods: {
    async fetchCategoryList() {
      const res = await this.$http.get('/categories')
      this.categoryList = res.data
    },
    submitFormData() {
      this.id ? this.blogEdit() : this.blogAdd()
    },
    async blogEdit() {
      const res = await this.$http.put(`/blogs/${this.id}`, this.formData)
      if (res.status === 200) {
        this.$router.push('/blog/list')
        this.$message.success('编辑博客成功')
      }
    },
    async blogAdd() {
      const res = await this.$http.post('/blogs', this.formData)
      if (res.status === 200) {
        this.$router.push('/blog/list')
        this.$message.success('创建博客成功')
      }
    },
    async fetchEditBlog() {
      const res = await this.$http.get(`/blog/${this.id}`)
      this.formData = res.data
    },
    uploadSuccess(res) {
      this.$set(this.formData, 'imgUrl', res.url)
    },
  },
}
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
