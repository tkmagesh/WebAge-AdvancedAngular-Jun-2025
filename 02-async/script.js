(function(){
  // sync
  function add(x, y) {
    console.log("   [add] operation started");
    var result = x + y;
    console.log("   [add] operation completed");
    return result;
  }

  function addClient(x, y) {
    console.log("[addClient] operation initiated");
    var result = add(100, 200);
    console.log("result =", result);
    console.log("[addClient] operation done");
  }

  window["addClient"] = addClient;

  // async (using callbacks)
  function addAsync(x, y, callbackFn) {
    console.log("   [add] operation started");
    setTimeout(() => {
      var result = x + y;
      console.log("   [add] operation completed");
      // return result;
      callbackFn(result);
    }, 4000);
  }

  function addAsyncClient(x, y) {
    console.log("[addClient] operation initiated");
    addAsync(x, y, function (result) {
      console.log("result =", result);
      console.log("[addClient] operation done");
    });
  }
  window["addAsyncClient"] = addAsyncClient;

  // async (using Promise)
  function addAsyncPromise(x, y) {
    console.log("   [add] operation started");
    var p = new Promise(function(resolveFn, rejectFn){
        setTimeout(() => {
          var result = x + y;
          resolveFn(result);
          console.log("   [add] operation completed");
        }, 4000);
    })
    return p;
  }

  window["addAsyncPromise"] = addAsyncPromise;

  /* function addAsyncPromiseClient(x, y) {
    console.log("[addClient] operation initiated");
    var p = addAsyncPromise(x, y)
    p.then(function (result) {
      console.log("result =", result);
      console.log("[addClient] operation done");
    }); 
   return p
  } */

    // using async-await (high level language feature for "promise consumption")
  async function addAsyncPromiseClient(x, y) {
    console.log("[addClient] operation initiated");
    /* 
    var p = addAsyncPromise(100, 200);
    var result = await p 
    */
    var result = await addAsyncPromise(x,y)
    console.log("result =", result);
    console.log("[addClient] operation done");
  }

  window["addAsyncPromiseClient"] = addAsyncPromiseClient;

  
})()
