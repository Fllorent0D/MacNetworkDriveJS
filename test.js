const macDrives = require("./index.js")

macDrives.mount("\\\\10.3.1.171\\t_redhat_florent", undefined, "admin", "password").then(result=>{
  console.log(result)
}).catch(err => {
  console.log(err);
})

let test = macDrives.find("\\\\10.3.1.171\\t_redhat_florent").then(result=>{
  console.log("Trouvé : " + result);
}).catch(err => {
  console.log("Erreur : " + err);

})
