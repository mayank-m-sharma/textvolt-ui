import BarChartIcon from '@mui/icons-material/BarChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';

export const NAV_PRIMARY = [
    { text: 'Analytics', icon: BarChartIcon, path: '/analytics' },
    {
        text: 'Onboarding',
        icon: PersonAddIcon,
        path: '/onboarding',
        children: [
            { text: 'Brands', icon: BusinessIcon, path: '/onboarding/brands' },
            { text: 'Campaigns', icon: CampaignIcon, path: '/onboarding/campaigns' },
        ]
    },
];