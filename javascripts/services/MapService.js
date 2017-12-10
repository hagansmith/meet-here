

app.service("MapService", function ($http, $q, FIREBASE_CONFIG, MAP_CONFIG){

  const saveMeetInfo = (meet) => {
    let meetObject = {
      "history": meet.history,
      "routeBy": meet.routeBy,
      "uid": meet.uid,
      "where": meet.where,
      "name": meet.name,
      "when": meet.min
    };
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/meets.json`, JSON.stringify(meetObject));
  };

  const saveMarkerInfo = (meet, meetMarkers, meetId) => {
    let markerObject1 = {
      "meetid" : meetId,
      "address" : meet.marker1,
      "lat": meetMarkers.marker1.pos.lat,
      "lng": meetMarkers.marker1.pos.lng
    };

    let markerObject2 = {
      "meetid" : meetId,
      "address" : meet.marker2,
      "lat": meetMarkers.marker2.lat,
      "lng": meetMarkers.marker2.lng
    };
  return $http.post(`${FIREBASE_CONFIG.databaseURL}/markers.json`, JSON.stringify(markerObject1)).then((result) =>{
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/markers.json`, JSON.stringify(markerObject2));
    });
  };

  const saveLocationInfo = (midpoint, meetId) => {
    let locationObject = {
      "meetid" : meetId,
      "lat" : midpoint.lat(),
      "lng" : midpoint.lng()
    };
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/meetLocations.json`, JSON.stringify(locationObject));
  };

  const getCurrentMeet = (meetId) => {
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`).then((meet) =>{
    resolve(meet.data);
  }).catch((error)=>{
      console.log("error in service getCurrentMeet", error);
    });
  });
};

  const getMarkersByMeetId = (meetId) => {
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/markers.json?orderBy="meetid"&equalTo="${meetId}"`).then((markers) =>{
        resolve(markers.data);
    }).catch((error)=>{
        console.log("error in service getMarkersByMeetId", error);
    });
  });
};

const getMeetLocationsByMeetId = (meetId) => {
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/meetLocations.json?orderBy="meetid"&equalTo="${meetId}"`).then((meetLocations) => {
        resolve(meetLocations.data);
    }).catch((error)=>{
      console.log("error in service getMeetLocationsByMeetId", error);
    });
  });
};

const getAllMapDataForCurrentMeet = (meetId) => {
  let meetData = {};
    return $q((resolve, reject) => {
      return getCurrentMeet(meetId)
    .then((meet) => {
      Object.keys(meet).forEach((key)=>{
        meetData[key] = meet[key];
      });
      return getMarkersByMeetId(meetId);
    }).then((markers)=>{
      let markersArray = [];
      Object.keys(markers).forEach((key)=>{
        markers[key].id = key;
        markersArray.push(markers[key]);
      });
      meetData.marker1 = markersArray[0];
      meetData.marker2 = markersArray[1];
      return getMeetLocationsByMeetId(meetId);
    }).then((locations)=>{
      let locationArray = [];
      Object.keys(locations).forEach((key)=>{
        locations[key].id = key;
        locationArray.push(locations[key]);
      });
        meetData.location = locationArray[0];
      resolve(meetData);
    }).catch((error) => {
      console.log("error in service getAllMapDataForCurrentMeet", error);
    });
  });
};

const getMeetInfoByUid = (userUid) => {
  let meets = [];
  return $q((resolve, reject) => {
    $http.get(`${FIREBASE_CONFIG.databaseURL}/meets.json?orderBy="uid"&equalTo="${userUid}"`).then((results)=>{
      let fbMeets = results.data;
      Object.keys(fbMeets).forEach((key) => {
          getAllMapDataForCurrentMeet(key).then((mapData)=>{
          meets.push(mapData);
        });
      });
      resolve (meets);
    }).catch((err)=>{
      reject(err);
    });
  });
};

  const updateMeet = (meet, meetId, userUid) => {
    let meetObject = {
      "history": meet.history,
      "routeBy": meet.routeBy,
      "uid": userUid,
      "where": meet.where,
      "saved": meet.saved,
      "name":meet.name,
      "when":meet.when
    };
      return $http.put(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`, JSON.stringify(meetObject));
  };



  const deleteMeet = (meetId) => {
    return $http.delete(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`);
  };

  const getCoordByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
  };

  const reverseGeocode = (coord) => {
    return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=${MAP_CONFIG}`);
  };

  const midPointLocator = (meet) => {
    console.log("meet info at midPoint", meet);
  };

  const saveReadableAddressToDataBase = (address) => {
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/meets.json`, JSON.stringify(meet));
  };

  const editMeetInfo = (meet, meetId, originalMeet) => {
    if (!meet) {
      console.log("no change");
      return;
    } else {
    let meetObject = {
      "where": meet.where,
      "name": meet.name,
      "when": meet.min,
      "saved": originalMeet.saved,
      "history": originalMeet.history,
      "uid": originalMeet.uid
    };
    return $http.put(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`, JSON.stringify(meetObject));
  }
  };

  const editMarkerInfo1 = (meet, originalMeet, meetMarkers) => {
    marker1 = originalMeet.marker1.id;
    if (!meetMarkers.marker1) {
      return;
    } else {
      let markerObject1 = {
        "address" : meet.marker1,
        "lat": meetMarkers.marker1.lat,
        "lng": meetMarkers.marker1.lng,
        "meetid": originalMeet.marker1.meetid
    };
      return $http.put(`${FIREBASE_CONFIG.databaseURL}/markers/${marker1}.json`, JSON.stringify(markerObject1));
  }
  };

  const editMarkerInfo2 = (meet, originalMeet, meetMarkers) => {
    marker2 = originalMeet.marker2.id;
    if (!meetMarkers.marker2) {
      return;
    } else {
      let markerObject2 = {
        "address" : meet.marker2,
        "lat": meetMarkers.marker2.lat,
        "lng": meetMarkers.marker2.lng,
        "meetid": originalMeet.marker2.meetid
    };
      return $http.put(`${FIREBASE_CONFIG.databaseURL}/markers/${marker2}.json`, JSON.stringify(markerObject2));
  }
};

  return { deleteMeet,  editMeetInfo, editMarkerInfo1, editMarkerInfo2, getCoordByAddressQuery, getAllMapDataForCurrentMeet, getMeetInfoByUid, midPointLocator, reverseGeocode, saveReadableAddressToDataBase, saveLocationInfo, saveMarkerInfo, saveMeetInfo, updateMeet };

});
