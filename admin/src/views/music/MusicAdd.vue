<template>
  <div class="author-create">
    <h1>{{ genTitle }}</h1>
    <el-form class="pt-30"
      label-width="100px">
      <el-form-item label="音乐名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="音乐地址">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="音乐图片">
        <el-input v-model="formData.imgUrl"></el-input>
      </el-form-item>
      <el-form-item label="歌手">
        <el-input v-model="formData.singer"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          @click="submitFormData">{{
          genButtonText
        }}</el-button>

      </el-form-item>

      <h3 class="pt-30">音乐在线查询</h3>
      <el-form class="pt-30"
        label-width="100px">
        <el-form-item label="音乐名称">
          <el-input v-model="keyword"
            @keydown.native.enter="fetchSong"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="fetchSong"
            :loading="loading">搜索</el-button>
          <el-button type="primary"
            @click="clearAll">清空</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </div>
</template>

<script>
import { musicHttp } from "../../api/http";

export default {
  name: "music-add",

  props: {
    id: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      formData: {},
      keyword: "",
      loading: false
    };
  },

  computed: {
    genTitle() {
      return this.id ? "编辑音乐" : "添加音乐";
    },
    genButtonText() {
      return this.id ? "编辑" : "添加";
    }
  },
  created() {
    this.id && this.fetchEditFormData();
  },

  methods: {
    submitFormData() {
      this.id ? this.musicEdit() : this.musicAdd();
    },
    async musicAdd() {
      const res = await this.$http.post("/musics", this.formData);
      if (res.status === 200) {
        this.$router.push("/music/list");
        this.$message.success(`创建音乐${this.formData.name}成功`);
      }
    },
    async musicEdit() {
      const res = await this.$http.put(`/musics/${this.id}`, this.formData);
      if (res.status === 200) {
        this.$router.push("/music/list");
        this.$message.success(`编辑音乐${this.formData.name}成功`);
      }
    },
    async fetchEditFormData() {
      const res = await this.$http.get(`/musics/${this.id}`);
      if (res.status === 200) {
        this.formData = res.data;
      }
    },
    async fetchSong() {
      this.loading = true;
      const res = await musicHttp.get("/search", {
        params: {
          key: this.keyword,
          pageNo: 1,
          pageSize: 1
        }
      });
      const { songmid, songname: name, singer } = res.data.data.list[0];
      const songUrlRes = await musicHttp.get("/song/urls", {
        params: { id: songmid }
      });
      const imgUrlRes = await musicHttp.get("/song", {
        params: { songmid }
      });
      const url = songUrlRes.data.data[songmid];
      const imgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${imgUrlRes.data.data.track_info.album.mid}.jpg`;
      this.formData = {
        name,
        url,
        imgUrl,
        singer: singer.map(singer => singer.name).join("/")
      };
      this.loading = false;
    },
    clearAll() {
      this.keyword = "";
      this.formData = {};
    }
  }
};
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
