<template>
  <div class="home-blog py-30"
    style="background-color: rgb(242,242,242); color: #5a6962">
    <el-row>
      <el-col :span="16"
        :offset="4">
        <div class="blog-wrapper d-flex">
          <div class="left-nav text-14">
            <ul class="bg-white d-inline-block py-10">
              <li style="min-width: 160px"
                class="text-center py-10 cursor-pointer noselect"
                v-for="(item, index) of categoryList"
                :key="item._id"
                :class="{ 'text-primary': index === activeIndex }"
                @click="selectCategoryBlog(item._id, index)">
                {{ item.name }}
              </li>
            </ul>
          </div>

          <div class="right-blog px-40 flex-grow-1">
            <ul>
              <li class="d-flex flex-wrap bg-white px-20 py-20 mb-20"
                v-for="blog of blogList"
                :key="blog._id">
                <h5 class="title w100 py-10">{{ blog.title }}</h5>
                <span class="content"
                  ref="content"></span>
              </li>
            </ul>
          </div>
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
      default: "5eb3b9431cd56e19cc5b0fb7"
    }
  },
  data() {
    return {
      categoryList: [],
      activeIndex: 0,
      blogList: []
    };
  },
  created() {
    this.fetchCategoryList();
    this.fetchBlogList();
  },
  methods: {
    async fetchCategoryList() {
      const res = await this.$http.get(`categories/${this.id}`);
      this.categoryList = res.data;
      this.categoryList.unshift({ _id: "", name: "全部" });
    },
    async fetchBlogList(id = "") {
      const res = await this.$http.get(`blogs/${id}`);
      this.blogList = res.data;
      this.$nextTick(() => {
        this.blogList.forEach((item, index) => {
          this.$refs.content.forEach((el, elIndex) => {
            if (elIndex === index) {
              el.innerHTML = item.content;
            }
          });
        });
      });
    },
    selectCategoryBlog(id, index) {
      this.activeIndex = index;
      this.fetchBlogList(id);
    }
  }
};
</script>

<style scoped>
.left-nav ul li:hover {
  background-color: rgb(246, 246, 246);
}
</style>
