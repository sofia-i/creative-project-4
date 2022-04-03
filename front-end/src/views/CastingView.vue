<template>
<div class="casting">
    <h1>Assign an actor to the cast of your movie!</h1>
    <p>Select your Movie</p>
    <div class="form">
      <input v-model="findMovieName" id="mvSuggestionsInput" placeholder="Search" onClick="getElementById('mvSuggestions').style.display = 'inline'">
      <div class="suggestions" id="mvSuggestions" v-if="movieSuggestions.length > 0">
        <div class="suggestion" v-for="m in movieSuggestions" :key="m.id" @click="selectMovie(m)">{{m.moviename}}
        </div>
      </div>
    </div>

    <p>Select an Actor</p>
    <div class="form">
      <input v-model="findName" id="actorSuggestionsInput" placeholder="Search" onClick="getElementById('actorSuggestions').style.display = 'inline'">
      <div class="suggestions" id="actorSuggestions" v-if="suggestions.length > 0" >
        <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">{{s.name}}
        </div>
      </div>
    </div>

    <h2>Your Selection:</h2>
    <div v-if="findActor != null && findMovie != null">
        <p> {{findActor.name}} & {{findMovie.moviename}}</p>
        <h4> What role is {{findActor.name}} playing? </h4>
        <div class="add">
            <div class="form">
                <input v-model="characterName" placeholder="Character Name">
                <button @click="submit">Submit</button>
            </div>
            <div class="upload" v-if="addCasting">
                <h2>{{addCasting.moviename}}</h2>
                <div v-for="actor in addCasting.castmembers" :key="actor.id">
                    {{actor.name}} playing {{actor.charactername}}
                </div>
            </div>
        </div>
    </div>
    <div v-else>
      <p><small>(Select and actor and a movie to see them appear here)</small></p>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'CastingView',
    data() {
        return {
          items: [],
          movies: [],
          searchItems: [],
          characterName: "",
          findName: "",
          findMovieName: "",
          findActor: null, 
          findMovie: null,
          addCasting: null,
        }
    },
    computed: {
      suggestions() {
        let queryInLowerCase = this.findName.toLowerCase();
        let items = this.items;

        //console.log(items);
        let searchItems = items.filter(function(i) {
          return i.name.toLowerCase().startsWith(queryInLowerCase);
        });
        return searchItems.sort((a,b) => a.name > b.name);
      },
      movieSuggestions() {
        let movies = this.movies;
        console.log(movies);
        let queryInLowerCase = this.findMovieName.toLowerCase();
        let searchItems = movies.filter(function(m) {
          return m.moviename.toLowerCase().startsWith(queryInLowerCase);
        });
        return searchItems.sort((a,b) => a.name > b.name);
      },
    },
    created() {
        this.getItems();
        this.getMovies();
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
        selectItem(item) {
          this.findName= item.name;
          this.findActor = item;
        },
        selectMovie(movie) {
          this.findMovieName= movie.moviename;
          this.findMovie = movie;
        },
        async getMovies() {
          try {
            let response = await axios.get("/api/castlists");
            this.movies = response.data;
          } catch(error) {
            console.log(error);
          }
        },
        async submit() {
            try {
                let r1 = await axios.post('/api/casting', {
                    moviename: this.findMovie.moviename,
                    actorname: this.findActor.name,
                    actorpath: this.findActor.path,
                    charactername: this.characterName,
                });
                this.addCasting = r1.data;
                console.log("casting");
                console.log(this.addCasting);
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>   

<style scoped>
    h2 {
        margin: 10px;
    }
    .cast {
        max-width: 20%;
        margin: 10px;
    }
    .cast img {
        max-width: 100%;
        object-fit: cover;
        height: 200px;
    }

    .cast h2 {
        min-height: 66px;
        margin: 5px;
    }

    .cast-gallery {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    /* Suggestions */
    .suggestions {
        width: 200px;
        border: 1px solid #ccc;
        margin: 0 auto;
        display: none;
    }

    .suggestion {
        min-height: 20px;
        max-width: 30%;
        margin: 0 auto;
    }

    .suggestion:hover {
        background-color: #5BDEFF;
        color: #fff;
    }
</style>