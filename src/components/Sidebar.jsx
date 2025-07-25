import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Collapse
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar = ({ navItems = [] }) => {
    const location = useLocation();
    const drawerWidth = 220;
    const [openMenus, setOpenMenus] = useState({});

    const handleToggle = (text) => {
        setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
    };

    const isActive = (path) => location.pathname === path;
    const isChildActive = (children) => children?.some(child => isActive(child.path));

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#fff' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {navItems.map((item) => {
                        if (item.children) {
                            const open = openMenus[item.text] ?? isChildActive(item.children);
                            return (
                                <React.Fragment key={item.text}>
                                    <ListItem
                                        button
                                        onClick={() => handleToggle(item.text)}
                                        selected={isActive(item.path) || isChildActive(item.children)}
                                        sx={{
                                            color: '#000',
                                            background: isActive(item.path) || isChildActive(item.children) ? '#efe811' : 'inherit',
                                            '&.Mui-selected': { background: '#efe811', color: '#000' },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#000' }}>{<item.icon />}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.children.map((child) => (
                                                <ListItem
                                                    button
                                                    key={child.text}
                                                    component={Link}
                                                    to={child.path}
                                                    selected={isActive(child.path)}
                                                    sx={{
                                                        pl: 4,
                                                        color: '#000',
                                                        background: isActive(child.path) ? '#efe811' : 'inherit',
                                                        '&.Mui-selected': { background: '#efe811', color: '#000' },
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ color: '#000' }}>{<child.icon />}</ListItemIcon>
                                                    <ListItemText primary={child.text} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                </React.Fragment>
                            );
                        }
                        return (
                            <ListItem
                                button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                selected={isActive(item.path)}
                                sx={{
                                    color: '#000',
                                    background: isActive(item.path) ? '#efe811' : 'inherit',
                                    '&.Mui-selected': { background: '#efe811', color: '#000' },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#000' }}>{<item.icon />}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    )
}

export default Sidebar