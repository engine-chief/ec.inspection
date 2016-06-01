if (ionic.Platform.isAndroid()) {
  var link = "http://enginechief.in/api/v0/trucks/create";
  var imagesLink = "http://enginechief.in/api/v0/trucks/upload_images/";
} else {
  var link = "http://192.168.1.107:3000/api/v0/trucks/create";
  var imagesLink = "http://192.168.1.107:3000/api/v0/trucks/upload_images/";
}

// var link = "http://192.168.1.3:3000/api/v0/trucks/create";
// var imagesLink = "http://192.168.1.3:3000/api/v0/trucks/upload_images/";

angular.module('ionicApp.controllers', ['ngCordova'])

.controller('LoginCtrl', function($scope) {})

.controller('ClientCtrl', function($scope) {
  $scope.myText = Math.random().toString(36).substr(2, 5);
})

.controller('TruckImgCtrl', function($rootScope, $scope, $cordovaCamera, $http, $ionicPopup) {

  $scope.gaRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.gaRating = rating;
    }
  };

  $scope.gaRating = $scope.gaRatingObject.rating;

  $scope.takePicture1 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI1 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture2 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI2 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture3 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI3 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture4 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI4 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture5 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI5 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.data = {};

  $scope.uploadGAPics = function() {
    var images = {
      ga_1: $scope.imgURI1,
      ga_2: $scope.imgURI2,
      ga_3: $scope.imgURI3,
      ga_4: $scope.imgURI4,
      ga_5: $scope.imgURI5,
      ga_description: $scope.data.gaDescription,
      ga_rating: $scope.gaRating,
      original_length_of_chassis_ft: $scope.data.original_length_of_chassis_ft,
      original_length_of_chassis_in: $scope.data.original_length_of_chassis_in,
      oem_length_of_chassis_ft: $scope.data.oem_length_of_chassis_ft,
      oem_length_of_chassis_in: $scope.data.oem_length_of_chassis_in,
      height_of_container_ft: $scope.data.height_of_container_ft,
      height_of_container_in: $scope.data.height_of_container_in,
      overall_width_ft: $scope.data.overall_width_ft,
      overall_width_in: $scope.data.overall_width_in,
      overall_height_ft: $scope.data.overall_height_ft,
      overall_height_in: $scope.data.overall_height_in,
      overall_length_ft: $scope.data.overall_length_ft,
      overall_length_in: $scope.data.overall_length_in
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'General Appearance Pics Uploaded Successfully!!'
        });
      }
    });
  };

  $scope.chassisRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.chassisRating = rating;
    }
  };

  $scope.chassisRating = $scope.chassisRatingObject.rating;

  $scope.takePicture6 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI6 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture7 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI7 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture8 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI8 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture9 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI9 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadChassisPics = function() {
    var images = {
      chassis_1: $scope.imgURI6,
      chassis_2: $scope.imgURI7,
      chassis_3: $scope.imgURI8,
      chassis_4: $scope.imgURI9,
      chassis_description: $scope.data.chassisDescription,
      chassis_rating: $scope.chassisRating
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Chassis Pics Uploaded Successfully!!'
        });
      }
    });
  };

  $scope.cabinRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.cabinRating = rating;
    }
  };

  $scope.cabinRating = $scope.cabinRatingObject.rating;


  $scope.takePicture10 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI10 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture11 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI11 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });

  };

  $scope.takePicture12 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI12 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });

  };

  $scope.uploadCabinPics = function() {
    var images = {
      cabin_1: $scope.imgURI10,
      cabin_2: $scope.imgURI11,
      cabin_3: $scope.imgURI12,
      cabin_description: $scope.data.cabinDescription,
      cabin_rating: $scope.cabinRating
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Cabin Pics Uploaded Successfully!!'
        });
      }
    });
  };

  $scope.engineRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.engineRating = rating;
    }
  };

  $scope.engineRating = $scope.engineRatingObject.rating;


  $scope.takePicture13 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI13 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });


  };

  $scope.uploadEnginePics = function() {
    var images = {
      engine_1: $scope.imgURI13,
      engine_description: $scope.data.engineDescription,
      engine_rating: $scope.engineRating
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Engine Pics Uploaded Successfully!!'
        });
      }
    });
  };

  $scope.transmissionRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.transmissionRating = rating;
    }
  };

  $scope.transmissionRating = $scope.transmissionRatingObject.rating;


  $scope.takePicture14 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI14 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadTransmissionPics = function() {
    var images = {
      transmission_1: $scope.imgURI14,
      transmission_description: $scope.data.transmissionDescription,
      transmission_rating: $scope.transmissionRating
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Transmission Pics Uploaded Successfully!!'
        });
      }
    });
  };

  $scope.takePicture15 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI15 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture16 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI16 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture17 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI17 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture18 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI18 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadDocumentPics = function() {

    var images = {
      documents_1: $scope.imgURI15,
      documents_2: $scope.imgURI16,
      documents_3: $scope.imgURI17,
      documents_4: $scope.imgURI18
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Document Pics Uploaded Successfully!!'
        });
      }
    });
  };

  $scope.tyresRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.tyresRating = rating;
    }
  };

  $scope.tyresRating = $scope.tyresRatingObject.rating;


  $scope.takePicture19 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI19 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture20 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI20 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture21 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI21 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture22 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI22 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture23 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI23 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture24 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI24 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture25 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI25 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture26 = function() {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1024,
      targetHeight: 768,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.imgURI26 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadTyrePics = function() {

    var images = {
      tyres_1: $scope.imgURI19,
      tyres_2: $scope.imgURI20,
      tyres_3: $scope.imgURI21,
      tyres_4: $scope.imgURI22,
      tyres_5: $scope.imgURI23,
      tyres_6: $scope.imgURI24,
      tyres_7: $scope.imgURI25,
      tyres_8: $scope.imgURI26,
      tyres_description: $scope.data.tyresDescription,
      tyres_rating: $scope.tyresRating
    };
    $http.post(imagesLink + $rootScope.id, {
      "truck": images
    }).then(function(res) {
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Tyre Pics Uploaded Successfully!!'
        });
      }
    });
  };

})

