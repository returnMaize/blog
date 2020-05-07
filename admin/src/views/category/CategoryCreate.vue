<template>
  <div class="category-create">
    <h3>{{ genTitle }}</h3>
    <el-form label-width="100px"
      class="pt-30">
      <el-form-item label="上级分类">
        <el-select v-model="formData.parent"
          placeholder="请选择">
          <el-option v-for="item in categoryList"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="formData.name"
          @keydown.native.enter="submitFormHandler"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          @click="submitFormHandler">{{
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
      defualt: ""
    }
  },

  data() {
    return {
      formData: {},
      categoryList: []
    };
  },

  computed: {
    genTitle() {
      return this.id ? "编辑分类" : "创建分类";
    },
    genButtonText() {
      return this.id ? "编辑" : "创建";
    }
  },

  created() {
    this.fetchCategoryList();
    this.id && this.fetchEditCategory();
  },

  methods: {
    async categoryCreate() {
      const result = await this.$http.post("/categories", this.formData);
      if (result.status === 200) {
        this.$message.success(`创建${this.formData.name}分类成功`);
        this.$router.push("/category/list");
      }
    },
    async categoryEdit() {
      const result = await this.$http.put(
        `/categories/${this.id}`,
        this.formData
      );
      if (result.status === 200) {
        this.$message.success(`编辑${this.formData.name}分类成功`);
        this.$router.push("/category/list");
      }
    },
    async fetchEditCategory() {
      const res = await this.$http.get(`categories/${this.id}`);
      if (res.status === 200) {
        this.formData = res.data;
      }
    },
    submitFormHandler() {
      this.id ? this.categoryEdit() : this.categoryCreate();
    },
    async fetchCategoryList() {
      const res = await this.$http.get("/categories");
      this.categoryList = res.data;
    }
  }
};
</script>
