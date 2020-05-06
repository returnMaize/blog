<template>
  <div class="category-create">
    <category-form
      :title="genTitle"
      :button-text="genButtonText"
      :edit-form-data="category"
      @submit-form="submitFormHandler"
    />
  </div>
</template>

<script>
import CategoryForm from './components/CategoryForm'

export default {
  components: {
    CategoryForm,
  },

  props: {
    id: {
      type: String,
      defualt: '',
    },
  },

  data() {
    return {
      category: null,
    }
  },

  computed: {
    genTitle() {
      return this.id ? '编辑分类' : '创建分类'
    },
    genButtonText() {
      return this.id ? '编辑' : '创建'
    },
  },

  created() {
    this.id && this.fetchCategory()
  },

  methods: {
    async categoryCreate(formData) {
      const result = await this.$http.post('/categories', formData)
      if (result.status === 200) {
        this.$message.success(`创建${formData.name}分类成功`)
        this.$router.push('/category/list')
      }
    },
    async categoryEdit(formData) {
      const result = await this.$http.put(`/categories/${this.id}`, formData)
      if (result.status === 200) {
        this.$message.success(`编辑${formData.name}分类成功`)
        this.$router.push('/category/list')
      }
    },
    async fetchCategory() {
      const res = await this.$http.get(`categories/${this.id}`)
      if (res.status === 200) {
        this.category = res.data
      }
    },
    submitFormHandler(formData) {
      this.id ? this.categoryEdit(formData) : this.categoryCreate(formData)
    },
  },
}
</script>
