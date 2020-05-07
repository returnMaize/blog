<template>
  <div class="admin-main">
    <el-container style="height:100vh; width:100vw">
      <el-container>
        <!-- aside -->
        <el-aside>
          <el-menu router
            style="height:100%"
            :default-openeds="['author', 'category', 'bg', 'music']"
            :default-active="$route.path">
            <el-submenu index="author">
              <template slot="title">作者管理</template>
              <el-menu-item index="/author/create">创建作者</el-menu-item>
              <el-menu-item index="/author/list">作者列表</el-menu-item>
            </el-submenu>

            <el-submenu index="category">
              <template slot="title">分类管理</template>
              <el-menu-item index="/category/create">创建分类</el-menu-item>
              <el-menu-item index="/category/list">分类列表</el-menu-item>
            </el-submenu>

            <el-submenu index="bg">
              <template slot="title">背景图片管理</template>
              <el-menu-item index="/bg/add">添加背景图片</el-menu-item>
              <el-menu-item index="/bg/list">背景图片列表</el-menu-item>
            </el-submenu>

            <el-submenu index="music">
              <template slot="title">音乐管理</template>
              <el-menu-item index="/music/add">添加音乐</el-menu-item>
              <el-menu-item index="/music/list">音乐列表</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- aside end -->

        <!-- main -->
        <el-main>
          <keep-alive :include="['music-search', 'music-add']">
            <router-view></router-view>
          </keep-alive>
        </el-main>
        <!-- main end -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
header {
  padding: 0;
}
</style>
