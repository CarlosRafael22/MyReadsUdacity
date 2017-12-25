import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchPage from './SearchPage.js'
import Book from './Book.js'
import BooksApp from './BooksApp.js'
import { SyncLoader } from 'react-spinners'
import { Route } from 'react-router-dom'

class App extends React.Component {
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

    // VARIAVEL DE ESTADO bookChangedShelf QUE DAR UM ALERTA QUANDO TROCAMOS DE PRATELEIRA
    // VAMOS USA-LA PARA FAZER A TROCA DE PRATELEIRA NA UI E NAO PRECISAR ESPERAR QUE A TROCA OCORRA NO SERVIDOR PRIMEIRO

    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: [],
      loadingRequest: true,
      bookChangedShelf : false
    }
  }


  // ESSE VAI SER O CONTAINER COMPONENT ENTAO ELE VAI TER AS FUNCOES DE CONEXOES COM APIS EXTERNAS
  // ELE TAMBEM VAI LIDAR COM O GERENCIAMENTO DOS ESTADOS DAS PRATELEIRAS JA QUE OS LIVROS DAS PRATELEIRAS TEM Q
  // FICAR EM SYNC COM OS DO SEARCHPAGE
  componentDidMount(){

      let response = BooksAPI.getAll();
      let all_books;
      response.then((data) => {
        all_books = data

        // DISTRIBUINDO OS LIVROS RETORNADOS DO SERVIDOR DE ACORDO COM A PRATELEIRA QUE ELE INICIALMENTE PERTENCE
        let currentlyReading_books = all_books.filter((book) => {return book.shelf === "currentlyReading"});
        let wantToRead_books = all_books.filter((book) => {return book.shelf === "wantToRead"});
        let read_books = all_books.filter((book) => {return book.shelf === "read"});
        
        this.setState({currentlyReading : currentlyReading_books, wantToRead : wantToRead_books,
         read : read_books, loadingRequest : false});
      });
  }


  // TENTANDO FAZER COM QUE O ALERT SUMA DPS DE TER SIDO CRIADO AO MOSTRAR QUE LIVRO FOI TROCADO DE PRATELEIRA
  componentDidUpdate(prevProps, prevState){
    // TROCA STATE PARA FALSE PARA O DIV DO ALERT SER RETIRADO -> Nao consegui fazer funcionar direito
    if(prevState.bookChangedShelf){
      this.setState({bookChangedShelf: false});
    }
  }

  _moveBookShelves(id, book, currentShelf, finalShelf){

    // ATUALIZANDO O ESTADO DAS PRATELEIRAS PRIMEIRO PARA O USUARIO NAO TER O DELAY DA ATUALIZACAO DEVIDO A COMUNICACAO COM SERVIDOR
    this.setState((previousState) => {
      // TIRANDO DA PRATELEIRA ATUAL O LIVRO QUE VAMOS MOVER PARA A PRATELEIRA QUE ESCOLHEMOS
      let bookToChangeShelves = previousState[currentShelf].find((book) => book.id == id);
      // ATUALIZAR O FIELD shelf DO LIVRO
      bookToChangeShelves.shelf = finalShelf;

      let currentBookShelf = previousState[currentShelf].filter((book) => book.id != id);

      // COLOCANDO O LIVRO NA PRATELEIRA QUE ESCOLHEMOS
      if(finalShelf != "None"){
        previousState[finalShelf].push(bookToChangeShelves);
      }

      // ATUALIZANDO A PRATELEIRA EM QUE O LIVRO FOI RETIRADO
      previousState[currentShelf] = currentBookShelf;

      return previousState;
    });

    // DEPOIS ATUALIZAMOS COM O SERVIDOR E DAMOS O FEEDBACK DE SUCESSO ATRAVES DO ALERT DO BOOTSTRAP QUE EH CRIADO BASEADO
    // NO bookChangedShelf DO STATE
    BooksAPI.update(book, finalShelf).then((data) => {

      this.setState({bookChangedShelf : true});
      
    });

  }


  _updateSearchedBook(id, book, currentShelf, finalShelf){

    BooksAPI.update(book, finalShelf).then((data) => {

      // ATUALIZANDO O ESTADO DAS PRATELEIRAS
      this.setState((previousState) => {

        // ATUALIZAR O FIELD shelf DO LIVRO
        book.shelf = finalShelf;

        let currentBookShelf = null;
        // SE ELE ESTIVER EM ALGUMA PRATELEIRA, ENTAO TIRAMOS O LIVRO ESCOLHIDO DA MESMA
        if(currentShelf != "none"){
          currentBookShelf = previousState[currentShelf].filter((book) => book.id != id);
        }

        // COLOCANDO O LIVRO NA PRATELEIRA QUE ESCOLHEMOS
        if(finalShelf != "none"){
          previousState[finalShelf].push(book);
        }

        // ATUALIZANDO A PRATELEIRA EM QUE O LIVRO FOI RETIRADO
        if(currentShelf != "none"){
          previousState[currentShelf] = currentBookShelf;
        }

        return previousState;
      });
    });

  }

  
  render() {

    const {currentlyReading, wantToRead, read, loadingRequest, bookChangedShelf} = this.state;

    let all_books = this.state.currentlyReading.concat(this.state.wantToRead);
    all_books = all_books.concat(this.state.read);

    return (
      <div className="app">
        <Route path="/add-book" render={() => (
          <SearchPage booksOnShelves={all_books} moveBookShelves={this._updateSearchedBook.bind(this)} />
        )}
        />
        <Route exact path="/" render={() =>
          (
            <BooksApp loadingRequest={loadingRequest} bookChangedShelf={bookChangedShelf}
            moveBookShelves= { this._moveBookShelves.bind(this) }
            currentlyReading={currentlyReading} wantToRead={wantToRead}
            read={read} />
          )
        }
        />
      </div>
    )
  }
}

export default App
