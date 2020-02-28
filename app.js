db.collection("events")
  .get()
  .then(snapshot => {
    // console.log(snapshot.docs); //shows data
    snapshot.docs.forEach(doc => {
      console.log(doc.data());
    });
  });
