<template>
  <div class="actors">
    <h1>Look at your choices of actors!</h1>

    <h4>Upload an actor:  <router-link to="/upload">Upload</router-link></h4>

    <section class="cast-gallery">
      <div class="cast" v-for="item in items" :key="item.id">
        <img :src="item.path" />
        <h2>{{item.name}}</h2>
        <p v-if="item.age">{{ item.age }} years old</p>
        <p> {{item.height}} </p>
        <p> {{item.nationality}} </p>
      </div>
    </section>
  </div>
</template>

<script>


import axios from 'axios';
export default {
    name: 'ActorsView',
    data() {
        return {
          items: [],
        }
    },
    computed: {
    },
    created() {
        this.getItems();
    },
    methods: {
        async getItems() {
          try {
              let repsonse = await axios.get("/api/items");
              this.items = repsonse.data;
              this.searchItems = this.items;
          } catch(error) {
              console.log(error);
          }
        },
    },
}
</script>

<style scoped>
  .cast {
    margin: 10px;
  }
  .cast img {
    max-width: 166px;
    object-fit: cover;
    height: 200px;
  }

  .cast h2 {
      margin: 5px;
  }

  .cast-gallery {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
</style>