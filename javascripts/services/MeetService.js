"use strict";

app.service("MapService", function ($http, FIREBASE_CONFIG){

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

});
