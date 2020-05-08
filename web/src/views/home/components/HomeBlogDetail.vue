<template>
  <div class="blog-detail bg-white border-radius-10 ml-40 flex-grow-1">
    <div class="ql-container ql-bubble">
      <div class="ql-editor" v-html="blog.content"></div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

export default {
  props: {
    blogid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      blog: {},
    }
  },
  created() {
    this.fetchBlogList()
  },
  methods: {
    async fetchBlogList() {
      const res = await this.$http.get(`/blogs`)
      this.blog = res.data.find((blog) => blog._id === this.blogid)
    },
  },
}
</script>
