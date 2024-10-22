import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {Container, Typography,Button, List, ListItem, Box, ListItemText,IconButton} from '@mui/material'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
const Dashboard = () => {

    const[username,setUsername]=useState('')
    const[notes,setNotes]=useState([])
    const[newNote,setNewNote]=useState('')
    const[editingNoteid,setEditingNoteid]=useState(null)
    const[editNoteContent,setEditNoteContent]=useState('')
    
    const navigate=useNavigate()

    useEffect(() =>{
        const token=localStorage.getItem('token')
       

        if(!token){
            navigate('/login')
        }else{
            axios.get('http://localhost:5000/api/dashboard',{
                headers:{'x-access-token':token}
            }).then(res =>{
                setUsername(res.data.username)
            }).catch(() =>{
                navigate('/login')
            })

            axios.get('http://localhost:5000/api/notes',{
                headers:{'x-access-token':token}
            }).then(res=>{
                setNotes(res.data)
            }).catch(() =>{
                navigate('/login')
            })
        }
        
    },[navigate])


    const addNotes= async(e) =>{
      e.preventDefault();
      const token=localStorage.getItem('token')

      try{
        const res=await axios.post('http://localhost:5000/api/notes',{
            content:newNote
        },
        {headers:{'x-access-token':token}}
    )
    setNotes(res.data)
    setNewNote('')
      }catch(err){
        alert('Faild to create note')
      }
    }

    const startEditing=(note) =>{
        setEditingNoteid(note._id)
        setEditNoteContent(note.content)
    }

    const saveEdit=async() =>{
        const token=localStorage.getItem('token')

        try{
            const res= await axios.put(`http://localhost:5000/api/notes/${editingNoteid}`,
                {content:editNoteContent},
                {headers:{'x-access-token':token}}
            )
            setNotes(res.data)
            setEditingNoteid(null)
            setEditNoteContent('')
        }catch(error){
            alert('Failed To Edit')
        }
    }

    const deleteNote= async(noteId)=>{
        const token=localStorage.getItem('token')

        try{
            const res= await axios.delete(`http://localhost:5000/api/notes/${noteId}`,
              
                {headers:{'x-access-token':token}}
            )
            setNotes(res.data.notes)
            
        }catch(error){
            alert('Failed To Edit')
        }
    }
  return (
    <div>
      

     <Container style={{backgroundColor:'lightgreen', color:'#000',padding:'20px',borderRadius:'10px'}}>
        <Typography variant="h4" >Welcome,{username}</Typography>
        <form onSubmit={addNotes}>
           <ReactQuill value={newNote}
            onChange={setNewNote}
            theme="snow"
            style={{marginBottom:'10px', backgroundColor:'#fff'}}
           ></ReactQuill>
           <Button varient="contained" color="primary" type="submit">Add Note</Button>
        </form>

        <Typography variant="h5">Your Notes</Typography>
        <List>
            {notes.map((note) =>(
                <ListItem key={note._id} style={{backgroundColor:'#444850' ,margin:'5px 0'}}>
                     {editingNoteid === note._id ? (
                     <Box>
                     <ReactQuill
                       value={editNoteContent}
                       onChange={setEditNoteContent}
                       style={{marginBottom:'10px', backgroundColor:'#fff'}}
                    / >
                        <Button  variant="contained" color="primary" onClick={saveEdit}>Save</Button>
                        
                    
                     </Box>
                     ):(
                       <ListItemText
                         primary={<span dangerouslySetInnerHTML={{__html:note.content}}></span>}
                         secondary={new Date(note.createdAt).toLocaleString()}
                         style={{color:'#fff'}}
                       >
                         
                       </ListItemText>
                     )
                     }
                     <IconButton color="primary" onClick={() => startEditing(note)}><EditIcon/></IconButton>
                     <IconButton color="error" onClick={() => deleteNote(note._id)}><DeleteIcon/></IconButton>
                </ListItem>
            ))}
        </List>
     </Container>
    </div>
  )
}

export default Dashboard
