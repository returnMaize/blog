<template>
  <div class="web-home">
    <home-banner></home-banner>

    <home-nav></home-nav>

    <router-view></router-view>
  </div>
</template>

<script>
import HomeBanner from "./components/HomeBanner";
import HomeNav from "./components/HomeNav";
export default {
  components: {
    HomeBanner,
    HomeNav
  }
};
</script>