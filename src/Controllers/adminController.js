


const User = require('../Models/userModel');



exports.FindUsers_byID = async (req,res) => {

try{

const { id } = req.params;

if (!id) return res.status(400).json({ msg: 'ID is required' });

const user = await User.findOne({ _id : id});
if (!user) return res.status(400).json({ msg: 'User Does not Exist' });

res.status(200).json({
 msg: 'User Exist',
user: {
    id: user._id,
    full_name: user.full_name,
    email: user.email,
    user_role: user.user_role
},

});

}catch(err){
    res.status(500).json({ msg: 'Sreach failed', error: err.message });

}
}

