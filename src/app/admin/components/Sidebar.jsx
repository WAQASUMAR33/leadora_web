'use client';

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Tag as TagIcon,
  Brush as BrushIcon,
  Straighten as StraightenIcon,
  Settings as SettingsIcon,
  LocalOffer as LocalOfferIcon,
  Image as ImageIcon,
  Star as StarIcon,
  Article as ArticleIcon,
  Phone as PhoneIcon,
  Store as StoreIcon,
  Description as DescriptionIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Share as ShareIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 64;
const ACCENT = '#4ade80';
const BG = '#1a202c';
const BG_HOVER = '#2d3748';
const BG_SUB = '#232d3e';

const NAV_ITEMS = [
  { label: 'Home', icon: HomeIcon, href: '/admin/pages/Main' },
  {
    label: 'Customers', icon: PeopleIcon,
    children: [{ label: 'Customers', href: '/admin/pages/customer' }],
  },
  {
    label: 'Products', icon: InventoryIcon,
    children: [
      { label: 'All Products', href: '/admin/pages/Products' },
      { label: 'Add Products', href: '/admin/pages/add-product' },
    ],
  },
  {
    label: 'Orders', icon: ShoppingCartIcon, badge: true,
    children: [{ label: 'View Orders', href: '/admin/pages/orders' }],
  },
  {
    label: 'Category', icon: TagIcon,
    children: [
      { label: 'Categories', href: '/admin/pages/categories' },
      { label: 'SubCategory', href: '/admin/pages/subcategories' },
    ],
  },
  {
    label: 'Size', icon: StraightenIcon,
    children: [{ label: 'Sizes', href: '/admin/pages/size' }],
  },
  {
    label: 'Color', icon: BrushIcon,
    children: [{ label: 'Colors', href: '/admin/pages/color' }],
  },
  {
    label: 'Settings', icon: SettingsIcon,
    children: [
      { label: 'Settings', href: '/admin/pages/settings' },
      { label: 'Facebook Pixel', href: '/admin/pages/facebook-pixel' },
    ],
  },
  {
    label: 'Coupons', icon: LocalOfferIcon,
    children: [{ label: 'Coupons', href: '/admin/pages/coupons' }],
  },
  {
    label: 'Slider', icon: ImageIcon,
    children: [{ label: 'View Sliders', href: '/admin/pages/slider' }],
  },
  {
    label: 'Social Media', icon: ShareIcon,
    children: [{ label: 'Manage Social Media', href: '/admin/pages/socialmedia' }],
  },
  {
    label: 'Blog', icon: ArticleIcon,
    children: [
      { label: 'Add Blog', href: '/admin/pages/Blogs' },
      { label: 'Blog Categories', href: '/admin/pages/BlogCategory' },
    ],
  },
  {
    label: 'Reviews', icon: StarIcon,
    children: [{ label: 'View Reviews', href: '/admin/pages/reviews' }],
  },
  {
    label: 'Pages', icon: DescriptionIcon,
    children: [
      { label: 'Privacy Policy', href: '/admin/pages/addPrivacyPolicy' },
      { label: 'Terms & Conditions', href: '/admin/pages/addTermsAndConditions' },
      { label: 'Shipping Policy', href: '/admin/pages/addShippingPolicy' },
      { label: 'Return & Exchange', href: '/admin/pages/addReturnAndExchangePolicy' },
      { label: 'About Us', href: '/admin/pages/addAboutUs' },
      { label: 'Contact Us', href: '/admin/pages/addContactUs' },
    ],
  },
  { label: 'FAQs', icon: HelpOutlineIcon, href: '/admin/pages/addFAQ' },
  { label: 'Contact Info', icon: PhoneIcon, href: '/admin/pages/addContactInfo' },
  { label: 'Company Details', icon: StoreIcon, href: '/admin/pages/CompanyDetails' },
];

