<template>
  <div class="blog-add">
    <h3>{{ genTitle }}</h3>
    <el-form class="pt-30">
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
      <el-form-item label="博客内容">
        <quill-editor v-model="formData.content"></quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFormData">{{
          genButtonText
        }}</el-button>
      </el-form-item>
    </el-form>
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
  },
}
</script>
