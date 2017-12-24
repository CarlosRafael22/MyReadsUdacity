import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book.js'
import { Link } from 'react-router-dom'

export default class SearchPage extends React.Component{

  // NO STATE DO COMPONENT TEMOS QUE TAMBEM TER OS LIVROS NA NOSSO PRATELEIRA, POIS ASSIM SERA POSSIVEL
  // ATUALIZAR O SELECT DO LIVRO NA PESQUISA DE ACORDO COM A PRATELEIRA EM Q ESSE LIVRO ESTA
	constructor(props){
		super(props);
		this.state = {
			searchQuery: "",
			booksQueried: [],
      booksOnShelves: []
		};
	}

	handleChange(event){
		this.setState({searchQuery: event.target.value});
		console.log(event.target.value);
    console.log("LIVROS NAS PRATELEIRAS");
    console.log(this.props.booksOnShelves);

    // PEGANDO OS LIVROS QUE ESTAO NAS PRATELEIRAS E VERIFICANDO SE ESTAO ENTRE OS QUE RETORNARAM DA PESQUISA
    // SE ESTIVEREM PRESENTES ENTAO ADICIONAMOS O FIELD shelf NO OBJECT Q REPRESENTA O LIVRO PARA, ASSIM,
    // SER MOSTRADO NO <select />


		BooksAPI.search(event.target.value).then((data) => {
      console.log("OLD DATA");
			console.log(data);

      // PARA TODOS OS LIVROS DA PRATELEIRA
      // SEPARAMOS UM NOVO ARRAY SE ELE ESTIVER PRESENTE NO CONJUNTO DOS LIVROS RETORNADOS DA PESQUISA
      // let commonBooksOnData = this.props.booksOnShelves.filter((book) => {
      //   let book_matched = data.find((book_data) =>{
      //     if(book_data.id == book.id){
      //       return book;
      //     }
      //   });
      //   return book_matched;
      // });
      // console.log("LIVROS EM COMUM");
      // console.log(commonBooksOnData);


      // let mod = data.map((book) => {
      //   return this.props.booksOnShelves.find((book_on_shelf) => (book_on_shelf.id == book.id))
      // });


      let newBooks = data.map((book) => {
        let book_matched = this.props.booksOnShelves.find((book_on_shelf) => (book_on_shelf.id == book.id));
        if(book_matched != null){
          return book_matched;
        }else{
          return book;
        }
      });

      console.log("LIVROS RETORNADOS MERGED");
      console.log(data);
      // console.log(mod);
      console.log(newBooks);

      // let booksUpdated = Object.assign(data, commonBooksOnData);
      // console.log("MODIFICADOS");
      // console.log(data);
      // console.log(booksUpdated);

			this.setState({booksQueried: newBooks});
			console.log(this.state.booksQueried);
		});
	}

	render(){
		return (
			<div className="search-books">
            <div className="search-books-bar">
             
              <Link to="/" className="close-search">Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author of the book" 
                value={this.state.searchQuery} onChange={this.handleChange.bind(this)} />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
              	{this.state.booksQueried.map((book) => {
	                return (
	                    <li key={book.id}>
	                      <Book book_title={book.title} book_authors={book.authors.join(" , ")} book_id={book.id}
	                      book_cover={book.imageLinks.thumbnail} book_shelf={book.shelf != undefined ? book.shelf : "none"} 
                        changeShelves={(id, currentShelf, finalShelf) => {
                          let book = this.state.booksQueried.find((book) => {return book.id == id});
                          this.props.moveBookShelves(id, book, currentShelf, finalShelf);
                        }} />
	                    </li>
	                );
	            })}
              </ol>
            </div>
          </div>
		)
	}
}