import React from "react";
import ListOfPlaces from "./ListOfPlaces";
import Header from "./Header"



class App extends React.Component {
  
   constructor(props) {
    super(props);
    this.state = {

//properties of my places

      places: [{
      "name": "Cinematography Museum",
      "type": "museum",
      "latitude": 51.7593286,
      "longitude": 19.4742928
     },
       {
      "name": "Central Museum of Textiles in Lodz",
      "type": "museum",
      "latitude": 51.74551659999999,
      "longitude": 19.461843
      }, 
        {
      "name": "ArtInkubator",
      "type": "art center",
      "latitude": 51.7485118,
      "longitude": 19.4637619
      }, 
        {
      "name": "EC1",
      "type": "planetarium",
      "latitude": 51.7678788,
      "longitude": 19.4702352
      }, 
        {
      "name": "Owoce Warzywa",
      "type": "restaurant",
      "latitude": 51.7688509,
      "longitude": 19.4596262
      }],

      map: "",
      infoWindow: "",
      marker: ""
    };

    this.initMap = this.initMap.bind(this);
    this.openInfo = this.openInfo.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
  }

//geting google maps, adding it to the page

  componentDidMount() {

    window.initMap = this.initMap;
    const scriptEl = window.document.getElementsByTagName("script")[0];
    const scriptCreate = window.document.createElement("script");
    scriptCreate.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQvCC8DF5zq0SrwINFUmLjsd_9QIJcW9I&callback=initMap";
    scriptCreate.async = true;
    scriptCreate.onerror = function() {
    document.write("Google Maps dont response");
    };
  scriptEl.parentNode.insertBefore(scriptCreate, scriptEl);
}
    

  initMap() {
    const self = this;
    const mapView = document.getElementById("map");
    mapView.style.height = window.innerHeight + "px";
    const map = new window.google.maps.Map(mapView, {
      zoom: 13,
      center: {
        lat: 51.766344,
        lng: 19.458825,
      },
      
      mapTypeControl: true
    });

    const infoWindow = new window.google.maps.InfoWindow();

    window.google.maps.event.addListener(infoWindow, "closeclick", function() {
      self.closeInfo();
    });

    this.setState({
      map: map,
      infoWindow: infoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      const center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfo();
    });

    const places = [];
    this.state.places.forEach(function(place) {
      let longname = place.name + ": " + place.type;
      let marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          place.latitude,
          place.longitude
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener("click", function() {
        self.openInfo(marker);
      });

      place.longname = longname;
      place.marker = marker;
      place.display = true;
      places.push(place);
    });
    this.setState({
      places: places
    });
  }

  //Window with information about the place. 

  openInfo(marker) {
    this.closeInfo();
    this.state.infoWindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      marker: marker
    });
    this.state.infoWindow.setContent("Just a second, waiting for Foursquare");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

// getting data from foursquer
  getMarkerInfo(marker) {

    const self = this;
        const url = "https://api.foursquare.com/v2/venues/search?client_id=0C45SERNWFEQWUAPGXG2L3NPY1ZPB4ELZL0FLGUD5G5AHWPW&client_secret=NPKWKBHK35YMMPITP4F3QTPLV5RS45DTEUXDLLVGCD0KHFBU&v=20130815&ll="
          + marker.getPosition().lat() + ", " + marker.getPosition().lng() + " & limit = 1 ";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.infoWindow.setContent("We couldn't get searched data");
          return;
        }

// creating content for the infoWindow

        response.json().then(function(data) {
          const placeData = data.response.venues[0];
          const loc = `<h3>${placeData.name}</h3>`;
          const street = `<div>${placeData.location.formattedAddress[0]}</div>`;
          const plz = `<div>Łódź (Lodz)</div>`;
          const country = `<div>Poland</div>`;
           
          const More =
            '<a href="https://foursquare.com/v/' +
            placeData.id +
            '" target="_blank">Details on Foursquare</a>';
          self.state.infoWindow.setContent(
            loc + street + plz + country + More
          );
        });
      })
      .catch(function(err) {
        self.state.infoWindow.setContent("Sorry, Foursquare don't response");
      });
  }

  
  closeInfo() {
    if (this.state.marker) {
      this.state.marker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infoWindow.close();
  }

  
  render() {
    return (
      <div className="container">
        <div className="menu">
          <Header />
          <ListOfPlaces
            places={this.state.places}
            openInfo={this.openInfo}
            closeInfo={this.closeInfo}
          />
        </div>
        <div id="map" />
      </div>
    );
  }
}

export default App;
