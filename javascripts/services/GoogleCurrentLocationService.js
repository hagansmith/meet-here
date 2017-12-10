
app.service("GoogleCurrentLocationService", function (){

// use current location to fill in address
  const locateDevice = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
          return({ pos });
    });
  }
};

return {locateDevice};

});
