const eventLists = document.querySelector("#eventLists");
const inputForm = document.querySelector("#addEventForm");
const add = document.querySelector("#add");
const update = document.querySelector("#update");
const clear = document.querySelector("#clear");

let updating = false;
let eventUpdateId = "";

const renderEvent = function(item) {
  const li = document.createElement("li");
  li.setAttribute("data-id", item.id);

  const h3 = document.createElement("h3");
  h3.textContent = item.data().name;

  const span = document.createElement("span");
  span.textContent = item.data().date.toDate();

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  `;
  deleteButton.classList = "delete";

  const editButton = document.createElement("button");
  editButton.innerHTML = `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `;
  editButton.classList = "edit";

  const firstDiv = document.createElement("div");
  const secondDiv = document.createElement("div");
  secondDiv.classList = "list-options";

  firstDiv.appendChild(h3);
  firstDiv.appendChild(span);
  li.appendChild(firstDiv);

  secondDiv.appendChild(deleteButton);
  secondDiv.appendChild(editButton);
  li.appendChild(secondDiv);

  eventLists.appendChild(li);

  //  Delete Button
  deleteButton.addEventListener("click", e => {
    e.stopPropagation();
    db.collection("events")
      .doc(item.id)
      .delete();
  });

  // Set Event to Update
  editButton.addEventListener("click", () => {
    inputForm.addEventName.value = item.data().name;
    inputForm.addEventDate.value = item
      .data()
      .date.toDate()
      .toISOString()
      .slice(0, 10);

    add.style.display = "none";
    update.style.display = "block";
    updating = true;
    eventUpdateId = item.id;
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

// Fetch events and Listen for changes
db.collection("events")
  .orderBy("date")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      // console.log(change);
      if (change.type === "added") {
        // if adding event
        renderEvent(change.doc);
      } else if (change.type === "removed") {
        // if removing event
        const li = document.querySelector(`[data-id="${change.doc.id}"]`);
        eventLists.removeChild(li);
      } else if (change.type === "modified") {
        //  we updating event
        const li = document.querySelector(`[data-id="${change.doc.id}"]`);
        eventLists.removeChild(li);
        renderEvent(change.doc);
      }
    });
    // console.log(snapshot.docChanges());
  });

//  This event Handles input form SUBMIT
inputForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!updating) {
    // Adding New Event
    db.collection("events").add({
      name: inputForm.addEventName.value,
      date: firebase.firestore.Timestamp.fromDate(
        new Date(inputForm.addEventDate.value)
      )
    });
  } else {
    // Updating Existing Event
    updating = false;
    add.style.display = "block";
    update.style.display = "none";
    db.collection("events")
      .doc(eventUpdateId)
      .update({
        name: inputForm.addEventName.value,
        date: firebase.firestore.Timestamp.fromDate(
          new Date(inputForm.addEventDate.value)
        )
      });
  }
  inputForm.reset();
});

clear.addEventListener("click", e => {
  e.stopPropagation();
  inputForm.reset();
  add.style.display = "block";
  update.style.display = "none";
});
