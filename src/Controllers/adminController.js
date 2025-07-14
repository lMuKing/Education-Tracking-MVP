


const User = require('../Models/userModel');
const Session = require('../Models/sessionModel');




// Users Management


exports.FindUsers_All = async (req,res) => {

try{

    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: 'No users found' });
    }

    const formattedUsers = users.map(user => ({ // Use .map() to format each user (return only needed fields).
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      user_role: user.user_role
    }));

    
    res.status(200).json({
      msg: 'Users found:',
      users: formattedUsers
    });


}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}



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
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}




exports.UpdateRoles = async (req,res) => {

try{
    const{ id , role } = req.body;

    if (!id) return res.status(400).json({ msg: 'ID is required' });
    if (!role) return res.status(400).json({ msg: 'New role is required' });

    const user = await User.findOne({ _id : id});
    if (!user) return res.status(400).json({ msg: 'User Does not Exist' });

    user.user_role = role;
    await user.save();
    
    res.status(200).json({
    msg: 'User Exist',
    user: {
    id: user._id,
    full_name: user.full_name,
    email: user.email,
    user_role: user.user_role

 } });

}catch(err){

res.status(500).json({msg : 'Update Failed', error : err.message});
}}




exports.DeleteUser = async (req,res) => {

try{


  const{ id } = req.params;

    if (!id) return res.status(400).json({ msg: 'ID is required' });

    const user = await User.findOne({ _id : id});
    if (!user) return res.status(400).json({ msg: 'User Does not Exist' });

    await User.deleteOne({ _id: id });

    res.status(200).json({ msg: 'User deleted successfully' });




}catch(err){

res.status(500).json({msg : 'Delete Failed' , error :err.message})

}
}


// Sessions Management


exports.Create_Session = async (req,res) => {

try{
const {title,description,status} = req.body;

if (!title || !description || !status) {
    return res.status(400).json({ msg: 'All fields are required' });
 }

const session = await Session.create({
title,
description,
status
})

res.status(201).json({ msg: 'Session created successfully.',
session:{
id:session._id,
title:session.title,
description:session.description,
status : session.status
}});

}catch(err){
res.json({msg : 'Session Creation Failed' , error : err.message});
}
}



exports.FindSessions_All = async (req,res) => {

try{

    const sessions = await Session.find();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: 'No sessions found' });
    }

    const formattedsessions = sessions.map(session => ({ // Use .map() to format each user (return only needed fields).
    id:session._id,
    title:session.title,
    description:session.description,
    status : session.status,
    mentor_id: session.mentor_id,
    reviews : session.reviews,
    max_students : session.max_students,
    current_enrolled_count:session.current_enrolled_count,
    duration : session.duration,
    createdAt : session.createdAt,
    updatedAt : session.updatedAt
    }));

    
    res.status(200).json({
      msg: 'sessions found:',
      sessions: formattedsessions
    });


}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}



exports.FindSession_byID = async (req,res) => {

try{

const { id } = req.params;

if (!id) return res.status(400).json({ msg: 'ID is required' });

const session = await Session.findOne({ _id : id});
if (!session) return res.status(400).json({ msg: 'Session Does not Exist' });

res.status(200).json({
 msg: 'Session Exist',
session: {
    id:session._id,
    title:session.title,
    description:session.description,
    status : session.status,
    mentor_id: session.mentor_id,
    reviews : session.reviews,
    max_students : session.max_students,
    current_enrolled_count:session.current_enrolled_count,
    duration : session.duration,
    createdAt : session.createdAt,
    updatedAt : session.updatedAt
},

});

}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}





