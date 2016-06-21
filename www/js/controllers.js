if (ionic.Platform.isAndroid()) {
  var rootLink = "http://enginechief.in";
  var link = "http://enginechief.in/api/v0/trucks/create";
  var sectionsLink = "http://enginechief.in/api/v0/trucks/upload_section/";
} else {
  var rootLink = "http://192.168.2.36:3000";
  var link = "http://192.168.2.36:3000/api/v0/trucks/create";
  var sectionsLink = "http://192.168.2.36:3000/api/v0/trucks/upload_section/";
}

var getCameraOptions = function(Camera, CameraPopoverOptions) {
  return {
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
};

angular.module('ionicApp.controllers', ['ngCordova'])

.controller('LoginCtrl', function($scope) {})

.controller('SearchCtrl', function($rootScope, $scope, $http, $location) {
  var fetchAllTrucks = function() {
    $http.get(rootLink + '/api/v0/trucks/filter', {
      params: {
        status: JSON.stringify(["Ready for Inspection", "Rejected"])
      }
    }).then(function(res) {
      $scope.trucks = res.data;
    });
  };

  var colorStatuses = function() {
    var elements = document.getElementsByClassName("status");
    for (i = 0; i < elements.length; i++) {
      el = elements[i];
      if (el.textContent == "Rejected") {
        el.style.color = "red";
      } else {
        el.style.color = "green";
      }
    }
  };

  $scope.$on("$ionicView.enter", function(event, data) {
    setTimeout(colorStatuses, 300);
  });

  $scope.search = function() {
    var searchQuery = document.getElementById("searchText").value;
    $http.get(rootLink + '/api/v0/trucks/filter', {
      params: {
        query: searchQuery,
        status: JSON.stringify(["Ready for Inspection", "Rejected"])
      }
    }).then(function(res) {
      $scope.trucks = res.data;
      setTimeout(colorStatuses, 10);
    });
  };

  $scope.loadTruck = function(truck) {
    $rootScope.truck = truck;
    $location.path("tab/truck");
  };

  $scope.fetchAllTrucks = fetchAllTrucks();

  // runs when the first time the view is loaded
  $scope.$on("$ionicView.loaded", function(event, data) {
    fetchAllTrucks();
    setTimeout(colorStatuses, 10);
  });
})

.controller('TruckCtrl', function($rootScope, $scope, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.data = {};

  $scope.truck_passing_regex = '[a-z A-Z]{2} [0-9]{2}';
  $scope.truck_number_regex = '[a-z A-Z]{1,2} [0-9]{4}';

  $http.get(rootLink + "/api/v0/trucks/bodytypes").then(function(res) {
    $scope.bodytypes = res.data;
  });

  if ($rootScope.truck) {
    $http.get(rootLink + '/api/v0/trucks/details/' + $rootScope.truck.id).then(function(res) {
      $scope.data = res.data.result;
      dateFields = ["local_permit_date", "date_of_registration", "manufacturing_month_and_year", "insurance_valid_till",
        "national_permit_valid_till", "fitness_valid_till", "local_permit_date"
      ];

      for (i = 0; i < dateFields.length; i++) {
        x = dateFields[i];
        if ($scope.data[x]) {
          arr = $scope.data[x].split("-");
          $scope.data[x] = new Date(arr[0], arr[1] - 1, arr[2]);
        }
      }
    });
  }

  $scope.truckSubmit = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>'
    });

    var trucks = {
      variant: $scope.data.variant,
      truck_passing: $scope.data.truck_passing,
      truck_number: $scope.data.truck_number,
      chassis_number: $scope.data.chassis_number,
      engine_number: $scope.data.engine_number,
      local_permit_date: document.getElementById("permitDate") ? document.getElementById("permitDate").value : null,
      date_of_registration: document.getElementById("regdate") ? document.getElementById("regdate").value : null,
      bodytype_id: $scope.data.bodytype.id,
      // always saving date as 1 in mfmn "yyyy-MM" -> "yyyy-MM-dd"
      manufacturing_month_and_year: document.getElementById("mfmn") ? (document.getElementById("mfmn").value + "-01") : null,
      capacity: $scope.data.capacity,
      no_of_valves: $scope.data.no_of_valves,
      insurance_valid_till: document.getElementById("insurance") ? document.getElementById("insurance").value : null,
      national_permit_valid_till: document.getElementById("permit") ? document.getElementById("permit").value : null,
      fitness_valid_till: document.getElementById("fitness") ? document.getElementById("fitness").value : null,
      insurance_premium: $scope.data.insurance_premium,
      insurance_declared_value: $scope.data.insurance_declared_value,
      no_claim_bonus: $scope.data.no_claim_bonus
    };
    $http.post(rootLink + "/api/v0/trucks/update/" + $rootScope.truck.id, {
      truck: trucks
    }).then(function(res) {
      if (res.status == 200) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Truck Updated Successfully!!'
        });
        $location.path('/tab/truck/documents');
      }
    }, function(res) {
      $ionicLoading.hide();
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
})

