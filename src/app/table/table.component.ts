import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column, Song } from 'src/models/table-models';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input()
  rows: Song[] = [];

  @Input()
  columns: Column[] = [];

  @Input()
  selectedRow: Song | undefined = undefined;

  @Output()
  clickedSong = new EventEmitter<Song>();

  @Output()
  removeSong = new EventEmitter<number>();

  @Output()
  starredSong = new EventEmitter<Song>();

  private sortingConfig = { key: "id", order: "desc" }

  onRowClick(row: Song) {
    this.clickedSong.emit(row)
  }

  onHeaderClick(headerKey: string) {
    this.updateSortPreference(headerKey);


  }

  updateSortingConfig(columnKey: string) {
    this.sortingConfig.order = reverseOrder(this.sortingConfig.order);
    this.sortingConfig.key = columnKey;
  }

  getRowEntryClassName(id: number) {
    const baseClassname = "row-entry "
    return this.selectedRow?.id === id ? baseClassname + "selected" : baseClassname;
  }

  getClassForStarredColumn(starred: boolean) {
    return starred ? "starry" : "";
  }

  star(song: Song) {
    this.starredSong.emit(song)
  }

  removeRow(id: number) {
    this.removeSong.emit(id)
  }

  compareFn(a: Song, b: Song) {
    const key = this.sortingConfig.key as keyof Song;
    const orderReverse = this.sortingConfig.order === "asc" ? 1 : -1;
    const subjectA = a[key] as string;
    const subjectB = b[key] as string;
    console.group("-- CASE --")
    console.log("key: ", key)
    console.log("SubA: ", subjectA)
    console.log("SubB: ", subjectB)

    // return subjectA.localeCompare(subjectB);

    if (subjectA < subjectB) {
      console.log("1")
      console.groupEnd();
      return 1 * orderReverse;
    }
    if (subjectA > subjectB) {
      console.log("-1")
      console.groupEnd();
      return -1 * orderReverse;
    }
    return 0;
  }

  updateSortPreference(keyChange: string) {
    this.updateSortingConfig(keyChange);
    this.sort()
  }

  sort() {
    console.log(this.sortingConfig)

    this.rows = this.rows.sort((a, b) => this.compareFn(a, b));


  }

}

function reverseOrder(order: string) {
  return order === "asc" ? "desc" : "asc"

}