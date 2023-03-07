// #region installations et upload images

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 196;
var cors = require('cors');
app.use(cors());
const fs = require('fs');
/////////
const mysql = require("mysql");;
const path = require('path');
const res = require('express/lib/response');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { PrismaClient, Type } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const htmlspecialchars = require("htmlspecialchars");
const striptags = require("striptags");

//VARAIBLE API
var localhost = "http://localhost:5173" ;


// #endregion

////////////////////////////////////////////////////////////////////////////
/////////////////////////////      IMAGE      //////////////////////////////
////////////////////////////////////////////////////////////////////////////
// #region IMAGE

app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

// Add this line to serve our index.html page
app.use(express.static('thetest'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

//pour mettre un avatar
// app.post('/myupload/:iduser', async (req, res) => {
//     try{
//         var { iduser } = req.params ;
//         const { image } = req.files; //console.log(req.files);

//         if (!image) /*return res("Image not found");*/ return res.redirect('http://localhost:5173/profil/echec');

//         var extension = (/\.(gif|jpe?g|png|webp|bmp|png)$/i).test(image.name); //console.log("extension de l'image valide ? " + extension) ;
//         if(!(image.mimetype==="image/bmp" || image.mimetype==="image/gif"|| image.mimetype==="image/jpeg" || image.mimetype==="image/png")){
//             // return res.status(403).json({
//             //     error: "ERROR",
//             //     message: "formats accéptés : bmp, jpg, jpeg, png. Faire page précédante pour retourner sur le formulaire.",
//             // });
//             return res.redirect('http://localhost:5173/profil/echec');
//         };
//         var newname = "avatar_" + iduser;
//         //on trouve l'extension de l'image uploadée et on définit son nom entier avec l'extension avec le nouveau nom /
//         if ((/\.(gif)$/i).test(image.name) == true ) { image.name = newname + ".gif";} ;
//         if((/\.(jpeg)$/i).test(image.name) == true ) { image.name = newname + ".jpeg";} ;
//         if((/\.(jpg)$/i).test(image.name) == true ) { image.name = newname + ".jpg";} ;
//         if((/\.(png)$/i).test(image.name) == true ){ image.name = newname + ".png";} ;
//         if((/\.(bmp)$/i).test(image.name) == true ){ image.name = newname + ".bmp";} ;
//         //on cherche le user avec l'id entrée
//         const foundeduser = await prisma.user.findUnique({
//             where: {
//                 idUser : parseInt(iduser)
//             }
//         })
//         if(!(foundeduser)){
//             // return res.status(403).json({
//             //     error: "ERROR",
//             //     message: "utilisateur inconnu",
//             // });
//             return res.redirect('http://localhost:5173/profil/echec');
//         };

//         //on supprime l'ancien avatar du dossier s'il y en a un car valeur par defaut "null"
//         if (foundeduser.avatar !== "null"){
//             fs.unlinkSync(__dirname + '/src/components/upload/' + foundeduser.avatar);
//         }
        
//         //enfin on enregistre dans le dossier le nouvel avatar
//         image.mv(__dirname + '/src/components/upload/' + image.name);
//         //on met le nom du nouvel avatar dans la bdd
//             const user = await prisma.user.update({
//                 where: { idUser : parseInt(iduser)},
//                 data: { avatar: image.name,}
//             })

//         //si tout est ok
//             // return res.status(200).json({
//             //     success: "success",
//             //     message: "Modification faite pour l'avatar nommé : " + image.name + " (l'ancien avatar, s'il y avait, ayant été supprimée du serveur)."
//             // });

//         return res.redirect('http://localhost:5173/book');

//     }   catch (error) {
//         console.log(error);
//         // return res.status(403).json({
//         //     error: "Problem",
//         //     message: "Problem",
//         // });
//         return res.redirect('http://localhost:5173/profil/echec');
//     }
// });

//pour mettre son avatar avec une securité
app.post('/upload_my_avatar/:iduser/:mytoken', async (req, res) => {
    try{
        var { iduser, mytoken } = req.params ;
        const { image } = req.files;
        if (!image) return res.redirect(`${localhost}/profil/echec`);
        if (image.size > 1000000 ) {; 
            return res.redirect(`${localhost}/profil/echec`);
        }
        if (!mytoken) return res.redirect(`${localhost}/profil/echec`);

        var decoded = jwt.decode(mytoken);
        var idConnect = parseInt(decoded.id);
        if( idConnect != parseInt(iduser) ) return res.redirect(`${localhost}/profil/echec`);  

        var extension = (/\.(gif|jpe?g|png|webp|bmp|png)$/i).test(image.name);
        if(!(image.mimetype==="image/bmp" || image.mimetype==="image/gif"|| image.mimetype==="image/jpeg" || image.mimetype==="image/png")){
            return res.redirect(`${localhost}/profil/echec`);
        };
        var newname = "avatar_" + iduser;
        if ((/\.(gif)$/i).test(image.name) == true ) { image.name = newname + ".gif";} ;
        if((/\.(jpeg)$/i).test(image.name) == true ) { image.name = newname + ".jpeg";} ;
        if((/\.(jpg)$/i).test(image.name) == true ) { image.name = newname + ".jpg";} ;
        if((/\.(png)$/i).test(image.name) == true ){ image.name = newname + ".png";} ;
        if((/\.(bmp)$/i).test(image.name) == true ){ image.name = newname + ".bmp";} ;
        const foundeduser = await prisma.user.findUnique({
            where: {
                idUser : parseInt(iduser)
            }
        })
        if(!(foundeduser)){
            return res.redirect(`${localhost}/profil/echec`);
        };

        //on supprime l'ancien avatar du dossier s'il y en a un car valeur par defaut "null"
        if (foundeduser.avatar !== "null"){
            fs.unlinkSync(__dirname + '/src/components/upload/' + foundeduser.avatar);
        }
        
        //enfin on enregistre dans le dossier le nouvel avatar
        image.mv(__dirname + '/src/components/upload/' + image.name);
        //on met le nom du nouvel avatar dans la bdd
            const user = await prisma.user.update({
                where: { idUser : parseInt(iduser)},
                data: { avatar: image.name,}
            })

        return res.redirect(`${localhost}/`);

    }   catch (error) {
        //console.log(error);
        return res.redirect(`${localhost}/profil/echec`);
    }
});

//pour mettre un avatar avec une securité
app.post('/upload_an_avatar/:mytoken/:myid/:iduser', async (req, res) => {
    try{
        var { iduser, mytoken, myid } = req.params ;
        const { image } = req.files;

        //console.log("token : " + mytoken)
        if (!image) return res.redirect(`${localhost}/profil/echec_admin`);
        if (image.size > 1000000 ) {
            //console.log("image trop lourde : poids de " + image.size +" bytes (la limite est de 1Mo!)"); 
            return res.redirect(`${localhost}/profil/echec_admin`);
        }

        if (!mytoken) return res.redirect(`${localhost}/profil/echec_admin`);

        var decoded = jwt.decode(mytoken);
        // console.log(decoded);
        // console.log(idConnect);
        // console.log(iduser);
        var idConnect = parseInt(decoded.id);
        if( idConnect != parseInt(myid) ) return res.redirect(`${localhost}/profil/echec_admin`);

        var extension = (/\.(gif|jpe?g|png|webp|bmp|png)$/i).test(image.name);
        if(!(image.mimetype==="image/bmp" || image.mimetype==="image/gif"|| image.mimetype==="image/jpeg" || image.mimetype==="image/png")){
            return res.redirect(`${localhost}/profil/echec_admin`);
        };
        var newname = "avatar_" + iduser;
        if ((/\.(gif)$/i).test(image.name) == true ) { image.name = newname + ".gif";} ;
        if((/\.(jpeg)$/i).test(image.name) == true ) { image.name = newname + ".jpeg";} ;
        if((/\.(jpg)$/i).test(image.name) == true ) { image.name = newname + ".jpg";} ;
        if((/\.(png)$/i).test(image.name) == true ){ image.name = newname + ".png";} ;
        if((/\.(bmp)$/i).test(image.name) == true ){ image.name = newname + ".bmp";} ;
        const foundeduser = await prisma.user.findUnique({
            where: {
                idUser : parseInt(iduser)
            }
        })
        if(!(foundeduser)){
            return res.redirect(`${localhost}/profil/echec_admin`);
        };

        //on supprime l'ancien avatar du dossier s'il y en a un car valeur par defaut "null"
        if (foundeduser.avatar !== "null"){
            fs.unlinkSync(__dirname + '/src/components/upload/' + foundeduser.avatar);
        }
        
        //enfin on enregistre dans le dossier le nouvel avatar
        image.mv(__dirname + '/src/components/upload/' + image.name);
        //on met le nom du nouvel avatar dans la bdd
            const user = await prisma.user.update({
                where: { idUser : parseInt(iduser)},
                data: { avatar: image.name,}
            })

        return res.redirect(`${localhost}/`);

    }   catch (error) {
        //console.log(error);
        return res.redirect(`${localhost}/profil/echec_admin`);
    }
});


//initialiser image de profil qu'on utilisera pas le redirect veut pas et car assez d'image sur le serveur....
app.get('/initialise_image/:email', async (req, res) => {

const email = striptags(req.params.email.trim());

try{
    const foundedUser = await prisma.user.findUnique({
        where: {
            email : email,
        } 
    })
    //console.log(foundedUser);
    var new_id = foundedUser.idUser ;
    var newname = "avatar_" + new_id + ".png" ;
    // console.log("nouveau nom :" + newname)

    fs.createReadStream(__dirname + '/src/components/upload/smile-default-avatar.png').pipe(fs.createWriteStream(__dirname + '/src/components/upload/' + newname));

    const user = await prisma.user.update({
        where: { email : email },
        data: { avatar: newname}
    })

    return res.redirect(`${localhost}/`);

} catch (error) {
    res.status(403).send(`${error}`);
}
});

// #endregion


/////////////////////////////////////////////////////////////////////
/////////////////    UTILISÉS DANS L'APPLICATION    /////////////////
/////////////////////////////////////////////////////////////////////

// #region Inscription connection et affichers utilisateurs ou un seul

    //pour INSCRIRE UN NOUVEL UTILISATEUR
    app.post("/inscription", async (request, response) => {
        var { pseudo, password, role, nom, prenom, email, info_email } = request.body;
        prenom = striptags(prenom.trim());
        nom = striptags(nom.trim());
        pseudo = striptags(pseudo.trim());
        email = striptags(email);
        info_email = striptags(info_email.trim());
        password = striptags(password.trim());
        nom = striptags(nom.trim());
        // role = role;
        let user1 = {};

        try {

            if ( (!pseudo) || (!password) || (!nom) || (!prenom) || (!email) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "All argument are not fill in field",
                });
            }

            if (  ( pseudo.length > 20 )  ||  ( password.length > 20 )  ||  ( nom.length > 25 )  ||  ( prenom.length > 25 )  ||  ( email.length > 50 )  ||  ( info_email.length > 75 )  )
            {
                //console.log( "pseudo : "+ pseudo.length+"_ pwd:"+ password.length + "_ nom : "+ nom.length + "_ prenom : "+ prenom.length + "_ email : "+ email.length + "_ info : " + info_email.length)
                return response.status(403).json({
                    error: "ERROR",
                    message: "Format of your data is not accepted",
                });
            }

            if (  !(typeof pseudo === "string") || !(typeof password === "string") || !(typeof nom === "string") || !(typeof prenom === "string")  ||  !(typeof email === "string")  ||  !(typeof info_email === "string")  )
            {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Format of your data is not accepted",
                });
            }

            if((/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i).test(email) == false){
                return response.status(403).json({
                    error: "ERROR",
                    message: "Format email not valide",
                });
            } ;

            const existingUser = await prisma.User.findFirst({
                where: {
                    pseudo: pseudo,
                },
            });

            if (existingUser) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "this user is always existing with this pseudo",
                });
            }

            const existingUser2 = await prisma.User.findFirst({
                where: {
                    email: email,
                },
            });

            if (existingUser2) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "this user is always existing with this email",
                });
            }
        }

        catch (error) {
            response.status(403).send(`${error}`);
        }

        try {
            bcrypt.hash(password, 4, async function (err, hash) {
                user1 = await prisma.user.create({
                    data: {
                        prenom : prenom,
                        nom : nom,
                        pseudo: pseudo,
                        email : email,
                        info_email : info_email,
                        password: hash,
                        role: role
                    }
                })
            })

            var message = {
                pseudo: pseudo,
                message: "vous êtes inscrit"
            }  
            
            // console.log(message.message);

            if (pseudo && password && nom && prenom) {
                response.status(200).send(message);
            }
        }

        catch (error) {
            response.status(403).send(`${error}`);
        }
    })

    //info perso à jour?
    app.post('/actualisation', async (req, res) => {
        let token = req.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();
        let my_person = {
            pseudo:"",
            nom: "",
            prenom:"",
            email:"",
            info_email:"",
            avatar:"",
            role:"",
        }

        try {
            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            var id = decoded.id;
            // console.log (decoded);
        
            const foundedUser = await prisma.user.findUnique({
                where: {
                    idUser : id,
                } 
            })
            
            if (!(foundedUser)) {
                return res.status(403).json({
                    error: "ERROR",
                    message: " Not found user with this email ",
                });
            }
            my_person.pseudo = foundedUser.pseudo ;
            my_person.nom = foundedUser.nom ;
            my_person.prenom = foundedUser.prenom ;
            my_person.email = foundedUser.email ;
            my_person.info_email = foundedUser.info_email ;
            my_person.avatar = foundedUser.avatar ;
            my_person.role = foundedUser.role ;

            res.status(200).json(my_person);
        
        } catch (error) {
            res.status(403).send(`${error}`);
        }
    });

    //pour se connecter
    app.post("/login", async (request, response) => {
        var { email, password } = request.body;
        email = striptags(email.trim());
        password = striptags(password.trim());
        let user1 = {};

        try{

        if ( (!email) || (email === " ") || (email.length>50) || (!(typeof email === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " email : bad format or too long or not filled ",
            });
        }

        if ( (!password) || (password === " ") || (password.length > 20)  || (!(typeof password === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " password : bad format or too long or not filled ",
            });
        }

        const foundedUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })

        if (!(foundedUser)) {
            return response.status(403).json({
                error: "ERROR",
                message: " Not found user with this email ",
            });
        }

        bcrypt.compare(password, foundedUser.password, function (err, result) {
            if (result == true) {
                response.status(600).json({
                    token: jwt.sign(
                        {
                                pseudo: foundedUser.pseudo,
                                id: foundedUser.idUser,
                                nom: foundedUser.nom,
                                prenom: foundedUser.prenom,
                                email: foundedUser.email,
                                info_email: foundedUser.info_email,
                                role: foundedUser.role,
                                avatar: foundedUser.avatar
                        },
                        'RANDOM_TOKEN_SECRET',
                        // {
                        //     expiresIn: 60
                        // }
                        )
                    })
                }
                else {
                    return response.status(200).json({
                        error: "ERROR",
                        message: " User founded but bad password ",
                    });
                }
        });

        } catch (error) {
                response.status(403).send(`${error}`);
            }

    })

    //pour afficher tous la liste des users
    app.get('/users', async (req, res) => {
        let token = req.headers.authorization ;
        token = (token.replace('Bearer', '')).trim();

        try {

            if (!token) {
                return res.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }
            
            //console.log(token)
            var decoded = jwt.decode(token);
            //console.log(decoded)
            var role = decoded.role
        
            if (role != "ADMIN") {
                return res.status(403).json({
                    error: "ERROR",
                    message: "Vous n'êtes pas autorisé à voir ceci Désolé Admin unqiuement",
                });
            }

            const users = await prisma.user.findMany({
                orderBy: [
                    {
                    pseudo: 'desc',
                    }
                ],
            })
            //console.log(users)
            res.json(users)
        } catch (error) {
            res.status(200).send(`${error}`);
        }
    })

    //pour afficher un utilisateur
    app.get('/show_one_User/:iduser', async (req, res) => {
        let { iduser } = req.params ;
        iduser = parseInt(iduser)
        let token = req.headers.authorization ;
        token = (token.replace('Bearer', '')).trim();

        try {

            if (!token) {
                return res.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }
            
            //console.log(token)
            var decoded = jwt.decode(token);
            //console.log(decoded)
            var role = decoded.role
        
            if (!( (role == "ADMIN") || (role=="USER"))) {
                return res.status(403).json({
                    error: "ERROR",
                    message: "Vous n'êtes pas autorisé à voir ceci Désolé Admin unqiuement ICI",
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    idUser : iduser
                }
            })
            //console.log(user)
            res.json(user)
        } catch (error) {
            res.status(200).send(`${error}`);
        }
    })

