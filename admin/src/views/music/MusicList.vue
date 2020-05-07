<template>
  <div class="music-list">
    <el-table :data="musicList">
      <el-table-column label="id"
        prop="_id"> </el-table-column>
      <el-table-column label="歌手"
        prop="singer"> </el-table-column>
      <el-table-column label="音乐名字"
        prop="name"></el-table-column>
      <el-table-column label="音乐图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl"
            width="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link class="pr-20"
            type="primary"
            :underline="false"
            @click="musicEdit(scope.row)">编辑</el-link>
          <el-link type="danger"
            :underline="false"
            @click="musicDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicList: []
    };
  },

  created() {
    this.fetchMusicList();
  },

  methods: {
    async fetchMusicList() {
      const res = await this.$http.get("/musics");
      if (res.status === 200) {
        this.musicList = res.data;
      }
    },
    musicEdit(music) {
      this.$router.push(`/music/edit/${music._id}`);
    },
    async musicDelete(music) {
      const { _id, name } = music;
      const res = await this.$http.delete(`/musics/${_id}`);
      if (res.status === 200) {
        this.fetchMusicList();
        this.$message.success(`删除音乐${name}成功`);
      }
    }
  }
};
</script>
