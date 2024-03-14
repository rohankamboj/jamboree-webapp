import { NavItem } from 'src/types/type'

const navigationItems = (): NavItem[] => {
  return [
    {
      id: '1',
      title: 'Dashboard',
      icon: 'tabler:smart-home',
      path: '/app',
    },
    {
      id: '2',
      title: 'Planner',
      icon: 'tabler:calendar',
      path: '/app/planner',
    },
    {
      id: '3',
      title: 'Classes',
      icon: 'material-symbols:school-outline',
      path: '/app/class/timeline',
    },
    {
      id: '4',
      title: 'Resources',
      icon: 'tabler:notes',
      path: '/',
      children: [
        {
          title: 'Verbal Tips',
          path: '/app/ebook/5',
        },
        {
          title: 'Sample AWA Essays',
          path: '/app/sampleessay',
        },
        {
          title: 'AWA Tips',
          path: '/app/gmatawatip',
        },
        {
          title: 'GMAT Post Class Plan',
          path: '/app/gmat-post-class-plan',
        },
        {
          title: 'RC Tool',
          path: '/app/rctool',
        },
        {
          title: 'Quant Formula List',
          path: '/app/ebook/8',
        },
      ],
    },
    {
      id: '5',
      title: 'Reading Material',
      icon: 'tabler:device-desktop-analytics',
      path: '/app/reading-material',
    },
    {
      id: '6',
      title: 'Quiz',
      icon: 'tabler:device-desktop-analytics',
      path: '/pages/quiz',
    },
    {
      id: '7',
      title: 'Analytics',
      icon: 'tabler:device-desktop-analytics',
      path: '/app/analytics/analytic',
    },
  ]
}

export default navigationItems