.controller('DocCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {

  $scope.takePictureRc = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgRc = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicturePermit = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgPermit = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureInsurance = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgInsurance = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureFitness = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgFitness = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadDocumentPics = function() {
    $ionicLoading.show({
      template: 'Uploading Document Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });

    var documents = {
      rc: $scope.imgRc,
      permit: $scope.imgPermit,
      insurance: $scope.imgInsurance,
      fitness: $scope.imgFitness
    };

    $http.post(sectionsLink + $rootScope.truck.id, {
      documents_section: documents
    }).then(function(res) {
      $ionicLoading.hide();
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Document Pics Uploaded Successfully!!'
        });
        $location.path("/tab/truck/ga");
      }
    }, function(res) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Upload Status',
        template: 'Unable to upload!! Please contact system admin'
      });
    });
  };
})

.controller('GACtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.data = {
    are_head_lights_working: true,
    are_indicators_working: true
  };

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

  $scope.takePictureGa1 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa1 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa2 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa2 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa3 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa3 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa4 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa4 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa5 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa5 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa6 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa6 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa7 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa7 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureGa8 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgGa8 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.pfRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.pfRating = rating;
    }
  };

  $scope.pfRating = $scope.pfRatingObject.rating;

  $scope.sdmRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.sdmRating = rating;
    }
  };

  $scope.sdmRating = $scope.sdmRatingObject.rating;

  $scope.fcRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.fcRating = rating;
    }
  };

  $scope.fcRating = $scope.fcRatingObject.rating;

  $scope.gcRatingObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(255,215,0)',
    iconOffColor: 'rgb(153,101,21)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.gcRating = rating;
    }
  };

  $scope.gcRating = $scope.gcRatingObject.rating;

  $scope.uploadGAPics = function() {
    // $ionicLoading.show({
    //   template: 'Uploading General Appearance Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    // });

    var gaDetails = {
      ga_1: $scope.imgGa1,
      ga_2: $scope.imgGa2,
      ga_3: $scope.imgGa3,
      ga_4: $scope.imgGa4,
      ga_5: $scope.imgGa5,
      ga_6: $scope.imgGa6,
      ga_7: $scope.imgGa7,
      ga_8: $scope.imgGa8,
      ga_rating: $scope.gaRating,
      original_length_of_chassis_ft: $scope.data.original_length_of_chassis_ft,
      original_length_of_chassis_in: $scope.data.original_length_of_chassis_in,
      manufacturing_length_of_chassis_ft: $scope.data.manufacturing_length_of_chassis_ft,
      manufacturing_length_of_chassis_in: $scope.data.manufacturing_length_of_chassis_in,
      height_of_container_ft: $scope.data.height_of_container_ft,
      height_of_container_in: $scope.data.height_of_container_in,
      overall_width_ft: $scope.data.overall_width_ft,
      overall_width_in: $scope.data.overall_width_in,
      overall_height_ft: $scope.data.overall_height_ft,
      overall_height_in: $scope.data.overall_height_in,
      overall_length_ft: $scope.data.overall_length_ft,
      overall_length_in: $scope.data.overall_length_in,
      paint_finish_rating: $scope.pfRating,
      side_sheet_metal_rating: $scope.sdmRating,
      floor_condition_rating: $scope.fcRating,
      glass_condition_rating: $scope.gcRating,
      are_head_lights_working: $scope.data.are_head_lights_working,
      are_indicators_working: $scope.data.are_indicators_working
    };
    $http.post(sectionsLink + $rootScope.truck.id, {
      general_appearance_section: gaDetails
    }).then(function(res) {
      if (res.status == 200) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'General Appearance Pics Uploaded Successfully!!'
        });
        $location.path('tab/truck/chassis');
      }
    });
  };
})

