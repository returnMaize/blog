<template>
  <div class="home-nav text-14" style="color: #5a6962">
    <el-row>
      <el-col :span="16" :offset="4">
        <ul style="padding: 0px 200px" class="d-flex">
          <li
            class="py-15 px-20 cursor-pointer noselect"
            v-for="(item, index) of navList"
            :key="index"
            :class="{ 'text-primary': isActive(item, index) }"
            @click="$router.push(item.path)"
          >
            {{ item.name }}
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [],
    }
  },
  created() {
    this.fetchNavList()
  },
  methods: {
    async fetchNavList() {
      const res = await this.$http.get('/categories')
      this.navList = res.data
      this.navList[0].path = `/blog/${this.navList[0]._id}`
      this.navList[1].path = '/picture'
      this.navList[2].path = '/message/board'
      this.navList[3].path = '/about/me'
    },
    isActive(item, index) {
      if (this.$route.path === '/' && index === 0) {
        return true
      }
      if (this.$route.path === item.path) {
        return true
      }
      return false
    },
  },
}
</script>
