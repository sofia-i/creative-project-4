<template>
  <div class="home">
    <h1>Cast Your Movie</h1>
    <p><em>Upload actors and create a cast for your own personal movie!</em></p>

    <h2>Casts:</h2>
    <section class="cast-gallery">
      <div class="cast" v-for="castlist in castlists" :key="castlist.id">
        <h3>{{castlist.moviename}}</h3>
        <div class="characters">
          <div class="character" v-for="(castmember,index) in castlist.castmembers" :key="index">
            <img :src="castmember.path" />
            <p>{{castmember.name}} as {{castlist.roles.at(index)}}</p>
          </div>
        </div>
      </div>
    </section>
    <p><em>(To add more, go to <router-link to="/upload">Upload</router-link>)</em></p>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from 'axios';
export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      castlists: [],
    }
  },
  created() {
    this.getCastlists();
  },
  methods: {
    async getCastlists() {
      try {
          let repsonse = await axios.get("/api/cast");
          this.castlists = repsonse.data;
          console.log("castlists");
          console.log(this.castlists);
      } catch(error) {
          console.log(error);
      }
    },
  },
}
</script>

<style scoped>



img {
  max-width: 30%;
}

.cast {
  border: 1px solid #000;
  max-width: 1000px;
  margin: 10px auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cast p {
  width: fit-content;
}

.characters {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.character {
  margin: 10px;
}

.character img {
    max-width: 166px;
    object-fit: cover;
    height: 200px;
}

</style>

