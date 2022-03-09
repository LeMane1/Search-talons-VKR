<template>
  <div id="app">
    <Header/>
    <Main/>
  </div>
</template>

<script>
import Main from './components/Main.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Main, Header
  }
}
</script>

<style>
@import "./assets/reset.css";
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&display=swap');
#app {
  font-family: 'Montserrat', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

*{
  box-sizing: border-box;
}

/*#00ac8b главный цвет сайта*/
</style>
