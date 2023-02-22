const form = document.querySelector("form");

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.value) {
      alert("Please fill something...");
    }
    const data = new FormData(form);
    form.reset();

    const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key1: data.get("key1"),
          prompt: data.get("prompt")
        }),
      });

    //   if (response.ok) {
    //     const data = await response.json();
    //     const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
    
    //     typeText(messageDiv, parsedData);
    //   } else {
    //     const err = await response.text();
    
    //     messageDiv.innerHTML = "Something went wrong";
    //     alert(err);
    //   }

}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});