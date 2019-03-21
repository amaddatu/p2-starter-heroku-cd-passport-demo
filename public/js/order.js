$( document ).ready(function() {
    $("[name='order-form']").on('submit', function(event){
        event.preventDefault();
        // console.log("submit detected");
        // console.log(this);
        var orderData = {
            description: $(this).find("[name='description']").val()
        };
        $.ajax({
            url: "/api/order",
            method: "POST",
            dataType: "json",
            data: orderData
        }).then(function(result){
            console.log(result);
        }).catch(function(err){
            console.log(err);
        });
    });
});