const Sidebar = ({ open, onToggle }) => {
  const [expanded, setExpanded] = useState({});
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) router.push("/login");
  }, [router]);

  useEffect(() => {
    if (pathname?.includes("/admin/pages/orders")) {
      const currentTotal = localStorage.getItem("totalPendingOrders") || "0";
      localStorage.setItem("lastSeenOrderCount", currentTotal);
      setPendingOrderCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await fetch(`/api/orders/pending-count?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const currentTotal = data.count;
          localStorage.setItem("totalPendingOrders", currentTotal.toString());
          const isOnOrdersPage = pathname?.includes("/admin/pages/orders");
          if (isOnOrdersPage) {
            localStorage.setItem("lastSeenOrderCount", currentTotal.toString());
            setPendingOrderCount(0);
          } else {
            const lastSeen = parseInt(localStorage.getItem("lastSeenOrderCount") || "0", 10);
            setPendingOrderCount(Math.max(0, currentTotal - lastSeen));
          }
        }
      } catch (error) {
        console.error("Failed to fetch pending orders count", error);
      }
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 5000);
    return () => clearInterval(interval);
  }, [pathname]);

  const toggleExpand = (label) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  const isActive = (href) => pathname === href;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_WIDTH,
        flexShrink: 0,
        transition: 'width 0.25s ease',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          boxSizing: 'border-box',
          bgcolor: BG,
          color: 'white',
          borderRight: '1px solid #2d3748',
          borderRadius: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 0.25s ease',
          '&::-webkit-scrollbar': { width: '3px' },
          '&::-webkit-scrollbar-track': { background: '#2d3748' },
          '&::-webkit-scrollbar-thumb': { background: ACCENT },
          scrollbarWidth: 'thin',
          scrollbarColor: `${ACCENT} #2d3748`,
        },
      }}
    >
      {/* Header / Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 1.5 : 0,
          minHeight: 64,
          borderBottom: '1px solid #2d3748',
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image
              width={30}
              height={30}
              src="/store2ulogo.png"
              alt="Logo"
              style={{ backgroundColor: 'white', padding: '2px' }}
            />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
                Store2u
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: ACCENT }}>
                ● Online
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton onClick={onToggle} sx={{ color: 'white', p: 1 }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Nav Items */}
      <List sx={{ p: 0, pt: 0.5 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isExpanded = expanded[item.label];

          if (!item.children) {
            const active = isActive(item.href);
            return (
              <Tooltip key={item.label} title={!open ? item.label : ''} placement="right" arrow>
                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    href={item.href}
                    sx={{
                      py: 1,
                      px: open ? 2 : 0,
                      justifyContent: open ? 'flex-start' : 'center',
                      bgcolor: active ? `${ACCENT}20` : 'transparent',
                      borderLeft: active ? `3px solid ${ACCENT}` : '3px solid transparent',
                      '&:hover': { bgcolor: BG_HOVER },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: active ? ACCENT : 'rgba(255,255,255,0.7)',
                        minWidth: open ? 36 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ fontSize: '1.2rem' }} />
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: active ? 600 : 400 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          }

          // Collapsible group
          const anyChildActive = item.children.some(c => isActive(c.href));
          return (
            <Box key={item.label}>
              <Tooltip title={!open ? item.label : ''} placement="right" arrow>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => open && toggleExpand(item.label)}
                    sx={{
                      py: 1,
                      px: open ? 2 : 0,
                      justifyContent: open ? 'flex-start' : 'center',
                      bgcolor: anyChildActive ? `${ACCENT}20` : 'transparent',
                      borderLeft: anyChildActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                      '&:hover': { bgcolor: BG_HOVER },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: anyChildActive ? ACCENT : 'rgba(255,255,255,0.7)',
                        minWidth: open ? 36 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <Badge badgeContent={item.badge ? pendingOrderCount : 0} color="error">
                        <Icon sx={{ fontSize: '1.2rem' }} />
                      </Badge>
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: anyChildActive ? 600 : 400 }}
                        />
                        {isExpanded
                          ? <ExpandLessIcon sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }} />
                          : <ExpandMoreIcon sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }} />
                        }
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>

              {open && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ bgcolor: BG_SUB }}>
                    {item.children.map((child) => {
                      const childActive = isActive(child.href);
                      return (
                        <ListItem key={child.label} disablePadding>
                          <ListItemButton
                            component="a"
                            href={child.href}
                            sx={{
                              py: 0.75,
                              pl: 6,
                              borderLeft: childActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                              '&:hover': { bgcolor: BG_HOVER },
                            }}
                          >
                            <ListItemText
                              primary={child.label}
                              primaryTypographyProps={{
                                fontSize: '0.77rem',
                                color: childActive ? ACCENT : 'rgba(255,255,255,0.6)',
                                fontWeight: childActive ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}

        <Divider sx={{ bgcolor: '#2d3748', my: 1 }} />

        {/* Logout */}
        <Tooltip title={!open ? 'Logout' : ''} placement="right" arrow>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                py: 1,
                px: open ? 2 : 0,
                justifyContent: open ? 'flex-start' : 'center',
                '&:hover': { bgcolor: '#3d1515' },
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#f87171',
                  minWidth: open ? 36 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ExitToAppIcon sx={{ fontSize: '1.2rem' }} />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: '0.8rem', color: '#f87171' }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
