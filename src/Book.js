import React from 'react'

class Book extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			shelfSelected : props.book_shelf
		};
	}

	handleChange(event){
		this.setState({shelfSelected: event.target.value});

		console.log("Book");
		console.log(event.target.value);
		console.log(this.props.book_shelf);
		console.log(this.state.shelfSelected);

		// USANDO A CALLBACK FUNCTION PASSADA PARA ATUALIZAR A PRATELEIRA NO SERVIDOR
		this.props.changeShelves(this.props.book_id, this.props.book_shelf, event.target.value);
		console.log(this.state.shelfSelected);
	}

	render(){
		return (
			<div className="book">
	          <div className="book-top">
	            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: "url("+this.props.book_cover+")" }}></div>
	            <div className="book-shelf-changer">
	              <select value={this.state.shelfSelected} onChange={this.handleChange.bind(this)} >
	                <option value="disabled" disabled>Move to...</option>
	                <option value="currentlyReading">Currently Reading</option>
	                <option value="wantToRead">Want to Read</option>
	                <option value="read">Read</option>
	                <option value="none">None</option>
	              </select>
	            </div>
	          </div>
	          <div className="book-title">{this.props.book_title}</div>
	          <div className="book-authors">{this.props.book_authors}</div>
	        </div>
		);
	}
	
}

export default Book;