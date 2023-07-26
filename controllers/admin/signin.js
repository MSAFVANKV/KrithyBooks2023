// const bcrypt = require('bcrypt')
// const adminDetails = require('../../models/admin/user')


// exports.Admin=async(req, res)=>{
//     try {
//         console.log("fewawevr")
//         res.render("admin/partial/signup")
//     } catch (error) {
//         console.log("Error rendering admin signin Page: " + error);
//     }
    
// }

// exports.createAdmin=async(req, res)=>{
//     const { username, email, password } = req.body;
//     let user = await adminDetails.findOne({email:email})

//     const hashPsw = await bcrypt.hash(password, 10);

//     user = new adminDetails({
//         username,
//         email,
//         password:hashPsw
//     })
//     await user.save();
//     res.render('admin/partial/login');


//   }