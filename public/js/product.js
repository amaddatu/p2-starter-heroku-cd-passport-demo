$( document ).ready(function() {
    $("[name='product-form']").on('submit', function(event){
        event.preventDefault();
        // console.log("submit detected");
        // console.log(this);
        var productData = {
            name: $(this).find("[name='name']").val(),
            description: $(this).find("[name='description']").val(),
            price: $(this).find("[name='price']").val()
        };
        $.ajax({
            url: "/api/product",
            method: "POST",
            dataType: "json",
            data: productData
        }).then(function(result){
            console.log(result);
        }).catch(function(err){
            console.log(err);
        });
    });
});