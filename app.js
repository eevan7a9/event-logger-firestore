const eventLists = document.querySelector("#eventLists");

const renderEvent = function(item) {
  console.log(item);
  const li = document.createElement("li");
  li.setAttribute("data-id", item.id);

  const h3 = document.createElement("h3");
  h3.textContent = item.name;

  const span = document.createElement("span");
  span.textContent = item.date.toDate();

  const button = document.createElement("button");
  button.textContent = "x";

  const div = document.createElement("div");

  div.appendChild(h3);
  div.appendChild(span);

  li.appendChild(div);
  li.appendChild(button);
  eventLists.appendChild(li);
};

db.collection("events")
  .get()
  .then(snapshot => {
    // console.log(snapshot.docs); //shows data
    snapshot.docs.forEach(doc => {
      renderEvent(doc.data());
    });
  });
