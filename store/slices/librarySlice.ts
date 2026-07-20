import { StateCreator } from 'zustand';
import { AppStore } from '../useAppStore';
import { Book, BookIssue, Fine } from '../../types';
import { books as initialBooks, bookIssues as initialBookIssues, fines as initialFines } from '../../data/library';

export interface LibrarySlice {
  books: Book[];
  bookIssues: BookIssue[];
  fines: Fine[];
  
  addBook: (data: Omit<Book, 'id'>) => void;
  updateBook: (id: string, data: Partial<Book>) => void;
  
  addBookIssue: (data: Omit<BookIssue, 'id'>) => void;
  updateBookIssue: (id: string, data: Partial<BookIssue>) => void;
  
  addFine: (data: Omit<Fine, 'id'>) => void;
  updateFine: (id: string, data: Partial<Fine>) => void;
}

export const createLibrarySlice: StateCreator<AppStore, [], [], LibrarySlice> = (set) => ({
  books: initialBooks,
  bookIssues: initialBookIssues,
  fines: initialFines,
  
  addBook: (data) => set((state) => ({ books: [...state.books, { ...data, id: `bk_${Date.now()}` }] })),
  updateBook: (id, data) => set((state) => ({ books: state.books.map((item: Book) => item.id === id ? { ...item, ...data } : item) })),
  
  addBookIssue: (data) => set((state) => ({ bookIssues: [...state.bookIssues, { ...data, id: `bki_${Date.now()}` }] })),
  updateBookIssue: (id, data) => set((state) => ({ bookIssues: state.bookIssues.map((item: BookIssue) => item.id === id ? { ...item, ...data } : item) })),
  
  addFine: (data) => set((state) => ({ fines: [...state.fines, { ...data, id: `fin_${Date.now()}` }] })),
  updateFine: (id, data) => set((state) => ({ fines: state.fines.map((item: Fine) => item.id === id ? { ...item, ...data } : item) })),
});
