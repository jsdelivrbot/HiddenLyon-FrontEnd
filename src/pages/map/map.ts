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
  markers:Array<google.maps.Marker>;
  poiService:POIService;
  globals: Globals;
  categoriesC: Array<string>;


  constructor(public geolocation: Geolocation, serv: POIService, g: Globals,public modalCtrl: ModalController) {
    this.poiService=serv;
    this.globals=g;
    this.markers= new Array<google.maps.Marker>();
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
            });
            this.markers.push(marker);
        }
   }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.globals.photoTakenLat=position.coords.latitude;
      this.globals.photoTakenLon=position.coords.longitude;
      let mapOptions = {
        center: latLng,
        zoom: 15,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

       //Affichage des marqueurs
        let latLng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let latLng2 = new google.maps.LatLng(position.coords.latitude+0.01, position.coords.longitude+0.01);
        let coord: Array<google.maps.LatLng> =[];
        coord[0] = latLng1;
        coord[1] = latLng2;

        this.marquerPositionGeo(coord);

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

    clearMarkers() {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
        this.markers =[];
      }

    setMarkers() {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(this.map);
        }
      }

    filtrerCategorie() {
        this.clearMarkers();
        if(this.categoriesC.length==0) {
            this.poiService.getPOI(this.globals.userExtended.token).then(data => {
            this.points = data;
            this.traitementPoints();

            }).catch(err =>{
                });
        }
        else {
            /*this.poiService.getPOICategorie(this.globals.userExtended.token, this.categoriesC).then(data => {
            this.points = data;
            this.traitementPoints();

            }).catch(err => {
                });*/

        }
    }

    filtrerRequete(q:string) {
        this.clearMarkers();
        if(q.length>0){
            /*this.poiService.getPOIRequete(this.globals.userExtended.token, q).then(data => {
            this.points=data;
            this.traitementPoints();

            }).catch(err => {
                });*/
        }
        else {
            this.poiService.getPOI(this.globals.userExtended.token).then(data => {
            this.points = data;
            this.traitementPoints();

            }).catch(err =>{
                });
        }
    }

    cancel() {
        this.poiService.getPOI(this.globals.userExtended.token).then(data => {
            this.points = data;
            this.traitementPoints();

            }).catch(err =>{
                });
    }

}




