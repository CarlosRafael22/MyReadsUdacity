import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book.js'


export default class SearchPage extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			searchQuery: "",
			booksQueried: []
		};
	}

	handleChange(event){
		this.setState({searchQuery: event.target.value});
		console.log(event.target.value);

		BooksAPI.search(event.target.value).then((data) => {
			console.log(data);
			this.setState({booksQueried: data});
			console.log(this.state.booksQueried);
		});
	}

	_moveBookShelves(id, currentShelf, finalShelf){

    // PEGANDO A ID DO LIVRO BASEADO NO TITULO
    // JA QUE NO Book COMPONENT TEMOS A INFORMACAO DO TITULO, AUTORES, PRATELEIRA
    let book = this.state.booksQueried.find((book) => book.id == id);
    console.log(book);
    console.log(finalShelf);
    
    BooksAPI.update(book, finalShelf).then((data) => {
      console.log(data);

      // // ATUALIZANDO O ESTADO DAS PRATELEIRAS
      // this.setState((previousState) => {
      //   // TIRANDO DA PRATELEIRA ATUAL O LIVRO QUE VAMOS MOVER PARA A PRATELEIRA QUE ESCOLHEMOS
      //   let bookToChangeShelves = previousState[currentShelf].find((book) => book.id == id);
      //   console.log(bookToChangeShelves);

      //   console.log(currentShelf);
      //   let currentBookShelf = previousState[currentShelf].filter((book) => book.id != id);
      //   console.log(currentBookShelf);

      //   // COLOCANDO O LIVRO NA PRATELEIRA QUE ESCOLHEMOS
      //   console.log(finalShelf);
      //   if(finalShelf != "None"){
      //     previousState[finalShelf].push(bookToChangeShelves);
      //   }
        
      //   console.log(previousState[finalShelf]);

      //   // ATUALIZANDO A PRATELEIRA EM QUE O LIVRO FOI RETIRADO
      //   previousState[currentShelf] = currentBookShelf;
      //   console.log(previousState[currentShelf]);

      //   return previousState;
      // });
    });

  	}

	render(){
		return (
			<div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.props.showSearchPage(false)}>Close</a>
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
	                      book_cover={book.imageLinks.thumbnail} book_shelf="none" changeShelves={this._moveBookShelves.bind(this)} />
	                    </li>
	                );
	            })}
              </ol>
            </div>
          </div>
		)
	}
}