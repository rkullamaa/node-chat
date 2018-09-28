var socket = io();
function scrollToBottom () {
    // Selectors
    var message = jQuery('#message');
    var newMessage = message.children('li:last-child');
    // Heights
    var clientHeight = message.prop('clientHeight');
    var scrollTop = message.prop('scrollTop');
    var scrollHeight = message.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeigth = newMessage.prev().innerHeight();
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeigth >= scrollHeight){
        message.scrollTop(scrollHeight);  
    }
}
socket.on('connect', () =>{
    console.log('connected to server')
    
});
socket.on('disconnect', () =>{
    console.log('disconnected from server')
});


socket.on('newMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#message').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery('#message').append(html);
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