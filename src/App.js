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

    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: [],
      loadingRequest: true
    }
  }


  // ESSE VAI SER O CONTAINER COMPONENT ENTAO ELE VAI TER AS FUNCOES DE CONEXOES COM APIS EXTERNAS
  // ELE TAMBEM VAI LIDAR COM O GERENCIAMENTO DOS ESTADOS DAS PRATELEIRAS JA QUE OS LIVROS DAS PRATELEIRAS TEM Q
  // FICAR EM SYNC COM OS DO SEARCHPAGE
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

      });
      console.log(response);
      console.log(all_books);
  }


  // _updateBooks(id, currentbook, finalShelf){
  //   BooksAPI.update(book, finalShelf).then((data) => {
  //     console.log(data);

  //     // ATUALIZANDO O ESTADO DAS PRATELEIRAS
  //     this.setState((previousState) => {
  //       // TIRANDO DA PRATELEIRA ATUAL O LIVRO QUE VAMOS MOVER PARA A PRATELEIRA QUE ESCOLHEMOS
  //       let bookToChangeShelves = previousState[currentShelf].find((book) => book.id == id);
  //       console.log(bookToChangeShelves);

  //       console.log(currentShelf);
  //       let currentBookShelf = previousState[currentShelf].filter((book) => book.id != id);
  //       console.log(currentBookShelf);

  //       // COLOCANDO O LIVRO NA PRATELEIRA QUE ESCOLHEMOS
  //       console.log(finalShelf);
  //       if(finalShelf != "None"){
  //         previousState[finalShelf].push(bookToChangeShelves);
  //       }
        
  //       console.log(previousState[finalShelf]);

  //       // ATUALIZANDO A PRATELEIRA EM QUE O LIVRO FOI RETIRADO
  //       previousState[currentShelf] = currentBookShelf;
  //       console.log(previousState[currentShelf]);

  //       return previousState;
  //     });
  //   });
  // }

  _moveBookShelves(id, book, currentShelf, finalShelf){

    // PEGANDO A ID DO LIVRO BASEADO NO TITULO
    // JA QUE NO Book COMPONENT TEMOS A INFORMACAO DO TITULO, AUTORES, PRATELEIRA
    // let book = this.state[currentShelf].find((book) => book.id == id);
    // console.log(book);

    BooksAPI.update(book, finalShelf).then((data) => {
      console.log(data);

      // ATUALIZANDO O ESTADO DAS PRATELEIRAS
      this.setState((previousState) => {
        // TIRANDO DA PRATELEIRA ATUAL O LIVRO QUE VAMOS MOVER PARA A PRATELEIRA QUE ESCOLHEMOS
        let bookToChangeShelves = previousState[currentShelf].find((book) => book.id == id);
        // ATUALIZAR O FIELD shelf DO LIVRO
        bookToChangeShelves.shelf = finalShelf;

        console.log(bookToChangeShelves);

        console.log(currentShelf);
        let currentBookShelf = previousState[currentShelf].filter((book) => book.id != id);
        console.log(currentBookShelf);

        // COLOCANDO O LIVRO NA PRATELEIRA QUE ESCOLHEMOS
        console.log(finalShelf);
        if(finalShelf != "None"){
          previousState[finalShelf].push(bookToChangeShelves);
        }


        
        console.log(previousState[finalShelf]);

        // ATUALIZANDO A PRATELEIRA EM QUE O LIVRO FOI RETIRADO
        previousState[currentShelf] = currentBookShelf;
        console.log(previousState[currentShelf]);

        


        return previousState;
      });
    });

  }


  _updateSearchedBook(id, book, currentShelf, finalShelf){
    
    // BooksAPI.update(book, finalShelf).then((data) => {
    //   console.log("ATUALIZANDO PRATELEIRA NO BooksAPI");
    //   console.log(data);

    //   // ATUALIZANDO O ESTADO DAS PRATELEIRAS
    //   this.setState((previousState) => {
    //     // ATUALIZANDO O FIELD shelf NO LIVRO
    //     book.shelf = finalShelf;  
    //     // ADICIONANDO O LIVRO A PRATELEIRA QUE ESCOLHEMOS NO SEARCH PAGE
    //     previousState[finalShelf].push(book);
        
    //     console.log(previousState[finalShelf]);

    //     return previousState;
    //   });
    // });
    BooksAPI.update(book, finalShelf).then((data) => {
      console.log(data);

      // ATUALIZANDO O ESTADO DAS PRATELEIRAS
      this.setState((previousState) => {

        // let bookToChangeShelves = null;
        // // SE ELE VIER DE ALGUMA PRATELEIRA
        // if(currentShelf != "none"){
        //   // TIRANDO DA PRATELEIRA ATUAL O LIVRO QUE VAMOS MOVER PARA A PRATELEIRA QUE ESCOLHEMOS
        //   bookToChangeShelves = previousState[currentShelf].find((book) => book.id == id);
        // }
        
        // ATUALIZAR O FIELD shelf DO LIVRO
        book.shelf = finalShelf;
        console.log(book);

        console.log(currentShelf);
        let currentBookShelf = null;
        // SE ELE ESTIVER EM ALGUMA PRATELEIRA, ENTAO TIRAMOS O LIVRO ESCOLHIDO DA MESMA
        if(currentShelf != "none"){
          currentBookShelf = previousState[currentShelf].filter((book) => book.id != id);
          console.log(currentBookShelf);
        }
        

        // COLOCANDO O LIVRO NA PRATELEIRA QUE ESCOLHEMOS
        console.log(finalShelf);
        if(finalShelf != "None"){
          previousState[finalShelf].push(book);
        }

        
        
        console.log(previousState[finalShelf]);

        // ATUALIZANDO A PRATELEIRA EM QUE O LIVRO FOI RETIRADO
        if(currentShelf != "none"){
          previousState[currentShelf] = currentBookShelf;
        }
        
        console.log(previousState[currentShelf]);

        


        return previousState;
      });
    });

  }

  
  render() {

    const {currentlyReading, wantToRead, read, loadingRequest} = this.state;

    let all_books = this.state.currentlyReading.concat(this.state.wantToRead);
    all_books = all_books.concat(this.state.read);

    console.log("RENDER");
    console.log(all_books);
    console.log(currentlyReading);
    console.log(wantToRead);
    console.log(read);

    return (
      <div className="app">
        <Route path="/add-book" render={() => (
          <SearchPage booksOnShelves={all_books} moveBookShelves={this._updateSearchedBook.bind(this)} />
        )}
        />
        <Route exact path="/" render={() =>
          (
            <BooksApp loadingRequest={loadingRequest} moveBookShelves= { this._moveBookShelves.bind(this) }
            currentlyReading={currentlyReading} wantToRead={wantToRead}
            read={read} />
          )
        }
        />
        {/*{this.state.showSearchPage ? (
                  <SearchPage showSearchPage={ (searchState) => this.setState({ showSearchPage: searchState })} />
                ) : (
                  <BooksApp changePageState= { () => this.setState({ showSearchPage: true }) } />
                )}*/}
      </div>
    )
  }
}

export default App
