import React, { useState } from 'react'
import { Button, Container,Grid,Paper, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Register = () => {
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')
    const navigate=useNavigate()


    const handleRegister= async (e) =>{
       e.preventDefault();
       try{
        await axios.post('http://localhost:5000/api/register',{username,password});
        navigate('/login')
       }catch(error){
        alert('Register Failed')
       }
    }
    const handleLogin=() =>{
       navigate('/login')
    }
  return (
    <Container component="main" maxWidth="xs" style={{mrginTop:"100px"}}>
     <Paper style={{padding:'20px', backgroundColor:'#f1f8e9'}} elevation={3}>
        <Typography variant="h5" align="center" style={{marginBottom:'20px',color:'#388e3c'}}>Register</Typography>
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
              Register
            </Button>
           </Grid>
            </Grid>
        </form>
        <Grid container justifyContent="center" style={{marginTop:'20px'}}>
            <Grid>
                <Button onClick={handleLogin}>Already have an account? Login</Button>
            </Grid>
        </Grid>
     </Paper>
    </Container>
  )
}

export default Register
