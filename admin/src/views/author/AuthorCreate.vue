<template>
  <div class="author-create">
    <h1>{{ genTitle }}</h1>
    <el-form class="pt-30" label-width="100px">
      <el-form-item label="名称">
        <el-input
          v-model="formData.name"
          @keydown.native.enter="submitFormData"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:3000/admin/upload"
          :on-success="uploadSuccess"
          :show-file-list="false"
        >
          <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      formData: {},
      imageUrl: '',
    }
  },

  computed: {
    genTitle() {
      return this.id ? '编辑作者' : '创建作者'
    },
    genButtonText() {
      return this.id ? '编辑' : '创建'
    },
  },
  created() {
    this.id && this.fetchEditFormData()
  },

  methods: {
    submitFormData() {
      this.id ? this.authorEdit() : this.authorCreate()
    },
    async authorCreate() {
      const res = await this.$http.post('/authors', this.formData)
      if (res.status === 200) {
        this.$router.push('/author/list')
        this.$message.success(`创建作者${this.formData.name}成功`)
      }
    },
    async authorEdit() {
      const res = await this.$http.put(`/authors/${this.id}`, this.formData)
      if (res.status === 200) {
        this.$router.push('/author/list')
        this.$message.success(`编辑作者${this.formData.name}成功`)
      }
    },
    async fetchEditFormData() {
      const res = await this.$http.get(`/authors/${this.id}`)
      if (res.status === 200) {
        this.formData = res.data
      }
    },
    uploadSuccess(res) {
      this.$set(this.formData, 'avatar', res.url)
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
