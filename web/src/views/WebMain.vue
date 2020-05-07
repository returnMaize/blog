<template>
  <div class="web-main">
    <el-header class="text-default bg-black px-0">
      <el-row>
        <el-col :span="16"
          :offset="4"
          style="height: 60px"
          class="d-flex ai-center jc-between">
          <div class="author d-flex ai-center cursor-pointer noselect"
            @click="$router.push('/')">
            <img :src="author.avatar"
              width="40"
              class="border-radius-4" />
            <span class="pl-10">{{ author.name }}</span>
          </div>

          <!-- music -->
          <div class="music d-flex ai-center">
            <div class="left pr-20">
              <img :src="currentSong.imgUrl"
                width="40"
                class="border-radius-20"
                :class="{ 'img-rotate': isPlay }">
            </div>
            <div class="right d-flex flex-wrap ac-between"
              style="width: 150px; height: 38px">
              <div class="song-name text-14"
                style="width: 100%">{{ currentSong.name }}</div>
              <div class="play-controll d-flex jc-between cursor-pointer noselect"
                style="width: 60%">
                <div class="iconfont"
                  @click="lastSong">&#xe636;</div>
                <div class="iconfont"
                  @click="isPlay = !isPlay">
                  {{ isPlay ? '&#xe776;' : '&#xe607;' }}
                </div>
                <div class="iconfont"
                  @click="nextSong">&#xe637;</div>
              </div>
            </div>
            <div class="iconfont cursor-pointer noselect"
              @click="playListDrawer = true"
              style="font-size: 20px">&#xe608;</div>

            <audio ref="audio"
              :src="currentSong.url"
              @ended="nextSong"></audio>

            <el-drawer title="我是标题"
              :visible.sync="playListDrawer"
              :with-header="false"
              size="400px">
              <el-table :data="songList"
                style="width: 100%"
                class="noselect cursor-pointer"
                @row-click="selectPlay">
                <el-table-column prop="name"
                  label="歌曲名"
                  width="180">
                </el-table-column>
                <el-table-column prop="singer"
                  label="歌手"
                  width="180">
                </el-table-column>
              </el-table>
            </el-drawer>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      author: {},
      songList: [],
      currentSongIndex: 0,
      isPlay: false,
      playListDrawer: false
    };
  },
  computed: {
    currentSong() {
      return this.songList[this.currentSongIndex] || {};
    }
  },
  watch: {
    isPlay() {
      this.isPlay ? this.play() : this.pause();
    },
    currentSong(newCurrentSong, oldCurrentSong) {
      if (oldCurrentSong.url) {
        this.isPlay = true;
      }
    }
  },
  created() {
    this.fetchAuthor();
    this.fetchSong();
  },
  methods: {
    async fetchAuthor() {
      const res = await this.$http.get("/authors");
      if (res.status === 200) {
        this.author = res.data[0];
      }
    },
    async fetchSong() {
      const res = await this.$http.get("/musics");
      if (res.status === 200) {
        this.songList = res.data;
      }
    },
    play() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    pause() {
      this.$refs.audio.pause();
    },
    lastSong() {
      this.isPlay = false;
      if (this.currentSongIndex) {
        this.currentSongIndex--;
      } else {
        this.currentSongIndex = this.songList.length - 1;
      }
    },
    nextSong() {
      this.isPlay = false;
      if (this.currentSongIndex === this.songList.length - 1) {
        this.currentSongIndex = 0;
      } else {
        this.currentSongIndex++;
      }
    },
    selectPlay(song) {
      this.isPlay = false;
      this.currentSongIndex = this.songList.findIndex(
        item => item._id === song._id
      );
      this.playListDrawer = false;
    }
  }
};
</script>

<style scoped>
@keyframes imgrotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.img-rotate {
  animation: imgrotate 20s linear infinite;
}
.song-list li:hover {
  background-color: #ccc;
}
</style>
