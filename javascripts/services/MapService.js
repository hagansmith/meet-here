

app.service("MapService", function ($http, $q, FIREBASE_CONFIG, MAP_CONFIG){

  const saveQuery = (meet) => {
    //convert standard data to coordinates then post
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/meets.json`, JSON.stringify(meet));
  };

  const getCurrentMeet = (meetId) => {
    console.log("in current meet", meetId);
    //return $http.get(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`);
  };

  // const getCurrentMeet = () => {
  //   let currentMeetDetail = [];
  //   return $q((resolve, reject) => {
  //     $http.get(`${FIREBASE_CONFIG.databaseURL}/meets.json?&equalTo="${$routeParams.id}"`).then((results)=>{
  //       let fbMovies = results.data;
  //       Object.keys(fbMovies).forEach((key) => {
  //         fbMovies[key].id = key;
  //         if (fbMovies[key].isWatched) {
  //           movies.push(fbMovies[key]);
  //         }
  //         resolve(movies);
  //       });
  //         }).catch((err)=>{
  //         reject(err);
  //     });
  //   });
  // };


  const getMapByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
    };

    return { getCurrentMeet, getMapByAddressQuery, saveQuery };

});
