import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchPage from './SearchPage.js'
import Book from './Book.js'
import { SyncLoader } from 'react-spinners'

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

  componentDidMount(){

      let response = BooksAPI.getAll();
      let all_books;
      this.setState({read : []});
      response.then((data) => {
        all_books = data
        console.log(all_books);

        // DISTRIBUINDO OS LIVROS RETORNADOS DO SERVIDOR DE ACORDO COM A PRATELEIRA QUE ELE INICIALMENTE PERTENCE
        let currentlyReading_books = all_books.filter((book) => {return book.shelf === "currentlyReading"});
        let wantToRead_books = all_books.filter((book) => {return book.shelf === "wantToRead"});
        let read_books = all_books.filter((book) => {return book.shelf === "read"});
        
        this.setState({currentlyReading : currentlyReading_books});
        this.setState({wantToRead : wantToRead_books});
        this.setState({read : read_books});
        this.setState({loadingRequest : false});

        // all_books.map((book) => {
        //   this.setState({book.shelf : })
        // })
        console.log(this.state);
      });
      console.log(response);
      console.log(all_books);
  }

  render() {

    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <SearchPage showSearchPage={ (searchState) => this.setState({ showSearchPage: searchState })} />
        ) : (
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
                    this.state.loadingRequest ? 
                    (
                      <div>
                      <SyncLoader loading={true} />
                      <p>Carregando sua prateleira</p>
                      </div>
                    )
                    :
                    (
                      <ol className="books-grid">
                      {this.state['currentlyReading'].map((book, index) => {
                        return (
                            <li key={index}>
                              <Book book_title={book.title} book_authors={book.authors[0]} 
                              book_cover={book.imageLinks.thumbnail} />
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
                    this.state.loadingRequest ? 
                    (
                      <div>
                      <SyncLoader loading={true} />
                      <p>Carregando sua prateleira</p>
                      </div>
                    )
                    :
                    (
                      <ol className="books-grid">
                      {this.state['read'].map((book, index) => {
                        return (
                            <li key={index}>
                              <Book book_title={book.title} book_authors={book.authors[0]} 
                              book_cover={book.imageLinks.thumbnail} />
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
                    this.state.loadingRequest ? 
                    (
                      <div>
                      <SyncLoader loading={true} />
                      <p>Carregando sua prateleira</p>
                      </div>
                    )
                    :
                    (
                      <ol className="books-grid">
                      {this.state['wantToRead'].map((book, index) => {
                        return (
                            <li key={index}>
                              <Book book_title={book.title} book_authors={book.authors[0]} 
                              book_cover={book.imageLinks.thumbnail} />
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
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
