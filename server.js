const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/notesapp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err))

const UserSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    notes:[
        {
            content:{type:String,required:true},
            createdAt:{type:Date,default:Date.now}
        }
    ]
})

const User=mongoose.model('User',UserSchema)


app.post('/api/register',async(req,res) =>{
    try{
        const hashedPassword =await bcrypt.hash(req.body.password,10)
        const user=new User({
            username:req.body.username,
            password:hashedPassword,
        })
        await user.save()
        res.status(201).send({message:'UserRegister'})
    }catch(error){
        res.status(500).send({message:'Error registering user'})
    }
})

app.post('/api/login',async(req,res) =>{
    const user=await User.findOne({username:req.body.username})
    if (!user ) return res.status(400).json({error:'Invalid Username'})

        const validPassword= await bcrypt.compare(req.body.password,user.password)
        if (!validPassword) return res.status(400).json({error:'Invalid Password'})

        const token=jwt.sign({username:user.username},'secretKey')
        res.json({token,username:user.username})    
})

app.get('/api/dashboard',(req,res) =>{
    const token=req.headers['x-access-token'];
    if(!token) return res.status(401).json({error:'Access Denied'})

        try{
            const verified=jwt.verify(token,'secretKey');
             res.json({username:verified.username})

               
        }catch(error){
            res.status(400).json({error:'Invalid Token'})
        }
})


app.post('/api/notes',async(req,res) =>{
    const token=req.headers['x-access-token']
    if(!token) return res.status(401).json({error:'Access Denied'})

        try{
            const verified =jwt.verify(token,'secretKey')
            const user=await User.findOne({username:verified.username})

            if(!user) return res.status(400).json({error:'User not found'})

                const note={content:req.body.content,createAt:new Date()}
                user.notes.push(note)
                await user.save()

                res.status(201).json(user.notes)
        }catch(error){
            res.status(400).json({error:'Invalid Token'})
        }
   

   
})

app.get('/api/notes',async(req,res) =>{
    const token=req.headers['x-access-token']
    if(!token) return res.status(401).json({error:'Access Denied'})

        try{
            const verified=jwt.verify(token,'secretKey')
            const user=await User.findOne({username:verified.username})

            if(!user) return res.status(400).json({error:'User not found'})

                res.json(user.notes)
        }catch(error){
            res.status(500).json({error:'Failed'})
        }
})

app.put('/api/notes/:noteId',async(req,res) =>{
    const token=req.headers['x-access-token']
    if(!token) return res.status(401).json({error:'Access Denied'})

        try{
            const verified=jwt.verify(token,'secretKey')
            const user=await User.findOne({username:verified.username})
            if(!user) return res.status(400).json({error:'User not found'})

                const note=user.notes.id(req.params.noteId)
                if(!note) return res.status(404).json({error:'Note not found'})

                    note.content= req.body.content;
                    await user.save()

                    res.json(user.notes);
        }catch(error){
            res.status(500).json({error:'Failed'})
        }
})

app.delete('/api/notes/:noteId',async(req,res) =>{
    const token=req.headers['x-access-token']
    if(!token) return res.status(401).json({error:'Access Denied'})

        try{
            const verified=jwt.verify(token,'secretKey')
            const user=await User.findOne({username:verified.username})
            if(!user) return res.status(400).json({error:'User not found'})

                const note=user.notes.id(req.params.noteId)
                if(!note) return res.status(404).json({error:'Note not found'})

                    user.notes.pull({_id:req.params.noteId})
                    await user.save();

                    res.json({success:true,notes:user.notes})
        }catch(error){
            res.status(500).json({error:'Failed'})
        }
})





app.listen(5000,() =>{
    console.log('Server started')
})