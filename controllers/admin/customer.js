
const userDetails=require('../../models/user')


exports.viewAll = async (req, res) => {
    try {
      const allCustomers = await userDetails.find().sort({ name: -1 });
      res.render("admin/partial/customers", {
        session: req.session.admin,
        allCustomers,
        documentTitle: "Customer Management | SHOE ZONE",
      });
    } catch (error) {
      console.log("Error listing all users: " + error);
    }
  };

  exports.changeAccess = async (req, res) => {
    try {
      let currentAccess = req.body.currentAccess === "true";
      currentAccess = !currentAccess
      await userDetails.findByIdAndUpdate(req.body.managerID, {
        access: currentAccess,
      });
      res.json({
        data: { newAccess: currentAccess },
      });
    } catch (error) {
      console.log("Error changing user access: " + error);
    }
  };
  