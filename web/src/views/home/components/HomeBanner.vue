<template>
  <div class="home-banner">
    <div class="banner"
      :style="{ 'background-image': `url(${bg})` }">
      <el-row style="height: 100%">
        <el-col :span="16"
          :offset="4"
          style="height: 100%">
          <div class="banner-wrapper pos-relative"
            style="height: 100%">
            <div class="title text-30 pt-30"
              style="color: white">
              欢迎来到 {{ author.name }} 的博客
            </div>

            <!-- star -->
            <div class="star pos-absolute r-0">
              <span class="iconfont">赞</span>
            </div>

            <!-- blog info -->
            <div class="blog-info pos-absolute"
              style="bottom: -24px">
              <div class=" d-flex">
                <div class="img blog-info-wrapper border-white-3 border-radius-4"
                  style="box-shadow: 1px 1px 5px #806e6e">
                  <img :src="author.avatar"
                    width="120">
                </div>
                <div class="info d-flex flex-wrap ac-around pb-30 pl-10"
                  style="color: #e2dada">
                  <div class="author text-20"
                    style="width: 100%">{{ author.name }}</div>
                  <span class="run-time text-15">博客运行时间：1天</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bg: "",
      author: {}
    };
  },
  created() {
    this.fetchBg();
    this.fetchAuthor();
  },
  methods: {
    async fetchBg() {
      const res = await this.$http.get("/bgs");
      if (res.status === 200) {
        this.bg = res.data[0].imgUrl;
      }
    },
    async fetchAuthor() {
      const res = await this.$http.get("/authors");
      if (res.status === 200) {
        this.author = res.data[0];
      }
    }
  }
};
</script>

<style scoped>
.banner {
  height: 400px;
  background-position: center;
  background-size: cover;
}
</style>