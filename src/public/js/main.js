// jquery data
$(document).ready(function() {
    console.log("Abra");
    window.temples = ['Tirupati', 'Abra'];
    $('#input').keyup(function() {
        var input = $('#input').val();
        $.ajax({
            url: '/',
            data: 'input =' + input,
            limit: 10,
            success: function(msg) {
                console.log(msg);
            }
        })
    })
});