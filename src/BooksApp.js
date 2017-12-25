import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchPage from './SearchPage.js'
import Book from './Book.js'
import { SyncLoader } from 'react-spinners'
import { Link } from 'react-router-dom'

class BooksApp extends React.Component {

  constructor(props){
    super(props);
  }

  _gettingBookFromShelf(id, currentShelf, finalShelf){
    let book = this.props[currentShelf].find((book) => book.id == id);
    console.log(book);
    this.props.moveBookShelves(id, book, currentShelf, finalShelf);
  }

  render() {

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            {
              this.props.bookChangedShelf ?
              (                
                <div className="alert alert-success visible" role="alert">Livro transferido de prateleira com sucesso.</div>
              )
              :
              null
            }
            
            <div className="bookshelf">
              <h2 className="bookshelf-title">Currently Reading</h2>
              <div className="bookshelf-books">
              {
                this.props.loadingRequest ? 
                (
                  <div>
                  <SyncLoader loading={true} />
                  <p>Carregando sua prateleira</p>
                  </div>
                )
                :
                (
                  <ol className="books-grid">
                  {this.props.currentlyReading.map((book) => {
                    return (
                        <li key={book.id}>
                          <Book book_title={book.title} book_authors={book.authors.join(" , ")} book_id={book.id}
                          book_cover={book.imageLinks.thumbnail} book_shelf="currentlyReading" changeShelves={this._gettingBookFromShelf.bind(this)} />
                        </li>
                    );
                  })}
                  
                </ol>
                )
              }                    
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                {
                this.props.loadingRequest ? 
                (
                  <div>
                  <SyncLoader loading={true} />
                  <p>Carregando sua prateleira</p>
                  </div>
                )
                :
                (
                  <ol className="books-grid">
                  {this.props.wantToRead.map((book) => {
                    console.log(book);
                    return (
                        <li key={book.id}>
                          <Book book_title={book.title} book_authors={book.authors.join(" , ")} book_id={book.id}
                          book_cover={book.imageLinks.thumbnail} book_shelf="wantToRead" changeShelves={this._gettingBookFromShelf.bind(this)} />
                        </li>
                    );
                  })}
                  
                </ol>
                )
                }
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                {
                this.props.loadingRequest ? 
                (
                  <div>
                  <SyncLoader loading={true} />
                  <p>Carregando sua prateleira</p>
                  </div>
                )
                :
                (
                  <ol className="books-grid">
                  {this.props.read.map((book) => {
                    return (
                        <li key={book.id}>
                          <Book book_title={book.title} book_authors={book.authors.join(" , ")} book_id={book.id}
                          book_cover={book.imageLinks.thumbnail} book_shelf="read" changeShelves={this._gettingBookFromShelf.bind(this)} />
                        </li>
                    );
                  })}
                  
                </ol>
                )
                }
              </div>
            </div>
          </div>
        </div>
        <div className="open-search">
          <Link to="/add-book">Add a book</Link>
        </div>
      </div>
    )
  }
}

export default BooksApp
