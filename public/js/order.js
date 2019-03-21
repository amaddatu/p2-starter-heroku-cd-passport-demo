$( document ).ready(function() {
    $("[name='order-form']").on('submit', function(event){
        event.preventDefault();
        // console.log("submit detected");
        // console.log(this);
        var items = {};
        var productIds = $("[name='product-id[]']");
        $("[name='product-id[]']").each(function(index){
            //console.log($(this).val());
            var id = parseInt($(this).val());
            var qty = parseInt($("[name='quantity[" + id + "]").val());
            items[index] = {
                quantity: qty,
                itemId: id
            };
        });
        var orderData = {
            description: $(this).find("[name='description']").val(),
            items: items
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