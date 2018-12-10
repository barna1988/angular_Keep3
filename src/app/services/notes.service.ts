import { Injectable } from '@angular/core';
import { Note } from '../note';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotesService {

  notes: Array<Note>;
  notesSubject: BehaviorSubject<Array<Note>>;

  constructor(private httpClient: HttpClient, private authSvc: AuthenticationService) {
    this.notes = [];
    this.notesSubject = new BehaviorSubject(this.notes);
  }

  fetchNotesFromServer() {

    const token = this.authSvc.getBearerToken();
    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };

    const getNoteObserver = this.httpClient.get<Array<Note>>('http://localhost:3000/api/v1/notes', httpOptions);

    getNoteObserver.subscribe(
      (noteList) => {
        this.notes = noteList;
        this.notesSubject.next(this.notes);
      },
      (err) => {
        console.log('Error in fetchNotesFromServer.', err);
      }
    );
  }

  getNotes(): BehaviorSubject<Array<Note>> {
    return this.notesSubject;
  }

  addNote(note: Note): Observable<Note> {

    const token = this.authSvc.getBearerToken();
    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };

    const addNoteObserver = this.httpClient.post<Note>('http://localhost:3000/api/v1/notes', note, httpOptions);

    return addNoteObserver.do(addedNote => {// tap ???
      this.notes.push(addedNote);
      this.notesSubject.next(this.notes);
    });
  }

  editNote(note: Note): Observable<Note> {
    const token = this.authSvc.getBearerToken();
    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };

    const addNoteObserver = this.httpClient.put<Note>(`http://localhost:3000/api/v1/notes/${note.id}`, note, httpOptions);

    return addNoteObserver.do(addedNote => {// tap ???
      this.notesSubject.next(this.notes);
    });
  }

  getNoteById(noteId): Note {
    return this.notes.find((current) => current.id === noteId);
  }
}
