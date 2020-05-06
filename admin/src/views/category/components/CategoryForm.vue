<template>
  <div class="category-form">
    <h3>{{ title }}</h3>
    <el-form label-width="100px" class="pt-30">
      <el-form-item label="分类名称">
        <el-input
          v-model="formData.name"
          @keydown.native.enter="$emit('submit-form', formData)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('submit-form', formData)">{{
          buttonText
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '创建',
    },
    editFormData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      formData: {},
    }
  },

  watch: {
    editFormData() {
      this.formData = this.editFormData
    },
  },
}
</script>
