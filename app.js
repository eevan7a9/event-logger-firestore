const eventLists = document.querySelector("#eventLists");
const addForm = document.querySelector("#addEventForm");

const renderEvent = function(item) {
  const li = document.createElement("li");
  li.setAttribute("data-id", item.id);

  const h3 = document.createElement("h3");
  h3.textContent = item.data().name;

  const span = document.createElement("span");
  span.textContent = item.data().date.toDate();

  const button = document.createElement("button");
  button.textContent = "x";

  const div = document.createElement("div");

  div.appendChild(h3);
  div.appendChild(span);

  li.appendChild(div);
  li.appendChild(button);
  eventLists.appendChild(li);

  button.addEventListener("click", e => {
    e.stopPropagation();
    db.collection("events")
      .doc(item.id)
      .delete();
  });
};

// db.collection("events")
//   .orderBy("date")
//   .get()
//   .then(snapshot => {
//     // console.log(snapshot.docs); //shows data
//     snapshot.docs.forEach(doc => {
//       renderEvent(doc);
//     });
//   });

db.collection("events")
  .orderBy("date")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      console.log(change);
      if (change.type === "added") {
        renderEvent(change.doc);
      } else if (change.type === "removed") {
        const li = document.querySelector(`[data-id="${change.doc.id}"]`);
        eventLists.removeChild(li);
      }
    });
    // console.log(snapshot.docChanges());
  });

addForm.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("events").add({
    name: addForm.addEventName.value,
    date: firebase.firestore.Timestamp.fromDate(
      new Date(addForm.addEventLocation.value)
    )
  });
  addForm.reset();
});
