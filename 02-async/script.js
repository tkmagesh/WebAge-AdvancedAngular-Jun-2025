(function(){
    // sync
    function add(x,y){
        console.log("   [add] operation started")
        var result = x + y;
        console.log("   [add] operation completed");
        return result
    }

    function addClient(x,y){
        console.log('[addClient] operation initiated')
        var result = add(100,200)
        console.log('result =', result)
        console.log("[addClient] operation done");
    }

    window['addClient'] = addClient

    // async
    function addAsync(x, y) {
      console.log("   [add] operation started");
      setTimeout(() => {
        var result = x + y;
        console.log("   [add] operation completed");
        return result;  
      }, 4000);
      
    }

    function addAsyncClient(x, y) {
      console.log("[addClient] operation initiated");
      var result = addAsync(100, 200);
      console.log("result =", result);
      console.log("[addClient] operation done");
    }

    window["addAsyncClient"] = addAsyncClient;

})()