// #endregion

// #region MODIFIER SUPPRIMER UTILISATEURS 

    //pour modifier son profil
    app.put("/modifyUser", async (request, response) => {
    let { new_pseudo, new_nom, new_prenom, new_email, new_info_email } = request.body;
    new_pseudo = striptags(new_pseudo);
    new_nom = striptags(new_nom);
    new_prenom = striptags(new_prenom);
    new_email = striptags(new_email);
    new_info_email = striptags(new_info_email);
    let token = request.headers.authorization ;
    let token2 = (token.replace('Bearer', '')).trim();

    try{

        if (!token) {
            return response.status(403).json({
                error: "ERROR",
                message: "Veuillez vous reconnecter",
            });
        }

        var decoded = jwt.decode(token2);
        // console.log (decoded);
        let UserId = parseInt(decoded.id);
        //console.log("ici");

        if ( (!new_pseudo) || (new_pseudo === " ") || (new_pseudo.length>20)
        || (!(typeof new_pseudo === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " pseudo : bad format or too long or not filled ",
            });
        }

        if ( (!new_nom) || (new_nom === " ") || (new_nom.length>25)
        || (!(typeof new_pseudo === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " nom : bad format or too long or not filled ",
            });
        }

        if ( (!new_prenom) || (new_prenom === " ") || (new_prenom.length>25)
        || (!(typeof new_pseudo === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " prenom : bad format or too long or not filled ",
            });
        }

        if ( (!new_email) || (new_email === " ") || (new_email.length>50)
        || (!(typeof new_pseudo === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " email : bad format or too long or not filled ",
            });
        }

        if ( (!new_info_email) || (new_info_email === " ") || (new_info_email.length>75)
        || (!(typeof new_pseudo === "string")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " info : bad format or too long or not filled ",
            });
        }


        if((/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i).test(new_email) == false){
            return response.status(403).json({
                error: "ERROR",
                message: "Format email not valide",
            });
        } ;

        if ( (!UserId) || (UserId === " ") || (UserId.length > 5)
        || (!(typeof UserId === "number")) ) {
            return response.status(403).json({
                error: "ERROR",
                message: " id : bad format or too long or not filled ",
            });
        }

        const foundedUser = await prisma.user.findUnique({
            where: {
                idUser: UserId,
            }
        })

        if (!(foundedUser)) {
            return response.status(403).json({
                error: "ERROR",
                message: " Not found user to update ",
            });
        }

        //on verifie l'existance du user avec le pseudo envoyé
        const foundedUserwithpseudo = await prisma.user.findUnique({
            where: {
                pseudo: new_pseudo,
            }
        })
        if (foundedUserwithpseudo) {
            if(foundedUserwithpseudo.idUser != UserId)
            return response.status(403).json({
                error: "ERROR",
                message: "Ce pseudo est déjà pris",
            });
        }

        //on verifie l'existance du user avec l'email envoyé
        const foundedUserwithemail = await prisma.user.findUnique({
            where: {
                email: new_email,
            }
        })
        if (foundedUserwithpseudo) {
            if(foundedUserwithemail.idUser != UserId)
            return response.status(403).json({
                error: "ERROR",
                message: "Cet email est déjà pris ",
            });
        }
                
        const user = await prisma.user.update({
            where: {
                idUser : UserId
            },
            data: {
                pseudo: new_pseudo,
                nom: new_nom,
                prenom: new_prenom,
                email : new_email,
                info_email : new_info_email
            }
        })

        return response.json("OK modification de votre profil prise en compte");

    } catch (error) {
            response.send(`${error}`);
        }
    })

    //pour modifier son profil hors mdp et role
    app.put("/modify_one_User", async (request, response) => {
        let { id_user, new_pseudo, new_nom, new_prenom, new_email, new_info_email } = request.body;
        id_user = parseInt(id_user)
        new_pseudo = striptags(new_pseudo);
        new_nom = striptags(new_nom);
        new_prenom = striptags(new_prenom);
        new_email = striptags(new_email);
        new_info_email = striptags(new_info_email);
        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try{

            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            let role = parseInt(decoded.role);

            if (decoded.role != "ADMIN") {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Vous n'avez pas l'autorisation",
                });
            }

            if ( (!new_pseudo) || (new_pseudo === " ") || (new_pseudo.length>20)
            || (!(typeof new_pseudo === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " pseudo : bad format or too long or not filled ",
                });
            }

            if ( (!new_nom) || (new_nom === " ") || (new_nom.length>25)
            || (!(typeof new_pseudo === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " pseudo : bad format or too long or not filled ",
                });
            }

            if ( (!new_prenom) || (new_prenom === " ") || (new_prenom.length>25)
            || (!(typeof new_pseudo === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " pseudo : bad format or too long or not filled ",
                });
            }

            if ( (!new_email) || (new_email === " ") || (new_email.length>50)
            || (!(typeof new_pseudo === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " pseudo : bad format or too long or not filled ",
                });
            }

            if ( (!new_info_email) || (new_info_email === " ") || (new_info_email.length>75)
            || (!(typeof new_pseudo === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " pseudo : bad format or too long or not filled ",
                });
            }

            if ( (!id_user) || (id_user === " ") || (id_user.length > 5)
            || (!(typeof id_user === "number")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " id : bad format or too long or not filled ",
                });
            }

            const foundedUser = await prisma.user.findUnique({
                where: {
                    idUser: id_user,
                }
            })

            if (!(foundedUser)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " Not found user to update ",
                });
            }

            //on verifie l'existance du user avec le pseudo envoyé
            const foundedUserwithpseudo = await prisma.user.findUnique({
                where: {
                    pseudo: new_pseudo,
                }
            })
            if (foundedUserwithpseudo) {
                if(foundedUserwithpseudo.idUser != id_user)
                return response.status(403).json({
                    error: "ERROR",
                    message: "Ce pseudo est déjà pris",
                });
            }

            //on verifie l'existance du user avec l'email envoyé
            const foundedUserwithemail = await prisma.user.findUnique({
                where: {
                    email: new_email,
                }
            })
            if (foundedUserwithpseudo) {
                if(foundedUserwithemail.idUser != id_user)
                return response.status(403).json({
                    error: "ERROR",
                    message: "Cet email est déjà pris ",
                });
            }
                    
            const user = await prisma.user.update({
                where: {
                    idUser : id_user
                },
                data: {
                    pseudo: new_pseudo,
                    nom: new_nom,
                    prenom: new_prenom,
                    email : new_email,
                    info_email : new_info_email
                }
            })

            return response.json("OK modification de votre profil prise en compte");

        } catch (error) {
                response.send(`${error}`);
            }
    })

    //pour modifier un mot de passe
    app.put("/modify_one_User_password", async (request, response) => {
        let { id_user, my_password, new_password } = request.body;
        id_user = parseInt(id_user)
        my_password = striptags(my_password);
        new_password = striptags(new_password);
        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try{

            if ( (!my_password) || (my_password === "") || (my_password.length > 20)  || (!(typeof my_password === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " my password : bad format or too long or not filled ",
                });
            }

            if ( (!new_password) || (new_password === " ") || (new_password.length > 20)  || (!(typeof new_password === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "new password : bad format or too long or not filled ",
                });
            }

            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            let id_admin = parseInt(decoded.id);

            if (decoded.role != "ADMIN") {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Vous n'avez pas l'autorisation",
                });
            }

            //on trouve l'admin
            const foundedAdmin = await prisma.user.findUnique({
                where: {
                    idUser: id_admin,
                }
            })

            if (!(foundedAdmin)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " Not user found for this token ",
                });
            }

            if (!(foundedAdmin.role == "ADMIN")) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " This user is not an admin ",
                });
            }
        
            bcrypt.compare(my_password, foundedAdmin.password, function (err, result) {
                if (result == false) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "Bad password", 
                    })
                }
            });

            //on verifie l'existance du user avec le pseudo envoyé
            const foundedUserwithID = await prisma.user.findUnique({
                where: {
                    idUser: id_user,
                }
            })
            if (!(foundedUserwithID)) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "User not found",
                    });
            }
                    
            bcrypt.hash(new_password, 4, async function (err, hash) {
                user1 = await prisma.user.update({
                    where: {
                        idUser : id_user
                    },
                    data: {
                        password: hash,
                    }
                })
            })
            return response.json("OK modification du mot de passe utilisateur");

        } catch (error) {
                response.send(`${error}`);
            }
    })
    //pour modifier mon mot de passe
    app.put("/modify_my_password", async (request, response) => {
        let { my_password, new_password } = request.body;
        my_password = striptags(my_password);
        new_password = striptags(new_password);
        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try{

            if ( (!my_password) || (my_password === "") || (my_password.length > 20)  || (!(typeof my_password === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " my password : bad format or too long or not filled ",
                });
            }

            if ( (!new_password) || (new_password === " ") || (new_password.length > 20)  || (!(typeof new_password === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "new password : bad format or too long or not filled ",
                });
            }

            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            let id_user = parseInt(decoded.id);
        
            
            //on verifie l'existance du user 
            const foundedUserwithID = await prisma.user.findUnique({
                where: {
                    idUser: id_user,
                }
            })

            if (!(foundedUserwithID)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "User not found",
                });
            }
            
            bcrypt.compare(my_password, foundedUserwithID.password, function (err, result) {
                if (result == false) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "Bad password", 
                    })
                }
            });
            
            bcrypt.hash(new_password, 4, async function (err, hash) {
                user1 = await prisma.user.update({
                    where: {
                        idUser : id_user
                    },
                    data: {
                        password: hash,
                    }
                })
            })
            return response.json("OK modification du mot de passe utilisateur");

        } catch (error) {
                response.send(`${error}`);
            }
    })

    //pour modifier un role
    app.put("/modify_one_User_role", async (request, response) => {
        let { id_user, password, role } = request.body;
        id_user = parseInt(id_user)
        password = striptags(password);
        role = striptags(role);
        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try{

            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            if (!( (role=="ADMIN")||(role=="USER") )) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "format role non accepté",
                });
            }

            var decoded = jwt.decode(token2);
            let id_admin = parseInt(decoded.id);

            if (decoded.role != "ADMIN") {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Vous n'avez pas l'autorisation",
                });
            }

            //on trouve l'admin
            const foundedAdmin = await prisma.user.findUnique({
                where: {
                    idUser: id_admin,
                }
            })

            if (!(foundedAdmin)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " Not user found for this token ",
                });
            }

            if (!(foundedAdmin.role == "ADMIN")) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " This user is not an admin ",
                });
            }
        
            bcrypt.compare(password, foundedAdmin.password, function (err, result) {
                if (result == false) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "Bad password", 
                    })
                }
            });

            //on verifie l'existance du user avec le pseudo envoyé
            const foundedUserwithID = await prisma.user.findUnique({
                where: {
                    idUser: id_user,
                }
            })
            if (foundedUserwithID) {
                if(foundedUserwithID.idUser != id_user)
                return response.status(403).json({
                    error: "ERROR",
                    message: "Ce pseudo est déjà pris",
                });
            }
                    
            const user = await prisma.user.update({
                where: {
                    idUser : id_user
                },
                data: {
                    role : role
                }
            })

            return response.json("OK modification du role d'utilisateur");

        } catch (error) {
                response.send(`${error}`);
            }
    })

    //pour supprimer un utilisateur
    app.put("/delete_user", async (request, response) => {
        let { id_user, my_password } = request.body;
        id_user = parseInt(id_user)
        my_password = striptags(my_password);
        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try{

            if ( (!my_password) || (my_password === "") || (my_password.length > 20)  || (!(typeof my_password === "string")) ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " my password : bad format or too long or not filled ",
                });
            }

            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            let id_admin = parseInt(decoded.id);

            if (decoded.role != "ADMIN") {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Vous n'avez pas l'autorisation",
                });
            }

            //on trouve l'admin
            const foundedAdmin = await prisma.user.findUnique({
                where: {
                    idUser: id_admin,
                }
            })

            if (!(foundedAdmin)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " Not user found for this token ",
                });
            }

            if (!(foundedAdmin.role == "ADMIN")) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " This user is not an admin ",
                });
            }
        
            bcrypt.compare(my_password, foundedAdmin.password, function (err, result) {
                if (result == false) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "Bad password", 
                    })
                }
            });

            //on verifie l'existance du user avec le pseudo envoyé
            const foundedUserwithID = await prisma.user.findUnique({
                where: {
                    idUser: id_user,
                }
            })
            if (!(foundedUserwithID)) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "User not found",
                    });
            }
                
                user1 = await prisma.user.delete({
                    where: {
                        idUser : id_user
                    }
                })

            return response.json("utilisateur supprimé");

        } catch (error) {
                response.send(`${error}`);
            }
    })

