const indexedDB = window.indexedDB;
let db,

   request = indexedDB.open("budget", 1);

    
   request.onupgradeneeded = function(e) {
    const db = request.result;
    db.createObjectStore("pending",{autoIncrement:true});
  };

    request.onerror = function(e) {
      console.log("There was an error");
    };

    request.onsuccess = function(e) {
      db = request.result;

      if (navigator.onLine) {
        checkDatabase();
      }
      // db.onerror = function(e) {
      //   console.log("error");
      // };
      // if (method === "put") {
      //   store.put(object);
      // } else if (method === "get") {
      //   const all = store.getAll();
      //   all.onsuccess = function() {
      //     resolve(all.result);
      //   };
      // } else if (method === "delete") {
      //   store.delete(object._id);
      // }
      // tx.oncomplete = function() {
      //   db.close();
      // };
    };

    function saveRecord (record) {
      const transaction = db.transaction(["pending"],"readwrite");
      const store = transaction.objectStore("pending");
      store.add(record)
    } 

    function checkDatabase () {
      const transaction = db.transaction(["pending"],"readwrite");
      const store = transaction.objectStore("pending");
      const getAll = store.getAll();

      getAll.onsuccess = function () {
        if(getAll.result.length > 0) {
          fetch("/api/transaction/bulk",{
            method:"POST",
            body: JSON.stringify(getAll.results),
            headers: {
              Accept: "application/json, text/plain, */*", 
              "content-type":"application/json"
            }
          })
          .then(response => {
            return response.json()
          })
          .then(()=>{
            const transaction = db.transaction(["pending"],"readwrite");
            const store = transaction.objectStore("pending");
        
            store.clear()
          })
        }
      }
    }
window.addEventListener("online", checkDatabase);