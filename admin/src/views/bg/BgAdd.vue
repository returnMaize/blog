<template>
  <div class="bg-add">
    <h3>{{ genTitle }}</h3>
    <el-form class="pt-30"
      label-width="100px">
      <el-form-item label="图片上传">
        <el-upload class="avatar-uploader"
          action="http://localhost:3000/admin/upload"
          :show-file-list="false"
          :on-success="uploadSuccess">
          <img v-if="formData.imgUrl"
            :src="formData.imgUrl"
            class="avatar" />
          <i v-else
            class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          @click="submitForm">{{
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
      default: ""
    }
  },

  data() {
    return {
      formData: {}
    };
  },

  computed: {
    genTitle() {
      return this.id ? "编辑背景图片" : "添加背景图片";
    },
    genButtonText() {
      return this.id ? "编辑" : "创建";
    }
  },
  created() {
    this.id && this.fetchEditFormData();
  },

  methods: {
    uploadSuccess(res) {
      this.$set(this.formData, "imgUrl", res.url);
    },
    submitForm() {
      this.id ? this.bgEdit() : this.bgAdd();
    },
    async bgEdit() {
      const res = await this.$http.put(`/bgs/${this.id}`, this.formData);
      if (res.status === 200) {
        this.$router.push("/bg/list");
        this.$message.success("编辑图片成功");
      }
    },
    async bgAdd() {
      const res = await this.$http.post("/bgs", this.formData);
      if (res.status === 200) {
        this.$router.push("/bg/list");
        this.$message.success("图片添加成功");
      }
    },
    async fetchEditFormData() {
      const res = await this.$http.get(`/bgs/${this.id}`);
      if (res.status === 200) {
        this.formData = res.data;
      }
    }
  }
};
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
  display: block;
  max-width: 1000px;
}
</style>