// #endregion

// #region COMMENTAIRES 

    //pour écrire un commentaire
    app.post("/write", async (request, response) => {
        var { idConnect, thetitle, thecomment }= request.body;
        thetitle = striptags(thetitle);
        thecomment = striptags(thecomment);
        //idConnect = parseInt(idConnect);
        // console.log("request body : " + request.body);
        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try {
            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            // console.log (decoded);
            var idConnect = parseInt(decoded.id);

            if (( !(thetitle) || !(thecomment) || !(idConnect) )) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Il manque un paramètre",
                });
            }

            if ( thetitle.length > 74 || thecomment.length > 505 || idConnect.toString().length > 5 ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "one or many input too long"+ thetitle.length + "  " + thecomment.length,
                });
            }

            if (!( typeof thetitle === "string" && typeof thecomment === "string" && typeof idConnect === "number" )) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "one or many type of input not valid",
                });
            }

            const foundedAuthor = await prisma.user.findUnique({
                where: {
                    idUser: idConnect,
                }
            })

            if (!(foundedAuthor)){
                    return response.status(403).json({
                        error: "pas d'utilisateur trouvé",
                        message: "l'utilisateur inconnu impossible de faire un commentaire",
                    });
                }
            else{
                idConnect = foundedAuthor.idUser ;
                // console.log("user is founded bravooo, nouveau request body:")
                // console.log(request.body);
            }

        }
        catch (error) {
                response.status(403).send(`${error}`);
        }

        try{
            new_comment = await prisma.comment.create({
                    data: {
                        title: thetitle,
                        comment: thecomment,
                        author: {
                            connect: {
                                idUser : idConnect
                            }
                        }
                    }
                })

            response.json("OK");
        }
        catch (error) {
            response.status(403).send(`${error}`);
        }
    })

    //pour effacer un commentaire
    app.post("/delete", async (request, response) => {

        var { id_comment }= request.body;
        id_comment = parseInt(id_comment);
        let token = request.headers.authorization ;

        try {

            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token);
            let UserRole = decoded.role;
            let UserId = decoded.id;

                if (!( id_comment )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "input(s) missed",
                    });
                }

                if (!( id_comment.toString().length < 5 )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "one or many input too long",
                    });
                }

                if (!( typeof id_comment === "number" )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "one or many type of input not valid",
                    });
                }

                var foundedComment = await prisma.comment.findUnique({
                    where: {
                        idComment: id_comment,
                    }
                })

                if (!(foundedComment)){
                    return response.status(403).json({
                        error: "ERROR",
                        message: "Comment don't  found",
                    });
                }

                if (!(UserRole == "ADMIN"  ||  UserId == foundedComment.authorId)) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "Vous n'êtes pas autorisé à supprimer ce commentaire",
                    });
                }

                var foundedComment = await prisma.comment.delete({
                    where: {
                        idComment: id_comment,
                    }
                })
                return response.json("OK delete");
            }
            catch (error) {
                response.send(`${error}`);
            }
    })

    //pour modifier un commentaire
    app.put("/modifyComment/:idComment", async (request, response) => {
        let { idComment } = request.params ;
        idComment = parseInt(idComment)

        let token = request.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        let { thetitle, thecomment }= request.body;
        thetitle = striptags(thetitle);
        thecomment = striptags(thecomment);

        try{
            if (!token) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            var idConnect = parseInt(decoded.id);
            var role = decoded.role
            

                    let my_objects = {
                        id_commentaire : idComment,
                        titre : thetitle,
                        ccommentaire : thecomment,
                        id_personne: idConnect,
                        role : role,
                        montoken : token2
                    }

            if (( !(thetitle) || !(thecomment) || !(idComment) )) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "Il manque un paramètre",
                });
            }

            if ( thetitle.length > 75 || thecomment.length > 505 && idComment.toString().length > 5 ) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "one or many input too long",
                });
            }

            if (!( typeof thetitle === "string" && typeof thecomment === "string" && typeof idComment === "number" )) {
                return response.status(403).json({
                    error: "ERROR",
                    message: "one or many type of input not valid",
                });
            }

            //on verifie l'existance du commentaire avec l'id renseigné
            const foundedComment = await prisma.comment.findUnique({
                where: {
                    idComment: idComment,
                }
            })
            if (!(foundedComment)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " Not found comment to update ",
                });
            }

            //on verifie l'existance du user avec l'id renseigné
            const foundedUser = await prisma.user.findUnique({
                where: {
                    idUser: idConnect,
                }
            })
            if (!(foundedUser)) {
                return response.status(403).json({
                    error: "ERROR",
                    message: " Not found user to update ",
                });
            }

            //on verfifie les droit de cet utilisateur sur ce commentaire
            if (((foundedUser.idUser == idConnect)|| UserRole=="ADMIN")
                )
            {
                // console.log("OK pour MODIFIER commentaire")
            }
            else{
                return response.status(403).json({
                    error: "ERROR",
                    message: " Vous n'avez pas les droits de modifications pour ce commentaire",
                });
            }

            // si tout est ok on update le commentaire
            const comment = await prisma.comment.update({
                where: {
                    idComment : idComment
                },

                data: {
                    title: thetitle,
                    comment: thecomment,
                }
            })

            return response.json("commentaire modifié avec succès");

        } catch (error) {
                response.send(`${error}`);
            }
    })

    //afficher les commentaires et savoir si j'ai aimé
    app.post('/show_comments_withID', async (req, res) => {
        var { id_liker,  }= req.body;
        id_liker = parseInt(id_liker);

        try {
            //je vais chercher la liste de mes objets commentaires
            const comments = await prisma.comment.findMany({
                orderBy: [
                    {
                        idComment: 'desc', //ou 'desc'
                    },
                ],
            })

            if (comments == ""){
                return response.status(403).json({
                    error: "ERROR",
                    message: "Aucun commentaire trouvé",
                });
            }

            if (!(comments)){
                return response.status(403).json({
                    error: "ERROR",
                    message: "On a un soucis là",
                });
            }

            // const likes = await prisma.like.findMany({
            //     orderBy: [
            //         {
            //             idLikes: 'desc', //ou 'desc'
            //         },
            //     ],
            // })

            for(var i = 0; i < comments.length; i++){
                comments[i].LikeCount = 0 ;
                    const likes = await prisma.like.findMany({
                            where: {
                                commentId: comments[i].idComment,
                            },
                    })
                if(likes.length>0)
                    {
                        comments[i].LikeCount = parseInt(likes.length);
                    }
            }

            //si je suis connectée
            if(id_liker >0){

                //je cherche un eventuel like de moi même pour chaque commentaire
                for(var i = 0; i < comments.length; i++){

                    const like = await prisma.like.findMany({
                        where: {
                            AND: [
                                { LikerId: id_liker },
                                { commentId: comments[i].idComment }
                            ]
                        }
                    })
                    //si j'ai liké j'ajoute une donnée dans l'objet du commentaire de valeur string yes
                    if(like!=""){
                        comments[i].ifilike = "yes";
                    } else{
                    //si j'ai pas liké j'ajoute une donnée dans l'objet du commentaire de valeur string no
                        comments[i].ifilike = "no";
                    }

                    const foundedTitre = await prisma.user.findUnique({
                        where: {
                            idUser: comments[i].authorId ,
                        }
                        })
                        comments[i].info_author = foundedTitre.info_email;
                }
            }
            //si je ne suis pas connectée j'ajoute la donnée de valeur string nothing
            if(id_liker == 0){
                for(var i = 0; i < comments.length; i++){
                        comments[i].ifilike = "nothing";
                }
            }
            //je recupère ma liste de commentaires avec les données ajoutées pour chacun!
            res.json(comments);

        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })

    //afficher les commentaires de quelqu'un et savoir si j'ai aimé
    app.post('/show_comments_withID_IdUser', async (req, res) => {
        var { id_liker,  }= req.body;
        id_liker = parseInt(id_liker);
        var { id_user  }= req.body;

        try {
            //je vais chercher la liste de mes objets commentaires
            const comments = await prisma.comment.findMany({
                where: {
                        authorId: parseInt(id_user)
                    },
                orderBy: {
                        idComment: 'desc', //ou 'desc'
                    }
            })
            
            if (comments == ""){
                return response.status(403).json({
                    error: "ERROR",
                    message: "Aucun commentaire trouvé",
                });
            }

            if (!(comments)){
                return response.status(403).json({
                    error: "ERROR",
                    message: "On a un soucis là",
                });
            }

            //pour compter le nombre de likes pour chaque commentaires
            for(var i = 0; i < comments.length; i++){
                comments[i].LikeCount = 0 ;
                    const likes = await prisma.like.findMany({
                            where: {
                                commentId: comments[i].idComment,
                            },
                    })
                if(likes.length>0)
                    {
                        comments[i].LikeCount = parseInt(likes.length);
                    }
            }
            
            //si je suis connectée
            if(id_liker >0){
                //je créé également un indicateur pour savoir si l'utilisateur a aimé ou non chaque commentaire
                for(var i = 0; i < comments.length; i++){
                    const like = await prisma.like.findMany({
                        where: {
                            AND: [
                                { LikerId: id_liker },
                                { commentId: comments[i].idComment }
                            ]
                        }
                    })
                    //si j'ai liké j'ajoute une donnée dans l'objet du commentaire de valeur string yes
                    if(like!=""){
                        comments[i].ifilike = "yes";
                    } else{
                    //si j'ai pas liké j'ajoute une donnée dans l'objet du commentaire de valeur string no
                        comments[i].ifilike = "no";
                    }

                    const foundedTitre = await prisma.user.findUnique({
                        where: {
                            idUser: comments[i].authorId ,
                        }
                        })
                        comments[i].info_author = foundedTitre.info_email;
                }
            }
            //si je ne suis pas connectée j'ajoute la donnée de valeur string nothing
            if(id_liker == 0){
                for(var i = 0; i < comments.length; i++){
                        comments[i].ifilike = "nothing";
                }
            }
            //je recupère ma liste de commentaires avec les données ajoutées pour chacun!
            res.json(comments);

        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })

    //afficher mes commentaires et savoir si j'ai aimé
    app.post('/show_my_comments', async (req, res) => {
        let token = req.headers.authorization ;
        let token2 = (token.replace('Bearer', '')).trim();

        try {

            if (!token) {
                return res.status(403).json({
                    error: "ERROR",
                    message: "Veuillez vous reconnecter",
                });
            }

            var decoded = jwt.decode(token2);
            var idConnect = parseInt(decoded.id);
            var role = decoded.role


            //je vais chercher la liste de mes commentaires
            const foundedComment = await prisma.comment.findMany({
            where: {
                authorId: idConnect,
            }
            })

            if (!(foundedComment)) {
                return res.status(403).json({
                    error: "ERROR",
                    message: " Not found comment to update ",
                });
            }

            //je recupère ma liste de commentaires avec les données ajoutées pour chacun!
            res.json(foundedComment);

        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })


// #endregion
 
// #region LIKE DISLIKE SHOW LIKES

    //pour faire un like
    app.post("/like", async (request, response) => {

        var { id_liker, id_comment }= request.body;
        id_liker = parseInt(id_liker);
        id_comment = parseInt(id_comment);

        // var likerPseudo;
        // var likerEmail;
        // var commentTitle;

        try {
                if (!( id_liker && id_comment )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "input(s) missed",
                    });
                }

                if (!( id_liker.toString().length < 5 && id_comment.toString().length < 5 )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "one or many input too long",
                    });
                }

                if (!( typeof id_liker === "number" && typeof id_comment === "number" )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "one or many type of input not valid",
                    });
                }

                var foundedAuthor = await prisma.user.findUnique({
                    where: {
                        idUser: id_liker,
                    }
                })

                if (!(foundedAuthor)){
                    return response.status(403).json({
                        error: "ERROR",
                        message: "User not found",
                    });
                }

                // if (foundedAuthor) {
                //     console.log(foundedAuthor)
                //     likerPseudo  = foundedAuthor.pseudo ;
                //     likerEmail = foundedAuthor.email ;
                // }

                var foundedComment = await prisma.comment.findUnique({
                    where: {
                        idComment: id_comment,
                    }
                })

                if (!(foundedComment)){
                        return response.status(403).json({
                            error: "ERROR",
                            message: "Comment not found",
                        });
                    }

                // if (foundedComment) {
                //         console.log(foundedComment)
                //         commentTitle = foundedComment.title ;
                //         console.log("le like:");
                //         var mydata = {
                //             liker: id_liker,
                //             comment:id_comment,
                //             email : likerEmail,
                //             pseudo: likerPseudo,
                //             comment_title: commentTitle
                //         }
                //         console.log(mydata);
                //      }

                    var foundedLike = await prisma.like.findMany({
                        where: {
                            AND: [
                                { LikerId: id_liker },
                                { commentId: id_comment }
                            ]
                        }
                    })

                    if (foundedLike != ""){
                        // console.log(foundedLike);
                            // console.log("liké par: " + id_liker + " commentaire : " + id_comment)
                            return response.status(403).json({
                                error: "ERROR",
                                message: "Like always exist, it's not possible to like many times one comment!",
                            });
                        }

                new_like = await prisma.Like.create({
                        data: {
                            Liker : { connect: { idUser : id_liker }},
                            Commented : { connect: { idComment : id_comment }},
                        }
                    })
                    response.json(new_like);
                }

                catch (error) {
                    response.status(403).send(`${error}`);
                }
                ///endianness;
    })

    //pour enlever son like
    app.post("/dislike", async (request, response) => {

        var { id_liker, id_comment }= request.body;
        id_liker = parseInt(id_liker);
        id_comment = parseInt(id_comment);

        try {
                if (!( id_liker && id_comment )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "input(s) missed",
                    });
                }

                if (!( id_liker.toString().length < 5 && id_comment.toString().length < 5 )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "one or many input too long",
                    });
                }

                if (!( typeof id_liker === "number" && typeof id_comment === "number" )) {
                    return response.status(403).json({
                        error: "ERROR",
                        message: "one or many type of input not valid",
                    });
                }

                var foundedAuthor = await prisma.user.findUnique({
                    where: {
                        idUser: id_liker,
                    }
                })

                if (!(foundedAuthor)){
                    return response.status(403).json({
                        error: "ERROR",
                        message: "User not found",
                    });
                }


                var foundedComment = await prisma.comment.findUnique({
                    where: {
                        idComment: id_comment,
                    }
                })

                if (!(foundedComment)){
                        return response.status(403).json({
                            error: "ERROR",
                            message: "Comment not found",
                        });
                    }

                    var foundedLike = await prisma.like.deleteMany({
                        where: {
                            AND: [
                                { LikerId: id_liker },
                                { commentId: id_comment }
                            ]
                        }
                    })

                    response.json("it's delete");
                }

                catch (error) {
                    response.status(403).send(`${error}`);
                }

    })

    //pour afficher toute la liste des likes
    app.get('/show_likes', async (req, res) => {
        try {
            const likes = await prisma.like.findMany({
                orderBy: [
                    {
                        idLikes: 'asc', //ou 'desc'
                    },
                ],
            })
            res.json(likes)
        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })
//#endregion

// #region recherches 
//pour recherche de sutilisateurs par debut de pseudo
    app.post('/users_search/:letter', async (req, res) => {
        let token = req.headers.authorization ;
        
        try {
        if (!token) {
            return res.status(403).json({
                error: "ERROR",
                message: "Veuillez vous reconnecter",
            });
        }

        var decoded = jwt.decode(token);
        var idConnect = parseInt(decoded.id);
        var role = decoded.role

        if (role != "ADMIN") {
            return res.status(403).json({
                error: "ERROR",
                message: "Vous n'êtes pas autorisé à voir ceci",
            });
        }

                const { letter } = req.params     //format date_input : 2022-05-19 YYYY-MM-JJ
                
                const result = await prisma.user.findMany({
                where: {
                pseudo: {
                    startsWith: letter,
                },
                },
            })
            // console.log(result)
            res.json(result)
            } catch (error) {
            res.status(403).send(`${error}`);   
            }
    })
        
    //faire une recherche d'utilisateur
    app.get("/search_pseudo/:search", async (req, res) => {
        let { search } = req.params  
        search_secur = striptags(search.trim());
        let token = req.headers.authorization ;

        try {
        if (!token) {
            return res.status(403).json({
                error: "ERROR",
                message: "Veuillez vous reconnecter",
            });
        }

        var decoded = jwt.decode(token);
        var idConnect = parseInt(decoded.id);
        var role = decoded.role

        if (role != "ADMIN") {
            return res.status(403).json({
                error: "ERROR",
                message: "Vous n'êtes pas autorisé à voir ceci",
            });
        }

            if (search_secur == "" || search_secur == "null" || search_secur == "undefined"  ) {
                res.status(403).send("An error occured, please conctact your webmaster");
            }
        
            if (search_secur.length > 20) {
                res.status(403).send("An error occured, please conctact your webmaster");
            }
            
            const result = await prisma.user.findMany({
                where: {
                    OR:[
                        { pseudo : {  contains : search_secur  } },
                        { nom : {  contains : search_secur  } },
                        { prenom : {  contains : search_secur } },
                        { email : {  contains : search_secur } },
                    ]
                    },
            })
            // console.log(result)
            res.json(result)
        } 
        catch (error) {
            res.status(403).send(`${error}`);   
            }
    })
// #endregion

// #region AUTRES PAS UTILISES

    //pour afficher tous la liste des commentaires
    app.get('/show_comments', async (req, res) => {
        try {
            const comments = await prisma.comment.findMany({
                orderBy: [
                    {
                        idComment: 'asc', //ou 'desc'
                    },
                ],
            })
            res.json(comments)
        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })

    //pour afficher un commentaire
    app.get('/show_comment/:id_comment', async (req, res) => {
        var { id_comment } = req.params ;
        id_comment = parseInt(id_comment)
        
        try {
            const comments = await prisma.comment.findUnique({
                where: {
                    idComment: id_comment
                }
            })
            res.json(comments)
        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })

    //pour savoir qui a liké
    app.get('/show_likes/:id_comment', async (req, res) => {
        var { id_comment } = req.params ;
        id_comment = parseInt(id_comment)

        try {

            if ( (!id_comment) || (id_comment === " ") || (id_comment.toString().length>5) || (!(typeof id_comment === "number")) ) {
                return res.status(403).json({
                    error: "ERROR",
                    message: " email : bad format or too long or not filled ",
                });
            }

            const likes = await prisma.like.findMany({
                where: {
                    commentId: id_comment,
                },
                orderBy: [
                    {
                        idLikes: 'asc',
                    },
                ],
            })

            res.json(likes)

        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })

    //methode get ifilike
    app.get('/show_comments2/:id_liker', async (req, res) => {
        var { id_liker } = req.params ;
        id_liker = parseInt(id_comment)

        try {
            const comments = await prisma.comment.findMany({
                orderBy: [
                    {
                        idComment: 'asc', //ou 'desc'
                    },
                ],
            })

            if(id_liker != ""){
                for(var i = 0; i < comments.length; i++){

                    const like = await prisma.like.findMany({
                        where: {
                            AND: [
                                { LikerId: id_liker },
                                { commentId: comments[i].idComment }
                            ]
                        }
                    })

                    if(like!=""){
                        comments[i].ifilike = "yes";
                    } else{
                        comments[i].ifilike = "no";
                    }
                }
            }

            else{
                res.json(comments);
            }

            res.json(comments);

        } catch (error) {
            res.status(403).send(`${error}`);
        }
    })

// #endregion