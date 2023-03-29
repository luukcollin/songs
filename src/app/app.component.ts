import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Column, Song } from "../models/table-models"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {


  title = 'app';

  songs: Song[] = [];
  dbSongs: Song[] = [];
  visibleSongs: Song[] = [];
  newArtist = "";
  newTitle = "";

  filterq = "";
  songProperties: Column[] = [{ key: 'id', label: "ID" }, { key: 'artist', label: "Artist" }, { key: 'title', label: "Title" }, { key: 'genre', label: 'Genre' }, { key: 'starred', label: 'Starred' }, { key: 'created', label: 'Added' }]
  genreOptions = ["Any", "Classic", "Rock", "Classic Rock"]
  newGenre = this.genreOptions[0];
  selectedSong: Song | undefined = undefined;
  dbSelectedSong: Song | undefined = undefined;

  async ngOnInit() {
    await this.refreshEntries();
    this.visibleSongs = this.dbSongs;
  }

  async refreshEntries() {
    const response = await this.getSongsFromDb();
    const data = await response.json();
    const updatedSongs = [];
    for (const song of data) {
      updatedSongs.push(song as Song);
    }
    console.log("All songs: ", updatedSongs)
    this.dbSongs = updatedSongs;
    this.updateVisibleSongs();
  }
  async getSongsFromDb() {
    return fetch("http://localhost:8080/all");
  }

  async addSong() {
    const newSong = { title: this.newArtist, artist: this.newTitle, created: Date.now(), genre: this.newGenre, starred: 0 };
    console.warn("i am adding a new song: ", newSong)
    fetch("http://localhost:8080/add", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSong)
    }).then(() => {
      this.refreshEntries();

    })
  }

  async deleteSongById(id: number) {
    let url = 'http://localhost:8080/delete?' + new URLSearchParams({ id: id.toString() });
    return fetch(url, { method: 'DELETE' }).then(() => {
      this.refreshEntries();
    });
  };

  async setFavorite(id: number, value: boolean) {
    let url = 'http://localhost:8080/put?' + new URLSearchParams({ id: id.toString(), starred: value.toString() });
    return fetch(url, { method: 'PUT' },).then(() => {
      this.refreshEntries();
    });
  }

  removeSongWithId($event: number) {
    this.deleteSongById($event)
  }

  changeDBSongSelection(event: Song) {
    this.dbSelectedSong = event;
  }

  starSong($event: Song) {
    this.setFavorite($event.id, !$event.starred)
  }

  newSongValuesArePresent() {
    return this.newArtist.length && this.newTitle.length && this.newGenre.length;
  }

  updateVisibleSongs() {
    this.visibleSongs = this.filterq.length ? this.getFilteredSongs() : this.dbSongs;
  }

  getFilteredSongs() {
    return this.dbSongs.filter(song => song.artist.startsWith(this.filterq));
  }



}

