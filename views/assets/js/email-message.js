(function() {

    const queryString = window.location.search;
    console.log(queryString)
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams)
    let isSuccessSTR = urlParams.get('success')


    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }

    if(isSuccessSTR!=null){
        let isSuccess = isSuccessSTR=='true' ? true : false;
        currURL = window.location.href;
        var url = (currURL.split(window.location.host)[1]).split("?")[0];
        window.history.pushState({}, document.title, url);
        if(isSuccess==true){
            toastr["success"]("Thanks, we received your email.");
        }else if(isSuccess==false){
            toastr["error"]("There is a problem sending mail at this moment.");
        }
 
       
    }


})();