.controller('TruckImgCtrll', function($scope, $cordovaCapture) {
  document.addEventListener("deviceready", init, false);

  function init() {
    document.querySelector("#eVideo").addEventListener("touchend", function() {
      console.log("Take video");
      navigator.device.capture.captureVideo(captureSuccess, captureError, {
        limit: 1
      });
    }, false);
    document.querySelector("#dVideo").addEventListener("touchend", function() {
      console.log("Take video");
      navigator.device.capture.captureVideo(captureSuccesss, captureErrorr, {
        limit: 1
      });
    }, false);
  }

  function captureError(e) {
    console.log("capture error: " + JSON.stringify(e));
  }

  function captureErrorr(e) {
    console.log("capture error: " + JSON.stringify(e));
  }

  function captureSuccess(s) {
    console.log("Success");
    console.dir(s[0]);
    var v = "<video width='250px' height='300px'  controls='controls'>";
    v += "<source src='" + s[0].fullPath + "' type='video/mp4'>";
    v += "</video>";
    document.querySelector("#videoArea1").innerHTML = v;
  }

  function captureSuccesss(s) {
    console.log("Success");
    console.dir(s[0]);
    var v = "<video width='250px' height='300px'  controls='controls'>";
    v += "<source src='" + s[0].fullPath + "' type='video/mp4'>";
    v += "</video>";
    document.querySelector("#videoArea2").innerHTML = v;

  }
})


.controller('TruckCtrl', function($rootScope, $scope, $http, $location, $ionicPopup) {
  $scope.data = {};
  $scope.truckSubmit = function() {

    var trucks = {
      variant: $scope.data.variant,
      truck_passing: $scope.data.truck_passing,
      truck_number: $scope.data.truck_number,
      chassis_number: $scope.data.chassis_number,
      engine_number: $scope.data.engine_number,
      permit_date: $scope.data.permit_date,
      date_of_registration: $scope.data.date_of_registration,
      bodytype: $scope.data.bodytype,
      manufacturing_month_and_year: $scope.data.manufacturing_month_and_year,
      insurance_valid_till: $scope.data.insurance_valid_till,
      national_permit_valid_till: $scope.data.national_permit_valid_till,
      fitness_valid_till: $scope.data.fitness_valid_till,
      insurance_premium: $scope.data.insurance_premium,
      insurance_declared_value: $scope.data.insurance_declared_value,
      no_claim_bonus: $scope.data.no_claim_bonus
    };
    $http.post(link, {
      truck: trucks
    }).then(function(res) {
      if (res.status == 200) {
        $rootScope.id = res.data.id;
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Truck Created Successfully!!'
        });
        $location.path('/tab/truck/0');
      }
    }, function(res) {
      if (res.status == 400) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Please fill all the mandatory fields'
        });
        $scope.errors = "Please fill following fields: " + res.data.errors;
      } else {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Unable to upload!! Please contact system admin'
        });
      }
    });
  };
});