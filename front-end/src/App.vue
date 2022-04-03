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
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 {
  border: 2px solid #000;
  border-radius: 10px;
  background-color: #eee;
}

nav {
  padding: 30px;
  background-color: #FFF8E8;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #A67D25;
}

.footer {
  padding: 15px;
  margin-top: 20px;
  background-color:#e6eeff;
}

/* Suggestions */
  .suggestions {
      width: fit-content;
      margin: 0 auto;
      display: none;
      border: 1px solid #ccc;
  }

  .suggestion {
      min-height: 20px;
      width: 200px;
      margin: 0 auto;
  }

  .suggestion:hover {
      background-color: #5BDEFF;
      color: #fff;
  }
</style>
