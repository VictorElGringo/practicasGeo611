const listaloggedout = document.querySelectorAll('.logged-out');
const listaloggedin = document.querySelectorAll('.logged-in');

auth.onAuthStateChanged(user =>{
    console.log(user);
    if(user){
        if(navigator.geolocation){
            
            navigator.geolocation.getCurrentPosition(position =>{
                var pos = {
                    lat : position.coords.latitude,
                    lng : position.coords.longitude
                };
                console.log(pos);
    
                db.collection('usuarios').doc(user.uid).update({
                    coordenadas : pos
                });
    
            })
        }
        
        db.collection('usuarios').doc(user.uid).onSnapshot( snapshot =>{
            obtieneAmigos(snapshot.data());
            console.log(snapshot.data());
        });
        
        listaloggedin.forEach( item => item.style.display = 'block');
        listaloggedout.forEach( item => item.style.display = 'none');

    }else{
        listaloggedin.forEach( item => item.style.display = 'none');
       listaloggedout.forEach( item => item.style.display = 'block');
    }
});

const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', (e)=>{
    e.preventDefault();

    let correo = formLogin['correo'].value;
    let contrasena = formLogin['contrasena'].value;

    auth.signInWithEmailAndPassword(correo, contrasena).then(cred =>{
        console.log(cred);

        $('#ingresarModal').modal('hide');
        formLogin.reset();
        formLogin.querySelector('.error').innerHTML="";
    }).catch(err => {
        formLogin.querySelector('.error').innerHTML=mensajeError(err.code);
        console.log(err);
    });
});

function mensajeError(codigo){
    let message = '';
    switch(codigo){
        case 'auth/wrong-password':
            message = "Su contrasena no es correcta";
        break;
        case 'auth/user-not-found':
            message = "Usuario no encontrado";
        break;
        case 'auth/weak-password':
            message = "Contrasena debil";
        break;
       default: 
        message = 'Ocurrio un error al ingresar con este usuario'; 

    }

    return message;
}

const salir = document.getElementById('salir');

salir.addEventListener('click', (e)=>{
    e.preventDefault();

    listaloggedin.forEach( item => item.style.display = 'none');
    listaloggedout.forEach( item => item.style.display = 'block');

    auth.signOut().then( ()=>{
            alert('You have closed the sesion');
    });
});

