const adminUser = require('../../models/admin/user')
const bcrypt = require('bcrypt')


//< ================================   ADMIN PANEL - LOGIN PAGE  ========================================== >
exports.page = async (req, res) => {
    try {
        res.render("admin/partial/login")
    } catch (error) {
        console.log("Error rendering admin signin Page: " + error);
    }
} 


// exports.adminUser = async (req, res) => {
//     const { email, password } = req.body;
//     const user = await adminUser.findOne({email:email});
   
//     if(!user){
        
//         // return res.redirect('/login');!!
//         return res.render("admin/partial/login");
       
//     }
   
//     const isMatch = await bcrypt.compare(password, user.password);
   
//     if(!isMatch){
//         return res.render("admin/partial/login");
//     }
//     else
//     {
//      req.session.userId= user._id 
//     return res.redirect('/admin/dashboard');
//     }
    

// }



exports.verification = async(req,res)=>{

    try{
        const email=req.body.email.toLowerCase();
        const password=req.body.password;
        const admin= await adminUser.findOne({email:email})
        if(admin){
              const hashCheck= await bcrypt.compare(password,admin.password);
        
        if(hashCheck){
          req.session.admin = req.body.email;
            console.log("admin success");
             res.redirect('/admin/dashboard');
        }else{

            res.render("admin/partial/login");
        }
    }else{
        res.render("admin/partial/login");

    }


    }catch(error){

console.log("error on admin signin"+error);

    }

}
  


//< ================================   ADMIN PANEL - LOGIN PAGE  ========================================== >