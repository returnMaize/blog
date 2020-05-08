<template>
  <div
    class="home-blog py-30"
    style="background-color: rgb(242,242,242); color:#5a6962"
  >
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="blog-wrapper d-flex">
          <div class="left-nav text-14">
            <ul class="bg-white d-inline-block py-10 border-radius-10">
              <li
                style="min-width: 160px"
                class="text-center py-10 cursor-pointer noselect"
                v-for="(item, index) of categoryList"
                :key="item._id"
                :class="{ 'text-primary': index === activeIndex }"
                @click="selectCategoryBlog(item._id, index)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>

          <div
            class="right-blog pl-40 flex-grow-1"
            v-show="
              $route.path === '/' ||
                $route.path === '/blog/5eb3b9431cd56e19cc5b0fb7'
            "
          >
            <ul>
              <li
                class="bg-white mb-20 cursor-pointer noselect d-flex border-radius-10"
                style="overflow:hidden"
                v-for="blog of blogList"
                :key="blog._id"
                @click="toBlogDetail(blog._id)"
              >
                <div class="img">
                  <img :src="blog.imgUrl" width="200" />
                </div>
                <div class="blog-info px-20 d-flex flex-wrap ac-around py-10">
                  <h3 style="width: 100%">{{ blog.title }}</h3>
                  <p style="width: 100%" class="text-14">
                    {{ blog.introduction }}
                  </p>
                  <span class="text-14">作者：function</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- 博客详情 -->
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '5eb3b9431cd56e19cc5b0fb7',
    },
  },
  data() {
    return {
      categoryList: [],
      activeIndex: 0,
      blogList: [],
    }
  },
  created() {
    this.fetchCategoryList()
    this.fetchBlogList()
  },
  methods: {
    async fetchCategoryList() {
      const res = await this.$http.get(`categories/${this.id}`)
      this.categoryList = res.data
      this.categoryList.unshift({ _id: '', name: '全部' })
    },
    async fetchBlogList(id = '') {
      const res = await this.$http.get(`blogs/${id}`)
      this.blogList = res.data
    },
    selectCategoryBlog(id, index) {
      this.$router.push('/blog/5eb3b9431cd56e19cc5b0fb7')
      this.activeIndex = index
      this.fetchBlogList(id)
    },
    toBlogDetail(id) {
      this.$router.push({ name: 'HomeBlogDetail', params: { blogid: id } })
    },
  },
}
</script>

<style scoped>
.left-nav ul li:hover {
  background-color: rgb(246, 246, 246);
}
</style>
