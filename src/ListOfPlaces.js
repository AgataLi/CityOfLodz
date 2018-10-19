import React from "react";

/*
List of my places
*/

class ListOfPlaces extends React.Component {

//settings

  constructor(props) {
    super(props);
    this.state = {
      places: "",
      query: "",
      suggestions: true
    };

    this.filterPlaces = this.filterPlaces.bind(this);
  }

//filtering my places
  filterPlaces(event) {
    this.props.closeInfo();
    const { value } = event.target;
    var places = [];
    this.props.places.forEach(function(place) {
      if (place.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        place.marker.setVisible(true);
        places.push(place);
      } else {
        place.marker.setVisible(false);
      } 
    });

    this.setState({
      places: places,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      places: this.props.places
    });
  }


  render() {
    var list = this.state.places.map(function(listItem, index) {
      return (
        <Place
          key={index}
          openInfo={this.props.openInfo.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="places">
        <input
          role="search"
          aria-labelledby="search"
          id="filter-field"
          className="filter-input"
          type="text"
          placeholder="filter"
          value={this.state.query}
          onChange={this.filterPlaces}
        />
        <ul className="places-list">
          {this.state.suggestions && list}
        </ul>
      </div>
    );
  }
}

class Place extends React.Component {

  render() {
    return ( <li role = "button"
      className = "place"
      tabIndex = "0"
      onKeyPress = {
        this.props.openInfo.bind(
          this,
          this.props.data.marker
        )
      }
      onClick = {
        this.props.openInfo.bind(this, this.props.data.marker)
      } >
      {
        this.props.data.longname
      } <
      /li>
    );
  }
}
export default ListOfPlaces;
