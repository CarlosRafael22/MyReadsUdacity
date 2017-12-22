import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchPage from './SearchPage.js'
import Book from './Book.js'
import { SyncLoader } from 'react-spinners'
import { Link } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  constructor(props){
    super(props);

    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: [],
      loadingRequest: true
    }
  }

  _gettingBookFromShelf(id, currentShelf, finalShelf){
    let book = this.props[currentShelf].find((book) => book.id == id);
    console.log(book);
    this.props.moveBookShelves(id, book, currentShelf, finalShelf);
  }

  render() {

    console.log("MOSTRANDO O PROPS DO BooksApp");
    console.log(this.props);

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
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
          {/*<a onClick={this.props.changePageState}>Add a book</a>*/}
        </div>
      </div>
    )
  }
}

export default BooksApp
