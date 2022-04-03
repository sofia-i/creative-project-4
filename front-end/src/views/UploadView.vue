<template>
<div class="uploadAndEdit">
    <h1>Upload</h1>
    <div class="upload">
        <div class="uploadItem">
            <h2>Upload Actors</h2>
            <div class="add">
                <div class="form">
                    <input v-model="name" placeholder="Name">
                    <p/>
                    <input v-model="age" placeholder="Age">
                    <p/>
                    <input v-model="nationality" placeholder="Nationality">
                    <p/>
                    <input v-model="height" placeholder="Height">
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
            <h2>Create a Movie to Cast</h2>
            <div class="addcast">
                <div class="form">
                    <input v-model="castname" placeholder="Movie Title">
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
        <div class="editActor">
            <h2>Edit Actor</h2>
            <div class="form">
                <input autocomplete="off" v-model="findName" id="actorSuggestionsInput" placeholder="Search" onClick="getElementById('actorSuggestions').style.display = 'block'">
                <div class="suggestions" id="actorSuggestions" v-if="suggestions.length > 0" >
                    <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">
                        {{s.name}}
                    </div>
                </div>
            </div>
            <div class="editItem" v-if="findActor">
                Modified name: <input autocomplete="off" v-model="findActor.name">
                <p/>
                Modified age: <input autocomplete="off" v-model="findActor.age">
                <p/>
                Modified height: <input autocomplete="off" v-model="findActor.height">
                <p/>
                Modified nationality: <input autocomplete="off" v-model="findActor.nationality">
                <p></p>
                <img :src="findActor.path" />
            </div>
            <div class="actions" v-if="findActor">
                <button @click="editItem(findActor)">Edit</button>
                <button @click="deleteItem(findActor)">Delete</button>
            </div>
        </div>
        <div class="editMovie">
            <h2>Edit Movie</h2>
            <div class="form">
                <input autocomplete="off" v-model="findMovieName" id="mvSuggestionsInput" placeholder="Search" onClick="getElementById('mvSuggestions').style.display = 'block'">
                <div class="suggestions" id="mvSuggestions" v-if="movieSuggestions.length > 0" >
                    <div class="suggestion" v-for="m in movieSuggestions" :key="m.id" @click="selectMovie(m)">
                        {{m.moviename}}
                    </div>
                </div>
            </div>
            <div class="movieEdits">
                <div class="changeTitle movieEdit" v-if="findCast">
                    <h3>Edit Title</h3>
                    Modified movie title: <input autocomplete="off" v-model="findCast.moviename">
                    <p></p>
                    <div class="actions" v-if="findCast">
                        <button @click="editCast(findCast)">Edit Movie</button>
                        <button @click="deleteCast(findCast)">Delete Movie</button>
                    </div>
                </div>
                <div class="changeCasting movieEdit" v-if="findCast">
                    <h3>Delete a Casting</h3>
                    <div class="characters">
                        <div class="character" v-for="(castmember,index) in findCast.castmembers" :key="castmember.id">
                            <p> {{castmember.name}} playing <strong>{{findCast.roles.at(index)}}</strong></p>
                            <p/>
                            <img :src="castmember.path" />
                             <div class="actions" v-if="findCast">
                                <button @click="deleteCasting(castmember.name, findCast.roles.at(index))">Delete Casting</button>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
            
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
            age: "",
            height: "",
            nationality: "",
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
            roles: [],
            charSuggestions: [],
        }
    },
    computed: {
        suggestions() {
            let queryInLowerCase = this.findName.toLowerCase();
            let items = this.items;

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
            let response = await axios.get("/api/cast");
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
                    age: parseInt(this.age),
                    height: this.height,
                    nationality: this.nationality,
                    path: r1.data.path
                });
                this.addItem = r2.data;
            } catch (error) {
                console.log(error);
            }
        },
        async uploadcast() {
            try {
                let r1 = await axios.post('/api/cast', {
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
          this.findCast = movie;
          this.selectRoles(movie);
        },
        selectRoles(cast) {
            this.roles = cast.roles;
        },
        async editItem(item) {
            try {
                await axios.put("/api/items/" + item._id, {
                    name: this.findActor.name,
                    age: this.findActor.age,
                    height: this.findActor.height,
                    nationality: this.findActor.nationality,
                });
                this.findActor = null;
                this.findName = "";
                this.getItems();
                return true;
            } catch(error) {
                console.log(error);
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
        async editCast(cast) {
            try {
                await axios.put("/api/cast/" + cast._id, {
                    moviename: this.findCast.moviename,
                });
                this.findCast = null;
                this.findMovieName = "";
                this.getMovies();
                return true;
            } catch(error) {
                console.log(error);
            }
        },
        async deleteCast(cast) {
            try {
                await axios.delete("/api/cast/" + cast._id);
                this.findMovieName = "";
                this.findCast = null;
                this.getMovies();
                return true;
            } catch(error) {
                //console.log(error);
            }
        },
        async deleteCasting(name, charName) {
            console.log("into delete casting");
            console.log("charName " + charName);
            try {
                await axios.delete("/api/casting/" + this.findCast._id, {
                    data: {
                        actorname: name,
                        charactername: charName,
                    }
                });
                this.findMovieName = "";
                this.findCast = null;
                this.getMovies();
                return true;
            } catch(error) {
                console.log(error);
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
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: top;
    }

    #actorSuggestions {
        display: none;
    }

    #mvSuggestions {
        display: none;
    }

    .movieEdits {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: top;
    }

    .movieEdit {
        margin: 10px;
    }
</style>