$(document).ready(function() {
    window.temples = ['Tirupati', 'Abra'];
    $('#input').keyup(function() {
        var input = $('#input').val();
        $.ajax({
            url: 'index.html',
            data: 'input =' + input,
            success: function(msg) {
                console.log(msg);
            }
        })
    })
});