<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/casting">Casting</router-link> |
      <router-link to="/actors">Actors</router-link> |
      <router-link to="/upload">Upload/Edit</router-link>
    </nav>
    <router-view/>
    <div class="footer">
      <a href="https://github.com/sofia-i/creative-project-4.git">Link to Github</a>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
