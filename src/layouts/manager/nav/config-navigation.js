// routes
import { PATH_MANAGER } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
import { useAuthContext } from 'src/auth/useAuthContext';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = () => {

  const { user } = useAuthContext();
  return [
    // GENERAL
    // ----------------------------------------------------------------------

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      items: [
        {
          title: '회원관리',
          path: PATH_MANAGER.user.root,
          icon: ICONS.user,
          children: [
            { title: '회원관리', path: PATH_MANAGER.user.list },
            { title: '회원추가', path: PATH_MANAGER.user.add },
          ],
        },
      ],
    },
    ...(user?.level >= 40 ?
      [
        {
          items: [
            {
              title: '미용실관리',
              path: PATH_MANAGER.shop.root,
              icon: ICONS.chat,
              children: [
                { title: '미용실관리', path: PATH_MANAGER.shop.list },
                { title: '미용실추가', path: PATH_MANAGER.shop.add },

              ],
            },
          ],
        },
      ] : []),
    {
      items: [
        {
          title: '미용사관리',
          path: PATH_MANAGER.teacher.root,
          icon: ICONS.invoice,
          children: [
            { title: '미용사관리', path: PATH_MANAGER.teacher.list },
            { title: '미용사추가', path: PATH_MANAGER.teacher.add },

          ],
        },
      ],
    },
    {
      items: [
        {
          title: '예약관리',
          path: PATH_MANAGER.reservation.root,
          icon: ICONS.calendar,
          children: [
            { title: '예약관리', path: PATH_MANAGER.reservation.list },
            { title: '예약추가', path: PATH_MANAGER.reservation.add },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: '포인트관리',
          path: PATH_MANAGER.point.root,
          icon: ICONS.analytics,
          children: [
            { title: '포인트관리', path: PATH_MANAGER.point.list },
            { title: '포인트추가', path: PATH_MANAGER.point.add },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: '게시물관리',
          path: PATH_MANAGER.post.root,
          icon: ICONS.booking,
          children: [
            { title: '게시물관리', path: PATH_MANAGER.post.list },
            { title: '게시물추가', path: PATH_MANAGER.post.add },

          ],
        },
      ],
    },
    {
      items: [
        {
          title: '알림관리',
          path: PATH_MANAGER.alarm.root,
          icon: <Icon icon={'mdi:bell-outline'} style={{ fontSize: '1.4rem' }} />,
          children: [
            { title: '알림관리', path: PATH_MANAGER.alarm.list },
            { title: '알림추가', path: PATH_MANAGER.alarm.add },

          ],
        },
      ],
    },
  ];
}

export default navConfig;
