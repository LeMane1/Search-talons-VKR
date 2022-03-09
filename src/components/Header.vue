<template>
  <header class="header" :class="{ active_header: activeHeader }">
    <p class="logo">Поиск талонов</p>
    <!--<p>О проекте</p>-->
  </header>
</template>

<script>
export default {
  data() {
    return {
      activeHeader: false,
      scrollPrev: 0
    };
  },
  created() {
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    handleScroll(event) {
      var scrolled = window.scrollY;
	    if ( scrolled > 200 && scrolled > this.scrollPrev ) {
		    this.activeHeader = true
	    } else {
		    this.activeHeader = false
	    }
	    this.scrollPrev = scrolled
    },
  },
};
</script>

<style>
.header {
  position: fixed;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 4px -2px rgba(20, 20, 20, 0.4);
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  padding: 30px;
  transition: all 0.2s ease-in-out;
}
.logo {
  font-size: 1.2rem;
  color: #00ac8b;
  font-weight: 600;
}

.active_header {
  transition: all 0.2s ease-in-out;
  transform: translateY(-100%);
}
</style>