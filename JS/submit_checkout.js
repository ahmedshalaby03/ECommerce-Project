const scriptURL = "https://script.google.com/macros/s/AKfycbwjFK_EXI0tENRbKyjigfqxfaSFc5Hcipg6DmLZhvJzR40a9yLb3Jqfv1fr39dCfeSB/exec"
let form = document.getElementById("form_contact");

form.addEventListener("submit" , (e)=> {
    e.preventDefault();
    fetch(scriptURL, {
        method:"POST",
        body: new FormData(form),
    })
    .then((response)=>{
        setTimeout(() => {
            localStorage.removeItem("cart")
            window.location.reload()
        }, 100);
    })
    .catch((error) => console.log("something wrong!" , error.message));
})
