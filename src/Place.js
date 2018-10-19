import React, { Component } from "react";


function Place (props) {

    return ( 

      <li 
      role = "button"
      className = "place"
      tabIndex = "0"
      onKeyPress = {
        this.props.openInfoBox.bind(
          this,
          this.props.data.marker
        )
      }
      onClick = {
        this.props.openInfoBox.bind(this, this.props.data.marker)
      } >
      {
        this.props.data.longname
      } </li>

    );
  }

export default Place;
