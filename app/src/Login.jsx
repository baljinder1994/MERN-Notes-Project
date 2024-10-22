import React, { useState } from 'react'
import { Button, Container,Grid,Paper, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Login = () => {
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')
    const navigate=useNavigate()


    const handleRegister= async (e) =>{
       e.preventDefault();
       try{
       const res= await axios.post('http://localhost:5000/api/login',{username,password});
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('username',res.data.username)
        navigate('/dash')

       }catch(error){
        alert('Register Failed')
       }
    }
    
  return (
    <Container component="main" maxWidth="xs" style={{mrginTop:"100px"}}>
     <Paper style={{padding:'20px', backgroundColor:'#f1f8e9'}} elevation={3}>
        <Typography variant="h5" align="center" style={{marginBottom:'20px',color:'#388e3c'}}>Login</Typography>
        <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                   
                        <TextField fullWidth variant="outlined" label="Username" value={username}
                         style={{color:'#388e3c'}}
                         onChange={(e) => setUsername(e.target.value)}
                        > 

                        </TextField>
                    
                </Grid>
                <Grid item xs={12}>
                   
                   <TextField fullWidth variant="outlined" label="Password" value={password}
                    style={{color:'#388e3c'}}
                    onChange={(e) => setPassword(e.target.value)}
                   > 

                   </TextField>
               
           </Grid>
           <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" style={{backgroundColor:'#66bb6a',color:'#fff'}}>
              Login
            </Button>
           </Grid>
            </Grid>
        </form>
       
     </Paper>
    </Container>
  )
}

export default Login