.controller('ChassisCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.data = {
    has_front_axle_intact: true,
    has_leaf_spring_front_left_intact: true,
    has_air_brake_and_pipe_front_left_intact: true,
    has_left_wheel_hydraulic_system_intact: true,
    has_left_hydraulic_wheel_air_brake_and_pipe_intact: true,
    has_gear_box_intact: true,
    has_shaft_intact: true,
    has_differential_intact: true,
    has_rear_axle_power_intact: true,
    has_leaf_spring_right_tyre_power_intact: true,
    has_leaf_spring_right_tyre_intact: true,
    has_rear_axle_intact: true,
    has_leaf_spring_left_tyre_power_intact: true,
    has_leaf_spring_left_tyre_intact: true,
    has_right_wheel_hydraulic_system_intact: true,
    has_right_hydraulic_wheel_air_brake_and_pipe_intact: true,
    has_leaf_spring_front_right_intact: true,
    has_air_brake_and_pipe_front_right_intact: true,
    has_steering_box_intact: true,
    has_drag_link_intact: true
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

  $scope.takePictureChassis1 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis1 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis2 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis2 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis3 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis3 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis4 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis4 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis5 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis5 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis6 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis6 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis7 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis7 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis8 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis8 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis9 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis9 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis10 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis10 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis11 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis11 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis12 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis12 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis13 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis13 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis14 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis14 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis15 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis15 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis16 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis16 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis17 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis17 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis18 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis18 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis19 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis19 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureChassis20 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgChassis20 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadChassisPics = function() {
    $ionicLoading.show({
      template: 'Uploading Chassis Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });
    var chassisDetails = {
      chassis_1: $scope.imgChassis1,
      chassis_2: $scope.imgChassis2,
      chassis_3: $scope.imgChassis3,
      chassis_4: $scope.imgChassis4,
      chassis_5: $scope.imgChassis5,
      chassis_6: $scope.imgChassis6,
      chassis_7: $scope.imgChassis7,
      chassis_8: $scope.imgChassis8,
      chassis_9: $scope.imgChassis9,
      chassis_10: $scope.imgChassis10,
      chassis_11: $scope.imgChassis11,
      chassis_12: $scope.imgChassis12,
      chassis_13: $scope.imgChassis13,
      chassis_14: $scope.imgChassis14,
      chassis_15: $scope.imgChassis15,
      chassis_16: $scope.imgChassis16,
      chassis_17: $scope.imgChassis17,
      chassis_18: $scope.imgChassis18,
      chassis_19: $scope.imgChassis19,
      chassis_20: $scope.imgChassis20,
      chassis_rating: $scope.chassisRating,
      has_front_axle_intact: $scope.data.has_front_axle_intact,
      has_leaf_spring_front_left_intact: $scope.data.has_leaf_spring_front_left_intact,
      has_air_brake_and_pipe_front_left_intact: $scope.data.has_air_brake_and_pipe_front_left_intact,
      has_left_wheel_hydraulic_system_intact: $scope.data.has_left_wheel_hydraulic_system_intact,
      has_left_hydraulic_wheel_air_brake_and_pipe_intact: $scope.data.has_left_hydraulic_wheel_air_brake_and_pipe_intact,
      has_gear_box_intact: $scope.data.has_gear_box_intact,
      has_shaft_intact: $scope.data.has_shaft_intact,
      has_differential_intact: $scope.data.has_differential_intact,
      has_rear_axle_power_intact: $scope.data.has_rear_axle_power_intact,
      has_leaf_spring_right_tyre_power_intact: $scope.data.has_leaf_spring_right_tyre_power_intact,
      has_leaf_spring_right_tyre_intact: $scope.data.has_leaf_spring_right_tyre_intact,
      has_rear_axle_intact: $scope.data.has_rear_axle_intact,
      has_leaf_spring_left_tyre_power_intact: $scope.data.has_leaf_spring_left_tyre_power_intact,
      has_leaf_spring_left_tyre_intact: $scope.data.has_leaf_spring_left_tyre_intact,
      has_right_wheel_hydraulic_system_intact: $scope.data.has_right_wheel_hydraulic_system_intact,
      has_right_hydraulic_wheel_air_brake_and_pipe_intact: $scope.data.has_right_hydraulic_wheel_air_brake_and_pipe_intact,
      has_leaf_spring_front_right_intact: $scope.data.has_leaf_spring_front_right_intact,
      has_air_brake_and_pipe_front_right_intact: $scope.data.has_air_brake_and_pipe_front_right_intact,
      has_steering_box_intact: $scope.data.has_steering_box_intact,
      has_drag_link_intact: $scope.data.has_drag_link_intact
    };
    $http.post(sectionsLink + $rootScope.truck.id, {
      chassis_section: chassisDetails
    }).then(function(res) {
      if (res.status == 200) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Chassis Pics Uploaded Successfully!!'
        });
        $location.path('/tab/truck/engine');
      }
    });
  };
})

