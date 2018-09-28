var socket = io();
socket.on('connect', () =>{
    console.log('connected to server')
    
});
socket.on('disconnect', () =>{
    console.log('disconnected from server')
});


socket.on('newMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#message').append(li);
});

socket.on('newLocationMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">my current loc</a>');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#message').append(li);
})
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'user',
        text: jQuery('[name=message]').val()
    }, function (){
        jQuery('[name=message]').val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    };
    navigator.geolocation.getCurrentPosition(function (position){
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });

    }, function (){
        alert('unable to fetch location');
    })
});