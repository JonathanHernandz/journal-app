import React from 'react'
import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material"
import { TurnedInNot } from '@mui/icons-material'
import {  useSelector } from 'react-redux'
import { SideBarItem } from './SideBarItem'

export const SideBar = ({ drawerWidth }) => {
  const { displayName } = useSelector( status => status.auth );
  const { notes, active } = useSelector( status => status.journal );
  


  
  return (
    <Box component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink:{ sm:0 } }}
    >
      <Drawer 
        variant='permanent' // temporary
        open
      	sx={{ display: { xs: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          <Toolbar>
            <Typography variant='h6' noWrap component='div'>
              {displayName}
            </Typography>
          </Toolbar>
          <Divider/>

          <List>
            {
              notes.map( notes => (
                <SideBarItem key={notes.id}  { ...notes } />
              ) )
            }
          </List>
      </Drawer>
    </Box>
  )
}