.controller('EngineCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.data = {
    is_starter_working: true,
    is_air_compressor_working: true,
    is_fuel_system_working: true,
    is_exhaust_system_intact: true,
    is_radiator_intact: true,
    are_fuel_leaks_visible: false,
    are_oil_leaks_visible: false,
    are_cooling_system_leaks_visible: false,
    is_blow_back_visible: false
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

  $scope.takePictureEngine1 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgEngine1 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureEngine2 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgEngine2 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };


  $scope.uploadEnginePics = function() {
    $ionicLoading.show({
      template: 'Uploading Engine Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });
    var engineDetails = {
      engine_1: $scope.imgEngine1,
      engine_2: $scope.imgEngine2,
      is_starter_working: $scope.data.is_starter_working,
      is_air_compressor_working: $scope.data.is_air_compressor_working,
      is_fuel_system_working: $scope.data.is_fuel_system_working,
      is_exhaust_system_intact: $scope.data.is_exhaust_system_intact,
      is_radiator_intact: $scope.data.is_radiator_intact,
      are_fuel_leaks_visible: $scope.data.are_fuel_leaks_visible,
      are_oil_leaks_visible: $scope.data.are_oil_leaks_visible,
      are_cooling_system_leaks_visible: $scope.data.are_cooling_system_leaks_visible,
      is_blow_back_visible: $scope.data.is_blow_back_visible,
      engine_rating: $scope.engineRating
    };
    $http.post(sectionsLink + $rootScope.truck.id, {
      engine_section: engineDetails
    }).then(function(res) {
      if (res.status == 200) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Engine Pics Uploaded Successfully!!'
        });
        $location.path('/tab/truck/cabin');
      }
    });
  };
})

