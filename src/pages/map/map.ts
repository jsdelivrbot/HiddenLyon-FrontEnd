import { Component, ViewChild, ElementRef } from '@angular/core';
import {Geolocation } from '@ionic-native/geolocation';
import { ModalController } from 'ionic-angular';
import {POIService} from "../../service/POIService";
import {PointOfInterest} from "../../model/PointOfInterest.model";
import {Globals} from "../../globalVariable/globals";

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  points:Array<PointOfInterest>;
  poiService:POIService;
  globals: Globals;


  constructor(public geolocation: Geolocation, serv: POIService, g: Globals,public modalCtrl: ModalController) {
    this.poiService=serv;
    this.globals=g;

  }

  public ngAfterViewInit()
  {
    this.loadMap();

  }

  ajouterMarqueurs(): void {
    var modalCtrl = this.modalCtrl;
    var i:number;


    for(i=0;i<this.points.length;i++) {
        let latLng = new google.maps.LatLng(this.points[i].latitude, this.points[i].longitude);
        var marker = new google.maps.Marker({
          position:latLng,
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });
        var title = this.points[i].title;
        var description = this.points[i].description;
        var picture = this.points[i].picture;
        var categories = this.points[i].categories;

        const myModal =  modalCtrl.create('InfosPointPage', { title: title,
          description: description,
          picture: picture,
          categories: categories });
        marker.addListener('click', function() {
          myModal.present();
        });

    }
   }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      /*var marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: "Hello World!"
      });*/

       //Affichage des marqueurs
        let latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let latLng2 = new google.maps.LatLng(position.coords.latitude+0.01, position.coords.longitude+0.01);
        let coord: Array<google.maps.LatLng> =[];
        coord[0] = latLng1;
        coord[1] = latLng2;

        var PoI= new PointOfInterest('Title','Ceci est une description complète du point d\'interet', '../../assets/imgs/bb.jpg',
          null, null, position.coords.latitude-0.01,position.coords.longitude-0.01);
        this.marquerPositionGeo(coord);

//        console.log(this.points.length);


        this.poiService.getPOI(this.globals.userExtended.token).then(data => {
            this.points = data;
            this.ajouterMarqueurs();
            }).catch(err =>{
            });
        }, (err) => {
          console.log(err);
    });

  }


  marquerPositionGeo(coords: Array<google.maps.LatLng>) :void {
    var i:number;
    var modalCtrl = this.modalCtrl;
    for(i=0;i<coords.length;i++) {
      var marker = new google.maps.Marker({
        position: coords[i],
        map: this.map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      marker.addListener('click', function() {
        const myModal =  modalCtrl.create('InfosPointPage');
        myModal.present();
      });

    }
  }

}



