const bcrypt = require('bcrypt')
const adminDetails = require('../../models/admin/user')
require('dotenv').config();


exports.Admin=async(req, res)=>{
    try {
        console.log("fewawevr")
        // res.render("admin/partial/managers")
        res.render("admin/partial/conform",{ message: ""})

    } catch (error) {
        console.log("Error rendering admin signin Page: " + error);
    }
    
}



exports.verification = async(req,res)=>{

    try{
        const email=req.body.email.toLowerCase();
        const password=req.body.password;
        const admin= await adminDetails.findOne({email:email})

        if (admin.email !== process.env.ADMIN_OFFICIAL) {
           return res.render("admin/partial/conform",{
                message:"You'r not Admin!!"
            })
        }
        

        if(admin){
              const hashCheck= await bcrypt.compare(password,admin.password);
        
        if(hashCheck){
          req.session.admin = req.body.email;
            console.log("admin success");
                   res.render("admin/partial/managers",{
                    message:""
                   });
        }else{

            res.render("admin/partial/conform",{
                message:""
            });
        }
    }else{
               res.render("admin/partial/conform",{
                message:""
               });

    }


    }catch(error){

console.log("error on admin signin"+error);

    }

}
  


exports.createAdmin = async(req, res) => {
    const { username, email, password } = req.body;

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
       return res.render("admin/partial/managers",{
            message:'Invalid Email Format'
        });
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
       return res.render("admin/partial/managers",{
        message:'Password needs 6 chars, 1 letter, and 1 number.'
    });

    }

    let user = await adminDetails.findOne({ email: email });

    if (!user) {
        const hashPsw = await bcrypt.hash(password, 10);
        user = new adminDetails({
            username,
            email,
            password: hashPsw
        });
        await user.save();
        res.render('admin/partial/conform',{
            message:""
        });
    } else {
        res.render("admin/partial/managers",{
            message:'Email already in use'
        });
    }
}