.controller('CabinCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.data = {
    is_main_panel_intact: true,
    is_instrument_panel_intact: true,
    is_accelerator_brake_and_clutch_intact: true,
    are_warning_lights_working: true,
    is_odometer_working: true,
    is_park_brake_working: true
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

  $scope.takePictureCabin1 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin1 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin2 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin2 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin3 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin3 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin4 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin4 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin5 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin5 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin6 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin6 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin7 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin7 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin8 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin8 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureCabin9 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgCabin9 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadCabinPics = function() {
    $ionicLoading.show({
      template: 'Uploading Cabin Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });
    var cabinDetails = {
      cabin_1: $scope.imgCabin1,
      cabin_2: $scope.imgCabin2,
      cabin_3: $scope.imgCabin3,
      cabin_4: $scope.imgCabin4,
      cabin_5: $scope.imgCabin5,
      cabin_6: $scope.imgCabin6,
      cabin_7: $scope.imgCabin7,
      cabin_8: $scope.imgCabin8,
      cabin_9: $scope.imgCabin9,
      is_main_panel_intact: $scope.data.is_main_panel_intact,
      is_instrument_panel_intact: $scope.data.is_instrument_panel_intact,
      is_accelerator_brake_and_clutch_intact: $scope.data.is_accelerator_brake_and_clutch_intact,
      are_warning_lights_working: $scope.data.are_warning_lights_working,
      is_odometer_working: $scope.data.is_odometer_working,
      is_park_brake_working: $scope.data.is_park_brake_working,
      cabin_rating: $scope.cabinRating,
      km_driven: $scope.data.km_driven
    };
    $http.post(sectionsLink + $rootScope.truck.id, {
      cabin_section: cabinDetails
    }).then(function(res) {
      $ionicLoading.hide();
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Cabin Pics Uploaded Successfully!!'
        });
        $location.path('/tab/truck/tyres');
      }
    });
  };
})

.controller('TyresCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.takePictureTyres1 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres1 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres2 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres2 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres3 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres3 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres4 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres4 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres5 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres5 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres6 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres6 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres7 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres7 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres8 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres8 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePictureTyres9 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgTyres9 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadTyresPics = function() {
    $ionicLoading.show({
      template: 'Uploading Tyres Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });
    var tyresDetails = {
      tyres_1: $scope.imgTyres1,
      tyres_2: $scope.imgTyres2,
      tyres_3: $scope.imgTyres3,
      tyres_4: $scope.imgTyres4,
      tyres_5: $scope.imgTyres5,
      tyres_6: $scope.imgTyres6,
      tyres_7: $scope.imgTyres7,
      tyres_8: $scope.imgTyres8,
      tyres_9: $scope.imgTyres9
    };
    $http.post(sectionsLink + $rootScope.truck.id, {
      tyresSection: tyresDetails
    }).then(function(res) {
      $ionicLoading.hide();
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Tyres Pics Uploaded Successfully!!'
        });
        $location.path('/tab/truck/final');
      }
    });
  };
})

.controller('FinalCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
  $scope.done = function() {
    $http.post(rootLink + "/api/v0/trucks/update/" + $rootScope.truck.id, {
      truck: {
        status: "Inspected"
      }
    }).then(function(res) {
      if (res.status == 200) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Truck Updated Successfully!!'
        });
        $location.path('/tab/search');
      }
    });
  };
})

.controller('TruckImgCtrl', function($rootScope, $scope, $cordovaCamera, $http, $location, $ionicPopup, $ionicLoading) {
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
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI14 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadTransmissionPics = function() {
    $ionicLoading.show({
      template: 'Uploading Transmission Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });
    var images = {
      transmission_1: $scope.imgURI14,
      transmission_description: $scope.data.transmissionDescription,
      transmission_rating: $scope.transmissionRating
    };
    $http.post(sectionsLink + $rootScope.truck.id, {
      "truck": images
    }).then(function(res) {
      $ionicLoading.hide();
      if (res.status == 200) {
        $ionicPopup.alert({
          title: 'Upload Status',
          template: 'Transmission Pics Uploaded Successfully!!'
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
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI19 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture20 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI20 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture21 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI21 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture22 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI22 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture23 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI23 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture24 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI24 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture25 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI25 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.takePicture26 = function() {
    var options = getCameraOptions(Camera, CameraPopoverOptions);
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI26 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  };

  $scope.uploadTyrePics = function() {
    $ionicLoading.show({
      template: 'Uploading Tyre Pics<br><br><ion-spinner icon="android"></ion-spinner>'
    });

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
    $http.post(sectionsLink + $rootScope.truck.id, {
      "truck": images
    }).then(function(res) {
      $ionicLoading.hide();
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
});
