<template>
<div class="uploadAndEdit">
    <h1>Upload</h1>
    <div class="upload">
        <div class="uploadItem">
            <h2>Upload Actors</h2>
            <div class="add">
                <div class="form">
                    <input v-model="name" placeholder="Actor Name">
                    <p/>
                    <input type="file" name="photo" @change="fileChanged">
                    <p/>
                    <button @click="upload">Upload</button>
                </div>
                <div class="upload" v-if="addItem">
                    <h2>{{addItem.title}}</h2>
                    <img :src="addItem.path" />
                </div>
            </div>
        </div>

        <div class="uploadItem">
            <h2>Create a Cast</h2>
            <div class="addcast">
                <div class="form">
                    <input v-model="castname" placeholder="Movie Name">
                    <p/>
                    <button @click="uploadcast">Upload</button>
                </div>
                <div class="uploadcast" v-if="addCast">
                    <h2>"{{addCast.moviename}}"</h2>
                </div>
            </div>
        </div>
    </div>
    <h1>Edit</h1>
    <div class="edit">
        <h2>Edit Actor</h2>
        <div class="form">
            <input v-model="findName" id="actorSuggestionsInput" placeholder="Search" onClick="getElementById('actorSuggestions').style.display = 'inline'">
            <div class="suggestions" id="actorSuggestions" v-if="suggestions.length > 0" >
                <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">
                    {{s.name}}
                </div>
            </div>
        </div>
        <div class="editItem" v-if="findActor">
            <input v-model="findActor.name">
            <p></p>
            <img :src="findActor.path" />
        </div>
        <div class="actions" v-if="findActor">
            <button @click="deleteItem(findActor)">Delete</button>
            <button @click="editItem(findActor)">Edit</button>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'UploadView',
    data() {
        return {
            name: "",
            file: null,
            addItem: null,
            castname: "",
            addCast: null,

            items: [],
            movies: [],

            findName: "",
            findMovieName: "",
            findActor: null,
            findCast: null,
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
          } catch(error) {
              console.log(error);
          }
        },
        async getMovies() {
          try {
            let response = await axios.get("/api/castlists");
            this.movies = response.data;
          } catch(error) {
            console.log(error);
          }
        },
        fileChanged(event) {
            this.file = event.target.files[0]
        },
        async upload() {
            try {
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name)
                let r1 = await axios.post('/api/photos', formData);
                if(this.name === "") {
                    this.name = "untitled";
                }
                let r2 = await axios.post('/api/items', {
                name: this.name,
                path: r1.data.path
                });
                this.addItem = r2.data;
            } catch (error) {
                console.log(error);
            }
        },
        async uploadcast() {
            try {
                let r1 = await axios.post('/api/castlists', {
                name: this.castname,
                });
                this.addCast = r1.data;
            } catch (error) {
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
        async editItem(item) {
            try {
                await axios.put("/api/items/" + item._id, {
                name: this.findItem.name,
                });
                this.findItem = null;
                this.getItems();
                return true;
            } catch(error) {
                //console.log(error);
            }
        },
        async deleteItem(item) {
            try {
                await axios.delete("/api/items/" + item._id);
                this.findItem = null;
                this.getItems();
                return true;
            } catch(error) {
                //console.log(error);
            }
        },
    },
}
</script>

<style scoped>
    img {
        max-width: 200px;
    }
    .upload {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: top;
    }

    #actorSuggestions {
        display: none;
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